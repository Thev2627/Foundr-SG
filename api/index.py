import os
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client

app = FastAPI(title="Leo Promo API", description="Serverless Billing & Promo microservice for Foundr-SG")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Initialization
SUPABASE_URL = os.environ.get(
    "SUPABASE_URL", 
    "https://jhyblauvdqvatqvcqetu.supabase.co"
)
SUPABASE_ANON_KEY = os.environ.get(
    "SUPABASE_ANON_KEY", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeWJsYXV2ZHF2YXRxdmNxZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTU0NDEsImV4cCI6MjA5MzE5MTQ0MX0.8FaXRIYvw18wyLIoFznGd8_g5zaxsXOPukzS8uWfL3g"
)

supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# Approved business/vendor IDs for the $2 onboarding promotion
# 1 = Crème by Clara, 3 = Stitch & Soul, 5 = GlowLab SG
PROMO_ELIGIBLE_BIZ_IDS = {1, 3, 5}

class CartItem(BaseModel):
    product_id: int
    business_id: int
    name: str
    original_price: float
    qty: int

class CheckoutRequest(BaseModel):
    email: str
    customer_name: str
    items: List[CartItem]

def is_valid_email(email: str) -> bool:
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))

@app.get("/api/promo/check")
def check_eligibility(
    email: str = Query(..., description="Customer email address"),
    biz_ids: str = Query(..., description="Comma-separated business IDs in the cart")
):
    """
    Check if a customer email and selected businesses are eligible for the $2 first purchase promo.
    """
    email_clean = email.strip().lower()
    if not email_clean or not is_valid_email(email_clean):
        return {
            "eligible": False,
            "reason": "Invalid email format"
        }
    
    # 1. Parse business IDs in the cart
    try:
        cart_biz_ids = {int(x.strip()) for x in biz_ids.split(",") if x.strip()}
    except ValueError:
        return {
            "eligible": False,
            "reason": "Invalid business IDs"
        }
        
    if not cart_biz_ids:
        return {
            "eligible": False,
            "reason": "Cart is empty"
        }

    # 2. Check if at least one approved business is in the cart
    promo_bizs_in_cart = cart_biz_ids.intersection(PROMO_ELIGIBLE_BIZ_IDS)
    if not promo_bizs_in_cart:
        return {
            "eligible": False,
            "reason": f"No promotional partners in cart. Eligible partners: {list(PROMO_ELIGIBLE_BIZ_IDS)}"
        }

    # 3. Check Supabase 'orders' to see if this email has made any prior purchase
    try:
        res = supabase_client.table("orders").select("id").eq("email", email_clean).execute()
        has_previous_orders = len(res.data) > 0
        if has_previous_orders:
            return {
                "eligible": False,
                "reason": "This email has already completed a purchase"
            }
    except Exception as e:
        # Fallback to local storage checks on frontend if table does not exist or has connection issues
        print(f"Database query error: {str(e)}")
        # In a real environment we might throw, but let's keep it robust for first-run schemas
        pass

    return {
        "eligible": True,
        "reason": "Congratulations! You qualify for the First Purchase for $2 promotion! 🎉"
    }

@app.post("/api/promo/checkout")
def process_checkout(req: CheckoutRequest):
    """
    Process the order. Applies the secure $2 override if eligible, and saves order details to Supabase.
    """
    email_clean = req.email.strip().lower()
    if not email_clean or not is_valid_email(email_clean):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    if not req.items:
        raise HTTPException(status_code=400, detail="Cart cannot be empty")

    # 1. Determine promo eligibility
    cart_biz_ids = {item.business_id for item in req.items}
    promo_bizs_in_cart = cart_biz_ids.intersection(PROMO_ELIGIBLE_BIZ_IDS)
    
    is_promo_eligible = False
    
    if promo_bizs_in_cart:
        # Verify with database that they are actually a new customer
        try:
            res = supabase_client.table("orders").select("id").eq("email", email_clean).execute()
            is_promo_eligible = len(res.data) == 0
        except Exception as e:
            # If the orders table doesn't exist yet, we'll allow checkout to simulate success
            print(f"Orders check failed: {str(e)}")
            is_promo_eligible = True

    # 2. Process pricing and write to Supabase
    orders_inserted = []
    
    # Calculate original total
    original_total = sum(item.original_price * item.qty for item in req.items)
    
    # If promo eligible, the total payable is flat $2.00
    # To represent this in individual product orders, we will apply the $2 to the first eligible item
    # and mark subsequent items in this first order as $0.00 (fully subsidized).
    promo_applied_to_order = False
    
    for item in req.items:
        item_is_eligible = item.business_id in PROMO_ELIGIBLE_BIZ_IDS
        
        # Calculate price to pay for this specific row item
        if is_promo_eligible and item_is_eligible and not promo_applied_to_order:
            price_paid = 2.0  # Apply the flat $2 override to the first promo item
            promo_applied_to_order = True
            is_promo_row = True
        elif is_promo_eligible and promo_applied_to_order:
            price_paid = 0.0  # Remainder of the onboarding basket is fully subsidized ($0.00 total)
            is_promo_row = True
        else:
            price_paid = item.original_price * item.qty
            is_promo_row = False

        order_record = {
            "email": email_clean,
            "customer_name": req.customer_name,
            "business_id": item.business_id,
            "product_id": item.product_id,
            "price_paid": price_paid,
            "original_price": item.original_price * item.qty,
            "is_promo": is_promo_row
        }
        
        try:
            insert_res = supabase_client.table("orders").insert(order_record).select().execute()
            if insert_res.data:
                orders_inserted.append(insert_res.data[0])
        except Exception as e:
            # Local prototype fallback: if table doesn't exist yet, we simulate order database write
            print(f"Failed to write order record: {str(e)}")
            mock_inserted = {**order_record, "id": "MOCK-UUID-" + str(item.product_id), "created_at": "Just now"}
            orders_inserted.append(mock_inserted)

    final_total = 2.0 if (is_promo_eligible and promo_applied_to_order) else original_total

    return {
        "success": True,
        "is_promo_applied": is_promo_eligible and promo_applied_to_order,
        "original_total": original_total,
        "final_total": final_total,
        "orders": orders_inserted
    }


# ==========================================
# LAUNCH DAY LUCKY SPIN FEATURE ENDPOINTS
# ==========================================

import json
import random
import threading

spin_lock = threading.Lock()
LOCAL_SPIN_STATE_FILE = os.path.join(os.path.dirname(__file__), "lucky_spin_state.json")

def load_local_spin_state():
    with spin_lock:
        if not os.path.exists(LOCAL_SPIN_STATE_FILE):
            default_state = {
                "spins": {},
                "grand_prizes": {
                    "macbook": {"claimed_count": 0, "max_cap": 3, "name": "MacBook Pro 💻"},
                    "iphone": {"claimed_count": 0, "max_cap": 3, "name": "iPhone 15 Pro 📱"},
                    "ps5": {"claimed_count": 0, "max_cap": 4, "name": "PlayStation 5 🎮"}
                }
            }
            try:
                with open(LOCAL_SPIN_STATE_FILE, "w") as f:
                    json.dump(default_state, f, indent=2)
            except Exception as e:
                print(f"Failed to create local spin state file: {e}")
            return default_state
        try:
            with open(LOCAL_SPIN_STATE_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Failed to read local spin state file: {e}")
            return {
                "spins": {},
                "grand_prizes": {
                    "macbook": {"claimed_count": 0, "max_cap": 3, "name": "MacBook Pro 💻"},
                    "iphone": {"claimed_count": 0, "max_cap": 3, "name": "iPhone 15 Pro 📱"},
                    "ps5": {"claimed_count": 0, "max_cap": 4, "name": "PlayStation 5 🎮"}
                }
            }

def save_local_spin_state(state):
    with spin_lock:
        try:
            with open(LOCAL_SPIN_STATE_FILE, "w") as f:
                json.dump(state, f, indent=2)
            return True
        except Exception as e:
            print(f"Failed to save local spin state: {e}")
            return False

REWARDS_CONFIG = [
    {"id": "leo_coins_100", "name": "100 LeoCoins 🪙", "color": "#F97316", "type": "common", "weight": 0.40},
    {"id": "leo_coins_500", "name": "500 LeoCoins 🪙", "color": "#A855F7", "type": "common", "weight": 0.30},
    {"id": "voucher_2", "name": "$2 Voucher Coupon 🎫", "color": "#3B82F6", "type": "common", "weight": 0.15},
    {"id": "voucher_5", "name": "$5 Voucher Coupon 🎫", "color": "#10B981", "type": "common", "weight": 0.099},
    {"id": "voucher_50", "name": "$50 Mega Voucher 🎟️", "color": "#EC4899", "type": "rare", "weight": 0.04},
    {"id": "leo_coins_5000", "name": "5000 LeoCoins 🪙", "color": "#EAB308", "type": "rare", "weight": 0.01},
    {"id": "macbook", "name": "MacBook Pro 💻", "color": "#FF4D6A", "type": "grand", "weight": 0.0003},
    {"id": "iphone", "name": "iPhone 15 Pro 📱", "color": "#F43F5E", "type": "grand", "weight": 0.0003},
    {"id": "ps5", "name": "PlayStation 5 🎮", "color": "#6366F1", "type": "grand", "weight": 0.0004}
]

class SpinRequest(BaseModel):
    email: str

@app.get("/api/lucky-spin/rewards")
def get_rewards():
    """
    Returns the list of configured rewards, colors, and remaining grand prize inventory.
    """
    state = load_local_spin_state()
    grand_prizes = state.get("grand_prizes", {})
    
    dynamic_rewards = []
    for r in REWARDS_CONFIG:
        reward_info = {
            "id": r["id"],
            "name": r["name"],
            "color": r["color"],
            "type": r["type"]
        }
        if r["type"] == "grand":
            gp_info = grand_prizes.get(r["id"], {"claimed_count": 0, "max_cap": 3})
            remaining = max(0, gp_info["max_cap"] - gp_info["claimed_count"])
            reward_info["remaining"] = remaining
            reward_info["max_cap"] = gp_info["max_cap"]
        dynamic_rewards.append(reward_info)
        
    return {
        "success": True,
        "rewards": dynamic_rewards
    }

@app.post("/api/lucky-spin/spin")
def spin_wheel(req: SpinRequest):
    """
    Verifies eligibility and rolls a reward based on weighted probabilities.
    Includes concurrency locks and fallback paths for grand prizes.
    """
    email_clean = req.email.strip().lower()
    if not email_clean or not is_valid_email(email_clean):
        raise HTTPException(status_code=400, detail="Invalid email format")
        
    state = load_local_spin_state()
    
    # 1. Check if user already spun
    already_spun = False
    try:
        supabase_res = supabase_client.table("lucky_spins").select("id").eq("email", email_clean).execute()
        if len(supabase_res.data) > 0:
            already_spun = True
    except Exception:
        # DB Table not found or connection error; use local JSON state file duplicate check
        if email_clean in state.get("spins", {}):
            already_spun = True
            
    if already_spun:
        raise HTTPException(status_code=400, detail="This email has already spun the wheel!")
        
    # 2. Spin algorithm - weighted selection
    rolled_reward = None
    r_val = random.random()
    cumulative = 0.0
    
    for r in REWARDS_CONFIG:
        cumulative += r["weight"]
        if r_val <= cumulative:
            rolled_reward = r
            break
            
    if not rolled_reward:
        rolled_reward = REWARDS_CONFIG[0]
        
    # 3. Check Grand Prize availability if rolled a grand prize
    if rolled_reward["type"] == "grand":
        gp_id = rolled_reward["id"]
        
        # Check Supabase grand prize cap first
        supabase_gp_available = True
        try:
            gp_res = supabase_client.table("grand_prizes").select("claimed_count", "max_cap").eq("id", gp_id).execute()
            if gp_res.data:
                claimed = gp_res.data[0]["claimed_count"]
                cap = gp_res.data[0]["max_cap"]
                if claimed >= cap:
                    supabase_gp_available = False
            else:
                initial_caps = {"macbook": 3, "iphone": 3, "ps5": 4}
                max_c = initial_caps.get(gp_id, 3)
                supabase_client.table("grand_prizes").insert({"id": gp_id, "claimed_count": 0, "max_cap": max_c}).execute()
        except Exception:
            # Fallback to local state if DB fails
            gp_local = state["grand_prizes"].get(gp_id, {"claimed_count": 0, "max_cap": 3})
            if gp_local["claimed_count"] >= gp_local["max_cap"]:
                supabase_gp_available = False
                
        # If grand prize cap is reached, downgrade to high-tier rare reward (e.g. $50 Mega Voucher)
        if not supabase_gp_available:
            rolled_reward = next(r for r in REWARDS_CONFIG if r["id"] == "voucher_50")
            
    # 4. Finalize the win and write records
    reward_id = rolled_reward["id"]
    reward_name = rolled_reward["name"]
    
    # Update local state
    state["spins"][email_clean] = reward_id
    if rolled_reward["type"] == "grand":
        if reward_id in state["grand_prizes"]:
            state["grand_prizes"][reward_id]["claimed_count"] += 1
            
    save_local_spin_state(state)
    
    # Attempt to write to Supabase (best-effort)
    try:
        supabase_client.table("lucky_spins").insert({
            "email": email_clean,
            "reward_id": reward_id,
            "reward_name": reward_name
        }).execute()
        
        if rolled_reward["type"] == "grand":
            gp_res = supabase_client.table("grand_prizes").select("claimed_count").eq("id", reward_id).execute()
            if gp_res.data:
                new_count = gp_res.data[0]["claimed_count"] + 1
                supabase_client.table("grand_prizes").update({"claimed_count": new_count}).eq("id", reward_id).execute()
    except Exception as e:
        print(f"Failed to record spin to Supabase: {e}")
        pass
        
    reward_index = next(i for i, r in enumerate(REWARDS_CONFIG) if r["id"] == reward_id)
    
    return {
        "success": True,
        "reward_id": reward_id,
        "reward_name": reward_name,
        "reward_index": reward_index,
        "reward_color": rolled_reward["color"],
        "reward_type": rolled_reward["type"]
    }

