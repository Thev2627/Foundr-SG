import { useState, useRef, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Login from "./Login"

const supabase = createClient(
  "https://jhyblauvdqvatqvcqetu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoeWJsYXV2ZHF2YXRxdmNxZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTU0NDEsImV4cCI6MjA5MzE5MTQ0MX0.8FaXRIYvw18wyLIoFznGd8_g5zaxsXOPukzS8uWfL3g"
)

const businesses = [
  { id:1, name:"Crème by Clara", category:"Food & Drinks", desc:"Handcrafted French pastries made fresh every weekend", emoji:"🥐", uni:"NUS", founder:"Clara Tan", status:"approved" },
  { id:2, name:"ThreadsXo", category:"Fashion", desc:"Upcycled & thrifted fashion with a streetwear edge", emoji:"👗", uni:"NTU", founder:"Marcus Lim", status:"approved" },
  { id:3, name:"Stitch & Soul", category:"Handmade", desc:"Custom crochet plushies, keychains & accessories", emoji:"🧶", uni:"SMU", founder:"Priya Nair", status:"approved" },
  { id:4, name:"PixelBrew Studio", category:"Digital", desc:"Custom digital art, stickers and Notion templates", emoji:"🎨", uni:"NTU", founder:"Alvin Koh", status:"approved" },
  { id:5, name:"GlowLab SG", category:"Health", desc:"Handmade skincare and lip balms with natural ingredients", emoji:"🌿", uni:"NUS", founder:"Sophie Chen", status:"approved" },
]

const defaultProducts = [
  { id:1, name:"Croissant Box (6 pcs)", bizId:1, price:22, emoji:"🥐", desc:"Buttery all-butter croissants, baked fresh" },
  { id:2, name:"Matcha Madeleine Set", bizId:1, price:18, emoji:"🍵", desc:"12 pieces of matcha madeleines" },
  { id:3, name:"Vintage Denim Jacket", bizId:2, price:45, emoji:"🧥", desc:"Upcycled Y2K denim, one of a kind" },
  { id:4, name:"Graphic Tee Bundle", bizId:2, price:35, emoji:"👕", desc:"2 custom graphic tees" },
  { id:5, name:"Custom Crochet Plushie", bizId:3, price:38, emoji:"🧸", desc:"Made to order, any character" },
  { id:6, name:"Notion Template Pack", bizId:4, price:12, emoji:"📋", desc:"5 aesthetic Notion templates" },
  { id:7, name:"Rose Glow Facial Oil", bizId:5, price:28, emoji:"🌹", desc:"Natural rosehip & jojoba blend" },
  { id:8, name:"Honey Lip Set (3 pcs)", bizId:5, price:15, emoji:"🍯", desc:"3 flavours of handmade lip balm" },
]

const s = {
  page:{minHeight:"100vh",background:"#0A0A0F",fontFamily:"'Segoe UI',sans-serif",color:"#F0F0F5"},
  center:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"2rem"},
  accent:{color:"#F97316"},
  sub:{color:"#9090A8",fontSize:"14px",marginBottom:"2.5rem"},
  cards:{display:"flex",gap:"1rem",flexWrap:"wrap",justifyContent:"center"},
  portalCard:{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"16px",padding:"2rem 1.5rem",width:"200px",cursor:"pointer",textAlign:"center"},
  topbar:{background:"#111118",borderBottom:"1px solid #2A2A38",padding:"0 1.5rem",height:"56px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100},
  main:{padding:"1.5rem",maxWidth:"1100px",margin:"0 auto"},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"1rem"},
  card:{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",overflow:"hidden",cursor:"pointer"},
  cardImg:{height:"120px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"48px",background:"#1A1A24"},
  cardBody:{padding:"1rem"},
  tag:{fontSize:"10px",padding:"3px 8px",background:"#1A1A24",borderRadius:"20px",color:"#9090A8"},
  btn:{padding:"8px 16px",borderRadius:"8px",border:"none",cursor:"pointer",fontWeight:"600",fontSize:"13px",fontFamily:"inherit"},
  btnAccent:{background:"#F97316",color:"#0A0A0F"},
  btnOutline:{background:"transparent",border:"1px solid #2A2A38",color:"#9090A8"},
  btnDanger:{background:"rgba(255,77,106,0.15)",border:"1px solid rgba(255,77,106,0.2)",color:"#FF4D6A"},
  btnSuccess:{background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.2)",color:"#22C55E"},
  input:{width:"100%",padding:"10px 14px",background:"#1A1A24",border:"1px solid #2A2A38",borderRadius:"8px",color:"#F0F0F5",fontSize:"14px",fontFamily:"inherit",marginBottom:"1rem",boxSizing:"border-box"},
  statCard:{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1.25rem"},
  statsGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"1rem",marginBottom:"1.5rem"},
  navBtn:{padding:"6px 14px",borderRadius:"8px",border:"none",background:"transparent",color:"#9090A8",cursor:"pointer",fontSize:"13px",fontFamily:"inherit"},
  reviewCard:{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1rem",marginBottom:"1rem"},
  stars:{display:"flex",gap:"2px",marginBottom:"8px"},
  star:{fontSize:"16px",color:"#F97316"},
  starEmpty:{fontSize:"16px",color:"#2A2A38"},
}

function ReviewCard({ review }) {
  return (
    <div style={s.reviewCard}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
        <div style={{fontWeight:"600",fontSize:"14px"}}>{review.user_name||review.userName}</div>
        <div style={{fontSize:"12px",color:"#9090A8"}}>{review.date}</div>
      </div>
      <div style={s.stars}>
        {[...Array(5)].map((_,i)=>(
          <span key={i} style={i<review.rating?s.star:s.starEmpty}>★</span>
        ))}
      </div>
      <div style={{fontSize:"14px",color:"#F0F0F5"}}>{review.comment}</div>
    </div>
  )
}

function ReviewForm({ onSubmit, newReview, setNewReview }) {
  return (
    <div style={{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1.25rem",marginBottom:"1.5rem"}}>
      <div style={{fontWeight:"700",marginBottom:"1rem",fontSize:"14px"}}>Write a Review</div>
      <input style={s.input} placeholder="Your name" value={newReview.userName} onChange={e=>setNewReview(r=>({...r,userName:e.target.value}))} />
      <div style={{marginBottom:"1rem"}}>
        <label style={{fontSize:"13px",color:"#9090A8",marginBottom:"6px",display:"block"}}>Rating</label>
        <div style={s.stars}>
          {[...Array(5)].map((_,i)=>(
            <span key={i} style={{...s.star,cursor:"pointer",opacity:i<newReview.rating?1:0.3}} onClick={()=>setNewReview(r=>({...r,rating:i+1}))}>★</span>
          ))}
        </div>
      </div>
      <textarea style={{...s.input,minHeight:"80px",resize:"vertical"}} placeholder="Share your thoughts..." value={newReview.comment} onChange={e=>setNewReview(r=>({...r,comment:e.target.value}))} />
      <button style={{...s.btn,...s.btnAccent}} onClick={onSubmit}>Submit Review</button>
    </div>
  )
}

function ReviewSummary({ type, targetId, reviews }) {
  const targetReviews = reviews.filter(r=>r.type===type&&(r.target_id===String(targetId)||r.targetId===targetId))
  if(targetReviews.length===0) return null
  const avg = (targetReviews.reduce((sum,r)=>sum+r.rating,0)/targetReviews.length).toFixed(1)
  return (
    <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"1rem"}}>
      <div style={s.stars}>
        {[...Array(5)].map((_,i)=>(
          <span key={i} style={i<Math.floor(avg)?s.star:s.starEmpty}>★</span>
        ))}
      </div>
      <span style={{fontSize:"14px",color:"#F97316",fontWeight:"600"}}>{avg}</span>
      <span style={{fontSize:"12px",color:"#9090A8"}}>({targetReviews.length} reviews)</span>
    </div>
  )
}

function MediaFeed({ posts, onDelete, isAdmin }) {
  const [current, setCurrent] = useState(0)
  if(posts.length===0) return (
    <div style={{textAlign:"center",padding:"3rem",color:"#9090A8"}}>
      <div style={{fontSize:"40px",marginBottom:"1rem"}}>📱</div>
      <p>No posts yet — check back soon!</p>
    </div>
  )
  const post = posts[current]
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem"}}>
      <div style={{width:"100%",maxWidth:"400px",background:"#16161F",borderRadius:"16px",overflow:"hidden",border:"1px solid #2A2A38",position:"relative"}}>
        {post.type==="video"?(
          <video src={post.url} controls autoPlay muted loop style={{width:"100%",maxHeight:"600px",objectFit:"cover",display:"block"}} />
        ):(
          <img src={post.url} alt={post.caption} style={{width:"100%",maxHeight:"600px",objectFit:"cover",display:"block"}} />
        )}
        <div style={{padding:"1rem"}}>
          <div style={{fontWeight:"600",marginBottom:"4px"}}>{post.caption}</div>
          <div style={{fontSize:"12px",color:"#9090A8"}}>{post.business_name||post.businessName} · {post.date}</div>
        </div>
        {isAdmin&&(
          <button style={{position:"absolute",top:"10px",right:"10px",...s.btn,...s.btnDanger,fontSize:"11px",padding:"4px 10px"}} onClick={()=>onDelete(post.id)}>Remove</button>
        )}
      </div>
      <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
        <button style={{...s.btn,...s.btnOutline,fontSize:"12px"}} onClick={()=>setCurrent(c=>Math.max(0,c-1))} disabled={current===0}>← Prev</button>
        <span style={{fontSize:"12px",color:"#9090A8"}}>{current+1} / {posts.length}</span>
        <button style={{...s.btn,...s.btnOutline,fontSize:"12px"}} onClick={()=>setCurrent(c=>Math.min(posts.length-1,c+1))} disabled={current===posts.length-1}>Next →</button>
      </div>
    </div>
  )
}

const FALLBACK_REWARDS = [
  {"id": "leo_coins_100", "name": "100 LeoCoins 🪙", "color": "#F97316", "type": "common"},
  {"id": "leo_coins_500", "name": "500 LeoCoins 🪙", "color": "#A855F7", "type": "common"},
  {"id": "voucher_2", "name": "$2 Voucher Coupon 🎫", "color": "#3B82F6", "type": "common"},
  {"id": "voucher_5", "name": "$5 Voucher Coupon 🎫", "color": "#10B981", "type": "common"},
  {"id": "voucher_50", "name": "$50 Mega Voucher 🎟️", "color": "#EC4899", "type": "rare"},
  {"id": "leo_coins_5000", "name": "5000 LeoCoins 🪙", "color": "#EAB308", "type": "rare"},
  {"id": "macbook", "name": "MacBook Pro 💻", "color": "#FF4D6A", "type": "grand", "remaining": 3, "max_cap": 3},
  {"id": "iphone", "name": "iPhone 15 Pro 📱", "color": "#F43F5E", "type": "grand", "remaining": 3, "max_cap": 3},
  {"id": "ps5", "name": "PlayStation 5 🎮", "color": "#6366F1", "type": "grand", "remaining": 4, "max_cap": 4}
];

function LuckySpin({ showToast, userEmail, onSpinCompleted }) {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [spinning, setSpinning] = useState(false)
  const [hasSpunToday, setHasSpunToday] = useState(false)
  const [wonPrize, setWonPrize] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [checkingEligibility, setCheckingEligibility] = useState(false)
  const [countdown, setCountdown] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)

  const canvasRef = useRef(null)
  const angleRef = useRef(0)
  const animationRef = useRef(null)
  const countdownRef = useRef(null)

  // Daily spin key: per-user per-day
  const todayStr = () => new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const spinKey = () => `lucky_spin_${userEmail}_${todayStr()}`
  const spinResultKey = () => `lucky_spin_result_${userEmail}_${todayStr()}`

  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    const tick = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const diff = tomorrow - now
      if (diff <= 0) {
        clearInterval(countdownRef.current)
        setHasSpunToday(false)
        setWonPrize(null)
        setCountdown("")
        return
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0")
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0")
      const sec = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0")
      setCountdown(`${h}:${m}:${sec}`)
    }
    tick()
    countdownRef.current = setInterval(tick, 1000)
  }

  const fetchRewards = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/lucky-spin/rewards")
      const data = await res.json()
      if (data.success && data.rewards) {
        setRewards(data.rewards)
      } else {
        setRewards(FALLBACK_REWARDS)
      }
    } catch (err) {
      setRewards(FALLBACK_REWARDS)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRewards()
    // Check if already spun today
    const alreadySpun = localStorage.getItem(spinKey())
    if (alreadySpun) {
      setHasSpunToday(true)
      try { setWonPrize(JSON.parse(localStorage.getItem(spinResultKey()))) } catch(e){}
      startCountdown()
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current) }
  }, [userEmail])

  useEffect(() => {
    if (rewards.length === 0 || loading) return
    drawWheel(angleRef.current)
  }, [rewards, loading])

  const drawWheel = (angle = 0) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 18
    const numSectors = rewards.length
    const arcSize = (2 * Math.PI) / numSectors

    ctx.clearRect(0, 0, width, height)

    // Outer glow ring
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 14, 0, 2 * Math.PI)
    const glowGrad = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 14)
    glowGrad.addColorStop(0, spinning ? "rgba(249,115,22,0.6)" : "rgba(249,115,22,0.25)")
    glowGrad.addColorStop(1, "transparent")
    ctx.fillStyle = glowGrad
    ctx.fill()
    ctx.restore()

    // Outer dark backing disc
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI)
    ctx.fillStyle = "#111118"
    ctx.shadowColor = "#F97316"
    ctx.shadowBlur = spinning ? 28 : 12
    ctx.fill()
    ctx.restore()

    // Sectors
    for (let i = 0; i < numSectors; i++) {
      const sectorAngle = angle + i * arcSize
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, sectorAngle, sectorAngle + arcSize)
      ctx.closePath()
      ctx.fillStyle = rewards[i].color || "#2A2A38"
      ctx.fill()
      ctx.strokeStyle = "rgba(0,0,0,0.45)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Label
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(sectorAngle + arcSize / 2)
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"

      // Text shadow
      ctx.shadowColor = "rgba(0,0,0,0.8)"
      ctx.shadowBlur = 4
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 10px 'Segoe UI', sans-serif"
      let displayName = rewards[i].name
      if (displayName.length > 16) displayName = displayName.substring(0, 14) + "…"
      ctx.fillText(displayName, radius - 18, 0)
      ctx.restore()
    }

    // Center hub
    const hubGrad = ctx.createRadialGradient(centerX - 6, centerY - 6, 2, centerX, centerY, 34)
    hubGrad.addColorStop(0, "#2A2A38")
    hubGrad.addColorStop(1, "#111118")
    ctx.beginPath()
    ctx.arc(centerX, centerY, 34, 0, 2 * Math.PI)
    ctx.fillStyle = hubGrad
    ctx.strokeStyle = "#F97316"
    ctx.lineWidth = 3
    ctx.shadowColor = "#F97316"
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.stroke()
    ctx.shadowBlur = 0

    ctx.font = "22px serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("🦁", centerX, centerY)

    // Decorative studs around rim
    ctx.save()
    ctx.translate(centerX, centerY)
    const numStuds = 32
    for (let j = 0; j < numStuds; j++) {
      ctx.rotate((2 * Math.PI) / numStuds)
      ctx.beginPath()
      ctx.arc(radius + 4, 0, j % 2 === 0 ? 3.5 : 2, 0, 2 * Math.PI)
      const lit = spinning && (Math.floor(angle * 6) + j) % 2 === 0
      ctx.fillStyle = lit ? "#FFFFFF" : "#F97316"
      ctx.shadowColor = lit ? "#FFF" : "#F97316"
      ctx.shadowBlur = lit ? 6 : 3
      ctx.fill()
    }
    ctx.restore()
  }

  const handleSpinClick = async () => {
    if (spinning || hasSpunToday) return
    if (!userEmail) {
      setErrorMessage("⚠️ You must be logged in to spin.")
      return
    }

    setErrorMessage("")
    setCheckingEligibility(true)

    let spinResult = null
    try {
      const res = await fetch("/api/lucky-spin/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setErrorMessage(data.detail || "❌ Spin eligibility check failed.")
        setCheckingEligibility(false)
        return
      }
      spinResult = data
    } catch (err) {
      console.error("Lucky spin backend unavailable, running local simulation:", err)
      // Local daily-gate check
      const localDone = localStorage.getItem(spinKey())
      if (localDone) {
        setErrorMessage("❌ You've already spun today! Come back tomorrow.")
        setCheckingEligibility(false)
        return
      }

      const weights = FALLBACK_REWARDS.map(r =>
        r.id === "macbook" || r.id === "iphone" ? 0.0003 :
        r.id === "ps5" ? 0.0004 :
        r.id === "voucher_50" ? 0.04 :
        r.id === "leo_coins_5000" ? 0.01 :
        r.id === "voucher_5" ? 0.099 :
        r.id === "voucher_2" ? 0.15 :
        r.id === "leo_coins_500" ? 0.30 : 0.40
      )
      const rVal = Math.random()
      let cumulative = 0
      let selectedIdx = 0
      for (let i = 0; i < FALLBACK_REWARDS.length; i++) {
        cumulative += weights[i]
        if (rVal <= cumulative) { selectedIdx = i; break }
      }
      const rolled = FALLBACK_REWARDS[selectedIdx]
      spinResult = {
        success: true,
        reward_id: rolled.id,
        reward_name: rolled.name,
        reward_index: selectedIdx,
        reward_color: rolled.color,
        reward_type: rolled.type
      }
      localStorage.setItem(spinKey(), "true")
    }

    setCheckingEligibility(false)
    setSpinning(true)

    const numSectors = rewards.length || FALLBACK_REWARDS.length
    const arcSize = (2 * Math.PI) / numSectors
    const winningIndex = spinResult.reward_index
    const randomOffset = (Math.random() - 0.5) * 0.55 * arcSize
    const rotations = 7 + Math.floor(Math.random() * 3)
    const startAngle = angleRef.current % (2 * Math.PI)
    const targetAngle = rotations * 2 * Math.PI + 1.5 * Math.PI - (winningIndex + 0.5) * arcSize + randomOffset

    const duration = 6500
    const startTime = performance.now()
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const animateWheel = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentAngle = startAngle + easeOutQuart(progress) * (targetAngle - startAngle)
      angleRef.current = currentAngle
      drawWheel(currentAngle)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateWheel)
      } else {
        setSpinning(false)
        setHasSpunToday(true)
        setWonPrize(spinResult)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)

        // Save result for today
        localStorage.setItem(spinKey(), "true")
        localStorage.setItem(spinResultKey(), JSON.stringify(spinResult))

        // Update local storage balance if won coins in local simulation/offline mode
        if (spinResult.reward_id.startsWith("leo_coins_")) {
          const coinsWon = parseInt(spinResult.reward_id.split("_")[2], 10)
          const balKey = `leo_wallet_balance_${userEmail}`
          const currentBal = parseInt(localStorage.getItem(balKey) || "600", 10)
          localStorage.setItem(balKey, String(currentBal + coinsWon))

          const txKey = `leo_wallet_txs_${userEmail}`
          let txs = []
          try { txs = JSON.parse(localStorage.getItem(txKey) || "[]") } catch(e){}
          txs.unshift({
            amount: coinsWon,
            type: "credit",
            description: `Lucky Spin Reward (${spinResult.reward_name})`,
            created_at: new Date().toISOString()
          })
          localStorage.setItem(txKey, JSON.stringify(txs))
        }

        showToast(`🎉 You won: ${spinResult.reward_name}!`)
        fetchRewards()
        startCountdown()

        // Trigger wallet refresh in parent
        if (onSpinCompleted) onSpinCompleted(userEmail)
      }
    }
    animationRef.current = requestAnimationFrame(animateWheel)
  }

  const grandPrizes = rewards.filter(r => r.type === "grand")

  return (
    <div style={{maxWidth:"640px",margin:"0 auto",position:"relative"}}>
      {/* Confetti burst */}
      {showConfetti && (
        <div style={{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
          {Array.from({length:40}).map((_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${Math.random()*100}%`,
              top:"-10px",
              width:`${6+Math.random()*8}px`,
              height:`${6+Math.random()*8}px`,
              borderRadius:"2px",
              background:["#F97316","#6366F1","#22C55E","#EC4899","#EAB308","#3B82F6"][Math.floor(Math.random()*6)],
              animation:`confettiFall ${1.5+Math.random()*2}s ${Math.random()*0.5}s ease-in forwards`,
              transform:`rotate(${Math.random()*360}deg)`
            }} />
          ))}
          <style>{`@keyframes confettiFall{to{top:110vh;transform:rotate(720deg)}}`}</style>
        </div>
      )}

      <div style={{textAlign:"center",marginBottom:"2rem"}}>
        <h2 style={{fontWeight:"800",marginBottom:"8px",fontSize:"24px"}}>Daily Lucky Spin 🎡</h2>
        <p style={{color:"#9090A8",fontSize:"14px"}}>
          One free spin every day! Win LeoCoins, vouchers, or a <strong style={{color:"#F97316"}}>Grand Prize</strong>! 🏆
        </p>
        {userEmail && (
          <div style={{marginTop:"8px",display:"inline-flex",alignItems:"center",gap:"6px",background:"#16161F",border:"1px solid #2A2A38",borderRadius:"20px",padding:"4px 12px"}}>
            <span style={{fontSize:"12px",color:"#5A5A72"}}>Spinning as</span>
            <span style={{fontSize:"12px",fontWeight:"700",color:"#F97316"}}>{userEmail}</span>
          </div>
        )}
      </div>

      <div style={{
        background:"linear-gradient(145deg, #16161F, #111118)",
        border:"1px solid #2A2A38",
        borderRadius:"24px",
        padding:"2.5rem 1.5rem",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        position:"relative",
        boxShadow:"0 16px 48px rgba(0,0,0,0.4)"
      }}>
        {/* Pointer arrow */}
        <div style={{
          position:"absolute",
          top:"-2px",
          left:"50%",
          transform:"translateX(-50%)",
          width:0,height:0,
          borderLeft:"14px solid transparent",
          borderRight:"14px solid transparent",
          borderTop:"26px solid #FF4D6A",
          zIndex:10,
          filter:"drop-shadow(0 3px 6px rgba(0,0,0,0.5))"
        }} />

        {/* Wheel */}
        <div style={{position:"relative",marginBottom:"2rem",width:"360px",height:"360px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <canvas
            ref={canvasRef}
            width={360}
            height={360}
            style={{borderRadius:"50%",width:"360px",height:"360px",display:"block",cursor:(!hasSpunToday&&!spinning)?"pointer":"default"}}
            onClick={handleSpinClick}
          />
        </div>

        {!hasSpunToday ? (
          <div style={{width:"100%",maxWidth:"340px",textAlign:"center"}}>
            {errorMessage && (
              <div style={{color:"#FF4D6A",fontSize:"12px",marginBottom:"1rem",fontWeight:"600",background:"rgba(255,77,106,0.08)",borderRadius:"8px",padding:"8px 12px"}}>
                {errorMessage}
              </div>
            )}
            <button
              style={{
                ...s.btn,...s.btnAccent,
                width:"100%",
                padding:"15px",
                fontSize:"16px",
                fontWeight:"800",
                letterSpacing:"0.05em",
                borderRadius:"12px",
                boxShadow: spinning ? "none" : "0 4px 20px rgba(249,115,22,0.35)",
                opacity:(spinning||checkingEligibility) ? 0.6 : 1,
                cursor:(spinning||checkingEligibility) ? "not-allowed" : "pointer",
                transition:"all 0.2s"
              }}
              onClick={handleSpinClick}
              disabled={spinning||checkingEligibility}
            >
              {checkingEligibility ? "⏳ Checking…" : spinning ? "🦁 Spinning…" : "⚡ SPIN NOW"}
            </button>
            <div style={{marginTop:"10px",fontSize:"12px",color:"#5A5A72"}}>Or click the wheel to spin!</div>
          </div>
        ) : (
          <div style={{
            textAlign:"center",
            width:"100%",
            maxWidth:"380px"
          }}>
            {/* Prize result card */}
            <div style={{
              background:"linear-gradient(135deg, rgba(34,197,94,0.08), rgba(249,115,22,0.05))",
              border:"1px solid rgba(34,197,94,0.25)",
              borderRadius:"16px",
              padding:"1.5rem",
              marginBottom:"1.25rem"
            }}>
              <div style={{fontSize:"36px",marginBottom:"8px"}}>🎉</div>
              <div style={{fontWeight:"800",fontSize:"17px",color:"#22C55E",marginBottom:"4px"}}>You spun today!</div>
              <p style={{fontSize:"13px",color:"#9090A8",margin:"0 0 1rem 0"}}>You won:</p>
              <div style={{
                background:"#0A0A0F",
                border:"1px solid #2A2A38",
                borderRadius:"10px",
                padding:"10px 20px",
                fontWeight:"800",
                fontSize:"16px",
                color:"#F97316",
                display:"inline-block",
                marginBottom:"6px"
              }}>
                {wonPrize?.reward_name || "—"}
              </div>
              <div style={{fontSize:"11px",color:"#5A5A72",marginTop:"8px"}}>
                Reward linked to <strong style={{color:"#9090A8"}}>{userEmail}</strong>
              </div>
            </div>

            {/* Countdown */}
            <div style={{
              background:"#111118",
              border:"1px solid #2A2A38",
              borderRadius:"12px",
              padding:"1rem",
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              gap:"4px"
            }}>
              <div style={{fontSize:"12px",color:"#5A5A72",textTransform:"uppercase",letterSpacing:"0.08em"}}>Next spin in</div>
              <div style={{
                fontFamily:"'Courier New', monospace",
                fontSize:"28px",
                fontWeight:"900",
                color:"#F97316",
                letterSpacing:"0.1em",
                textShadow:"0 0 12px rgba(249,115,22,0.4)"
              }}>
                {countdown || "--:--:--"}
              </div>
              <div style={{fontSize:"11px",color:"#5A5A72"}}>Resets at midnight 🕛</div>
            </div>
          </div>
        )}
      </div>

      {/* Grand prizes tracker */}
      {grandPrizes.length > 0 && (
        <div style={{
          marginTop:"2rem",
          background:"#111118",
          border:"1px solid #2A2A38",
          borderRadius:"16px",
          padding:"1.25rem 1.5rem"
        }}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",fontWeight:"700",fontSize:"14px",marginBottom:"1rem",color:"#FF4D6A"}}>
            <span>🎁</span> Grand Prizes Remaining
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"12px"}}>
            {grandPrizes.map(gp => {
              const remaining = gp.remaining !== undefined ? gp.remaining : 3
              return (
                <div key={gp.id} style={{
                  background:"#16161F",
                  border:`1px solid ${remaining > 0 ? "#2A2A38" : "rgba(255,77,106,0.2)"}`,
                  borderRadius:"12px",
                  padding:"12px 8px",
                  textAlign:"center"
                }}>
                  <div style={{fontSize:"22px",marginBottom:"4px"}}>{gp.id==="macbook"?"💻":gp.id==="iphone"?"📱":"🎮"}</div>
                  <div style={{fontWeight:"600",fontSize:"11px",color:"#F0F0F5",marginBottom:"4px"}}>{gp.id==="macbook"?"MacBook":gp.id==="iphone"?"iPhone":"PS5"}</div>
                  <div style={{
                    fontSize:"12px",fontWeight:"800",
                    color:remaining>0?"#22C55E":"#FF4D6A",
                    background:remaining>0?"rgba(34,197,94,0.1)":"rgba(255,77,106,0.1)",
                    borderRadius:"6px",padding:"2px 6px",display:"inline-block"
                  }}>
                    {remaining>0?`${remaining} Left`:"CLAIMED"}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


export default function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("leo_session") || "null") } catch { return null }
  })
  const [portal, setPortal] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("leo_session") || "null")
      return s ? s.role : null
    } catch { return null }
  })
  const [view, setView] = useState("home")
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState(defaultProducts)
  const [bizList, setBizList] = useState(businesses)
  const [applications, setApplications] = useState([
    { id:1, bizName:"Boba Theory", founder:"Ryan Ong", uni:"SUTD", category:"Food & Drinks", email:"ryan@student.sutd.edu.sg", status:"pending", date:"2 May 2026" },
    { id:2, bizName:"CoachBot SG", founder:"Wei Jie Tan", uni:"NUS", category:"Services", email:"weijie@u.nus.edu", status:"pending", date:"1 May 2026" },
  ])
  const [selectedBiz, setSelectedBiz] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({name:"",desc:"",price:"",emoji:"",category:"Food & Drinks"})
  const [toast, setToast] = useState(null)
  const [activeFilter, setActiveFilter] = useState("All")
  const [posts, setPosts] = useState([])
  const [uploading, setUploading] = useState(false)
  const [newPost, setNewPost] = useState({caption:"",businessName:""})
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({rating:5,comment:"",userName:""})
  const [loading, setLoading] = useState(true)
  const fileRef = useRef()

  const [checkoutEmail, setCheckoutEmail] = useState("")
  const [checkoutName, setCheckoutName] = useState("")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentCardNumber, setPaymentCardNumber] = useState("")
  const [paymentExpiry, setPaymentExpiry] = useState("")
  const [paymentCvv, setPaymentCvv] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [dashboardMetrics, setDashboardMetrics] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  const fetchDashboardData = async () => {
    setDashboardLoading(true)
    try {
      const res = await fetch("/api/founder/dashboard?email=clara@student.nus.edu.sg")
      const data = await res.json()
      if (data.success) {
        setDashboardMetrics(data)
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err)
    }
    setDashboardLoading(false)
  }

  const handleApplyRecommendedPrice = async (productId, newPrice) => {
    // Optimistic frontend update first
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, price: newPrice } : p))
    // Update DB
    try {
      const { error } = await supabase.from("products").update({ price: newPrice }).eq("id", productId)
      if (error) throw error
      showToast("✓ Applied recommended price!")
      fetchDashboardData()
    } catch (err) {
      console.error("Failed to update price:", err)
      showToast("❌ Failed to update price in database")
    }
  }
  
  const [userEmail, setUserEmail] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("leo_session") || "null")
      return s ? s.email : (localStorage.getItem("leo_user_email") || "")
    } catch { return localStorage.getItem("leo_user_email") || "" }
  })
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletTransactions, setWalletTransactions] = useState([])
  const [referralCode, setReferralCode] = useState("")
  const [walletLoading, setWalletLoading] = useState(false)
  const [tempEmail, setTempEmail] = useState("")
  const [friendCode, setFriendCode] = useState("")
  
  const [bizWalletBalance, setBizWalletBalance] = useState(0)
  const [bizTransactions, setBizTransactions] = useState([])

  const fetchWalletData = async (email, isBiz = false) => {
    if (!email) return
    try {
      const res = await fetch(`/api/wallet/balance?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.success) {
        if (isBiz) {
          setBizWalletBalance(data.balance)
          setBizTransactions(data.transactions)
        } else {
          setWalletBalance(data.balance)
          setWalletTransactions(data.transactions)
        }
      }
      
      if (!isBiz) {
        const refRes = await fetch(`/api/referral/code?email=${encodeURIComponent(email)}`)
        const refData = await refRes.json()
        if (refData.success) {
          setReferralCode(refData.code)
        }
      }
    } catch (err) {
      console.error("Failed to fetch wallet:", err)
      const localBalKey = `leo_wallet_balance_${email}`
      const localTxKey = `leo_wallet_txs_${email}`
      const localRefKey = `leo_referral_code_${email}`
      
      let defaultBal = "0"
      if (email === "student@student.edu.sg") {
        defaultBal = "600"
      } else if (email === "clara@student.nus.edu.sg") {
        defaultBal = "1200"
      }
      
      const bal = parseInt(localStorage.getItem(localBalKey) || defaultBal, 10)
      let txs = []
      try { txs = JSON.parse(localStorage.getItem(localTxKey) || "[]") } catch(e){}
      
      if (isBiz) {
        setBizWalletBalance(bal)
        setBizTransactions(txs)
      } else {
        setWalletBalance(bal)
        setWalletTransactions(txs)
        
        let code = localStorage.getItem(localRefKey)
        if (!code) {
          code = `LEO-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
          localStorage.setItem(localRefKey, code)
        }
        setReferralCode(code)
      }
    }
  }

  useEffect(() => {
    if (userEmail) {
      fetchWalletData(userEmail, false)
      setCheckoutEmail(userEmail)
      
      // Real-time polling: update wallet data every 5 seconds
      const pollInterval = setInterval(() => {
        fetchWalletData(userEmail, false)
      }, 5000)
      
      return () => clearInterval(pollInterval)
    } else {
      setWalletBalance(0)
      setWalletTransactions([])
      setReferralCode("")
    }
  }, [userEmail])

  useEffect(() => {
    if (portal === "founder") {
      fetchWalletData("clara@student.nus.edu.sg", true)
      fetchDashboardData()
      
      // Real-time polling for business wallet & dashboard metrics
      const pollInterval = setInterval(() => {
        fetchWalletData("clara@student.nus.edu.sg", true)
        fetchDashboardData()
      }, 5000)
      
      return () => clearInterval(pollInterval)
    }
  }, [portal])
  const [promoEligible, setPromoEligible] = useState(false)
  const [promoReason, setPromoReason] = useState("")
  const [promoChecking, setPromoChecking] = useState(false)

  useEffect(() => {
    if (!checkoutEmail || cart.length === 0) {
      setPromoEligible(false)
      setPromoReason("")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(checkoutEmail)) {
      setPromoEligible(false)
      setPromoReason("Please enter a valid email address.")
      return
    }

    const checkPromo = async () => {
      setPromoChecking(true)
      try {
        const bizIds = [...new Set(cart.map(item => item.bizId || item.biz_id))].join(",")
        const res = await fetch(`/api/promo/check?email=${encodeURIComponent(checkoutEmail)}&biz_ids=${bizIds}`)
        const data = await res.json()
        setPromoEligible(data.eligible)
        setPromoReason(data.reason)
      } catch (err) {
        console.error("Promo eligibility check failed:", err)
        const approved = [1, 3, 5]
        const hasApproved = cart.some(item => approved.includes(item.bizId || item.biz_id))
        const hasPrev = localStorage.getItem(`ordered_${checkoutEmail}`)
        if (hasApproved && !hasPrev) {
          setPromoEligible(true)
          setPromoReason("Promo eligible! (Local fallback active) 🎉")
        } else if (!hasApproved) {
          setPromoEligible(false)
          setPromoReason("No promotional partners in cart.")
        } else {
          setPromoEligible(false)
          setPromoReason("This email has already made a purchase.")
        }
      }
      setPromoChecking(false)
    }

    const timer = setTimeout(checkPromo, 500)
    return () => clearTimeout(timer)
  }, [checkoutEmail, cart])

  const handleCheckout = () => {
    if (!checkoutEmail || !checkoutName) {
      showToast("⚠️ Please fill in your name and email to checkout")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(checkoutEmail)) {
      showToast("⚠️ Please enter a valid email address")
      return
    }
    // Show Stripe payment modal
    setShowPaymentModal(true)
  }

  const handlePaymentConfirm = async () => {
    if (!paymentCardNumber || !paymentExpiry || !paymentCvv) {
      showToast("⚠️ Please fill in card details")
      return
    }
    
    setPaymentProcessing(true)
    // Simulate 2s card authorization delay
    await new Promise(r => setTimeout(r, 2000))
    
    try {
      const items = cart.map(item => ({
        product_id: item.id,
        business_id: item.bizId || item.biz_id,
        name: item.name,
        original_price: parseFloat(item.price),
        qty: item.qty
      }))

      const res = await fetch("/api/promo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: checkoutEmail,
          customer_name: checkoutName,
          items: items
        })
      })
      const data = await res.json()
      
      if (data.success) {
        localStorage.setItem(`ordered_${checkoutEmail}`, "true")
        const currentEmail = checkoutEmail
        setCart([])
        setCheckoutEmail("")
        setCheckoutName("")
        if (data.is_promo_applied) {
          showToast("🎉 Onboarding Promo Applied! Flat $2 Order secured!")
        } else {
          showToast("🎉 Order placed successfully via Mock Stripe!")
        }
        setUserEmail(currentEmail)
        localStorage.setItem("leo_user_email", currentEmail)
        fetchWalletData(currentEmail, false)
        setShowPaymentModal(false)
        setPaymentCardNumber("")
        setPaymentExpiry("")
        setPaymentCvv("")
      } else {
        showToast("❌ Checkout failed: " + data.detail)
      }
    } catch (err) {
      console.error("Checkout failed:", err)
      localStorage.setItem(`ordered_${checkoutEmail}`, "true")
      const currentEmail = checkoutEmail

      const BIZ_OWNER_EMAILS = {
        1: "clara@student.nus.edu.sg",
        2: "marcus@student.ntu.edu.sg",
        3: "priya@student.smu.edu.sg",
        4: "alvin@student.ntu.edu.sg",
        5: "sophie@student.nus.edu.sg"
      }
      
      const balKey = `leo_wallet_balance_${currentEmail}`
      const txKey = `leo_wallet_txs_${currentEmail}`
      const currentBal = parseInt(localStorage.getItem(balKey) || "0", 10)
      const amtPaid = promoEligible ? 2.0 : cartTotal
      const cashbackEarned = Math.floor(amtPaid * 10)
      
      if (cashbackEarned > 0) {
        const newBal = currentBal + cashbackEarned
        localStorage.setItem(balKey, String(newBal))
        let txs = []
        try { txs = JSON.parse(localStorage.getItem(txKey) || "[]") } catch(e){}
        txs.unshift({
          amount: cashbackEarned,
          type: "credit",
          description: `Cashback for purchase of $${amtPaid.toFixed(2)} (Simulated)`,
          created_at: new Date().toISOString()
        })
        localStorage.setItem(txKey, JSON.stringify(txs))
      }
      
      cart.forEach(item => {
        const ownerEmail = BIZ_OWNER_EMAILS[item.bizId || item.biz_id]
        if (ownerEmail) {
          const bizBalKey = `leo_wallet_balance_${ownerEmail}`
          const bizTxKey = `leo_wallet_txs_${ownerEmail}`
          let bizTxs = []
          try { bizTxs = JSON.parse(localStorage.getItem(bizTxKey) || "[]") } catch(e){}
          const hasSaleBonus = bizTxs.some(tx => tx.description.includes("First completed sale"))
          if (!hasSaleBonus) {
            const bizBal = parseInt(localStorage.getItem(bizBalKey) || "0", 10)
            const newBizBal = bizBal + 1000
            localStorage.setItem(bizBalKey, String(newBizBal))
            bizTxs.unshift({
              amount: 1000,
              type: "credit",
              description: "First completed sale bonus (Simulated)",
              created_at: new Date().toISOString()
            })
            localStorage.setItem(bizTxKey, JSON.stringify(bizTxs))
          }
        }
      })

      setCart([])
      setCheckoutEmail("")
      setCheckoutName("")
      if (promoEligible) {
        showToast("🎉 Onboarding Promo Applied! Flat $2 Order secured! (Local simulation)")
      } else {
        showToast("🎉 Order placed successfully via Mock Stripe! (Local simulation)")
      }
      setUserEmail(currentEmail)
      localStorage.setItem("leo_user_email", currentEmail)
      fetchWalletData(currentEmail, false)
      setShowPaymentModal(false)
      setPaymentCardNumber("")
      setPaymentExpiry("")
      setPaymentCvv("")
    }
    setPaymentProcessing(false)
  }

  useEffect(()=>{ loadAll() },[])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [postsRes, reviewsRes, productsRes] = await Promise.all([
        supabase.from("posts").select("*").order("created_at",{ascending:false}),
        supabase.from("reviews").select("*").order("created_at",{ascending:false}),
        supabase.from("products").select("*").order("created_at",{ascending:true}),
      ])
      if(postsRes.data) setPosts(postsRes.data)
      if(reviewsRes.data) setReviews(reviewsRes.data)
      if(productsRes.data&&productsRes.data.length>0) {
        setProducts(productsRes.data.map(p=>({...p,bizId:p.biz_id,desc:p.description})))
      }
    } catch(err){ console.error(err) }
    setLoading(false)
  }

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2500) }
  const addToCart = (p) => { setCart(c=>{ const e=c.find(x=>x.id===p.id); return e?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{...p,qty:1}] }); showToast(`✓ ${p.name} added to cart!`) }
  const cartCount = cart.reduce((a,b)=>a+b.qty,0)
  const cartTotal = cart.reduce((a,b)=>a+b.price*b.qty,0)
  const enterPortal = (p) => { setPortal(p); setView("home") }
  const categories = ["All","Food & Drinks","Fashion","Handmade","Digital","Health"]
  const approvedBiz = bizList.filter(b=>b.status==="approved")
  const filteredBiz = activeFilter==="All"?approvedBiz:approvedBiz.filter(b=>b.category===activeFilter)
  const founderBiz = bizList[0]
  const founderProducts = products.filter(p=>(p.bizId||p.biz_id)===founderBiz.id)

  const approve = (id) => { setApplications(a=>a.map(x=>x.id===id?{...x,status:"approved"}:x)); setBizList(b=>b.map(x=>x.name===applications.find(a=>a.id===id)?.bizName?{...x,status:"approved"}:x)); showToast("✓ Application approved!") }
  const reject = (id) => { setApplications(a=>a.map(x=>x.id===id?{...x,status:"rejected"}:x)); showToast("✗ Application rejected") }

  const addProduct = async () => {
    if(!newProduct.name||!newProduct.price){showToast("⚠️ Fill in name and price");return}
    const p = { name:newProduct.name, description:newProduct.desc, price:parseFloat(newProduct.price), emoji:newProduct.emoji||"📦", biz_id:founderBiz.id }
    const { data, error } = await supabase.from("products").insert([p]).select()
    if(error){ showToast("❌ Failed to add product"); console.error(error); return }
    setProducts(prev=>[...prev,{...data[0],bizId:data[0].biz_id,desc:data[0].description}])
    setNewProduct({name:"",desc:"",price:"",emoji:"",category:"Food & Drinks"})

    try {
      const earnRes = await fetch("/api/wallet/earn-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "clara@student.nus.edu.sg",
          business_id: founderBiz.id
        })
      })
      const earnData = await earnRes.json()
      if (earnData.success) {
        showToast("✓ Product added! Earned +200 LeoCoins! 🪙")
        setBizWalletBalance(earnData.balance)
        fetchWalletData("clara@student.nus.edu.sg", true)
      } else {
        showToast("✓ Product added!")
      }
    } catch (err) {
      console.error("Listing reward failed, running fallback:", err)
      const balKey = "leo_wallet_balance_clara@student.nus.edu.sg"
      const txKey = "leo_wallet_txs_clara@student.nus.edu.sg"
      const currentBal = parseInt(localStorage.getItem(balKey) || "0", 10)
      
      let txs = []
      try { txs = JSON.parse(localStorage.getItem(txKey) || "[]") } catch(e){}
      const alreadyRewarded = txs.some(tx => tx.description.includes("First product listing"))
      if (!alreadyRewarded) {
        const newBal = currentBal + 200
        localStorage.setItem(balKey, String(newBal))
        txs.unshift({
          amount: 200,
          type: "credit",
          description: "First product listing bonus",
          created_at: new Date().toISOString()
        })
        localStorage.setItem(txKey, JSON.stringify(txs))
        setBizWalletBalance(newBal)
        setBizTransactions(txs)
        showToast("✓ Product added! Earned +200 LeoCoins! (Simulated) 🪙")
      } else {
        showToast("✓ Product added!")
      }
    }
  }

  const deleteProduct = async (id) => {
    await supabase.from("products").delete().eq("id",id)
    setProducts(prev=>prev.filter(p=>p.id!==id))
    showToast("🗑️ Product removed")
  }

  const uploadMedia = async (e) => {
    const file = e.target.files[0]
    if(!file) return
    if(!newPost.caption||!newPost.businessName){showToast("⚠️ Fill in caption and business name first");fileRef.current.value="";return}
    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const filename = `${Date.now()}.${ext}`
      const { error:uploadError } = await supabase.storage.from("Media").upload(filename,file,{upsert:true})
      if(uploadError) throw uploadError
      const { data:urlData } = supabase.storage.from("Media").getPublicUrl(filename)
      const isVideo = file.type.startsWith("video")
      const post = { caption:newPost.caption, business_name:newPost.businessName, url:urlData.publicUrl, type:isVideo?"video":"image", date:new Date().toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"numeric"}) }
      const { data, error } = await supabase.from("posts").insert([post]).select()
      if(error) throw error
      setPosts(prev=>[data[0],...prev])
      setNewPost({caption:"",businessName:""})
      fileRef.current.value=""
      showToast("✓ Post uploaded!")
    } catch(err){
      showToast("❌ Upload failed: "+err.message)
      console.error("Full error:",err)
    }
    setUploading(false)
  }

  const deletePost = async (id) => {
    await supabase.from("posts").delete().eq("id",id)
    setPosts(prev=>prev.filter(p=>p.id!==id))
    showToast("🗑️ Post removed")
  }

  const addReview = async (type, targetId) => {
    if(!newReview.comment||!newReview.userName){showToast("⚠️ Fill in name and comment");return}
    const review = { type, target_id:String(targetId), user_name:newReview.userName, rating:newReview.rating, comment:newReview.comment, date:new Date().toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"numeric"}) }
    const { data, error } = await supabase.from("reviews").insert([review]).select()
    if(error){ showToast("❌ Failed to submit review"); console.error(error); return }
    setReviews(prev=>[data[0],...prev])
    setNewReview({rating:5,comment:"",userName:""})
    showToast("✓ Review added!")
  }

  const getBizReviews = (bizId) => reviews.filter(r=>r.type==="business"&&r.target_id===String(bizId))
  const getProductReviews = (productId) => reviews.filter(r=>r.type==="product"&&r.target_id===String(productId))

  // LOGIN PAGE — show when no session
  if (!session) return (
    <Login onLogin={(sess) => {
      setSession(sess)
      setPortal(sess.role)
      setUserEmail(sess.email)
      setView("home")
    }} />
  )

  if(loading) return (
    <div style={{...s.page,...s.center}}>
      <div style={{fontSize:"32px",marginBottom:"1rem"}}>⏳</div>
      <p style={{color:"#9090A8"}}>Loading Leo...</p>
    </div>
  )

  return (
    <div style={s.page}>
      {toast&&<div style={{position:"fixed",bottom:"1.5rem",right:"1.5rem",background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"12px 16px",fontSize:"13px",zIndex:999,boxShadow:"0 8px 24px rgba(0,0,0,0.4)"}}>{toast}</div>}

      <div style={s.topbar}>
        <div style={{fontWeight:"400",fontSize:"22px",fontFamily:"'Pacifico',cursive",color:"#E8821A",display:"flex",alignItems:"center",gap:"8px"}}>
          🦁 Leo
        </div>
        <div style={{display:"flex",gap:"4px"}}>
          {portal==="consumer"&&<>
            <button style={{...s.navBtn,...(view==="home"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("home")}>Discover</button>
            <button style={{...s.navBtn,...(view==="shop"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("shop")}>Shop</button>
            <button style={{...s.navBtn,...(view==="feed"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("feed")}>Feed 📱</button>
            <button style={{...s.navBtn,...(view==="cart"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("cart")}>Cart {cartCount>0&&<span style={{background:"#F97316",color:"#0A0A0F",borderRadius:"50%",width:"16px",height:"16px",fontSize:"10px",fontWeight:"800",display:"inline-flex",alignItems:"center",justifyContent:"center",marginLeft:"4px"}}>{cartCount}</span>}</button>
            <button style={{...s.navBtn,...(view==="spin"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("spin")}>Lucky Spin 🎡</button>
            <button style={{...s.navBtn,...(view==="wallet"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("wallet")}>
              🪙 {userEmail ? `${walletBalance.toLocaleString()} Coins` : "Wallet"}
            </button>
          </>}
          {portal==="founder"&&<>
            <button style={{...s.navBtn,...(view==="home"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("home")}>Dashboard</button>
            <button style={{...s.navBtn,...(view==="feed"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("feed")}>Feed 📱</button>
            <button style={{...s.navBtn,...(view==="products"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("products")}>Products</button>
            <button style={{...s.navBtn,...(view==="wallet"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("wallet")}>
              🪙 {bizWalletBalance.toLocaleString()} Coins
            </button>
          </>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          {session && (
            <div style={{fontSize:"12px",color:"#9090A8",display:"flex",alignItems:"center",gap:"6px"}}>
              <div style={{width:"26px",height:"26px",borderRadius:"50%",background:"linear-gradient(135deg,#F97316,#EA580C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:"700",color:"#0A0A0F"}}>
                {session.name ? session.name[0].toUpperCase() : "U"}
              </div>
              <span style={{maxWidth:"130px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.name || session.email}</span>
            </div>
          )}
          <button style={{...s.btn,...s.btnOutline,fontSize:"12px"}} onClick={() => {
            localStorage.removeItem("leo_session")
            localStorage.removeItem("leo_user_email")
            setSession(null)
            setPortal(null)
            setUserEmail("")
            setView("home")
          }}>Sign Out</button>
        </div>
      </div>

      <div style={s.main}>

        {/* FEED */}
        {(portal==="consumer"||portal==="founder")&&view==="feed"&&(
          <div>
            <div style={{marginBottom:"1.5rem"}}><h2 style={{fontWeight:"800",marginBottom:"4px"}}>Featured 📱</h2><p style={{color:"#9090A8",fontSize:"14px"}}>Admin-curated content from verified student businesses</p></div>
            <MediaFeed posts={posts} isAdmin={false} onDelete={()=>{}} />
          </div>
        )}

        {/* CONSUMER HOME */}
        {portal==="consumer"&&view==="home"&&(
          <div>
            <div style={{marginBottom:"1.5rem"}}><h2 style={{fontWeight:"800",marginBottom:"4px"}}>Discover Student Businesses 🔍</h2><p style={{color:"#9090A8",fontSize:"14px"}}>All verified student-run</p></div>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"1.25rem"}}>
              {categories.map(c=><button key={c} onClick={()=>setActiveFilter(c)} style={{...s.btn,padding:"5px 14px",fontSize:"12px",background:activeFilter===c?"#F97316":"transparent",color:activeFilter===c?"#0A0A0F":"#9090A8",border:"1px solid "+(activeFilter===c?"#F97316":"#2A2A38")}}>{c}</button>)}
            </div>
            <div style={s.grid}>
              {filteredBiz.map(b=>(
                <div key={b.id} style={s.card} onClick={()=>{setSelectedBiz(b);setView("bizdetail")}}>
                  <div style={s.cardImg}>{b.emoji}</div>
                  <div style={s.cardBody}>
                    <div style={{fontWeight:"600",marginBottom:"4px"}}>{b.name}</div>
                    <div style={{fontSize:"12px",color:"#9090A8",marginBottom:"8px"}}>{b.desc}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={s.tag}>{b.uni}</span>
                      <span style={{fontSize:"10px",color:"#F97316",fontWeight:"600"}}>✓ Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BIZ DETAIL */}
        {portal==="consumer"&&view==="bizdetail"&&selectedBiz&&(
          <div>
            <button style={{...s.btn,...s.btnOutline,marginBottom:"1rem",fontSize:"12px"}} onClick={()=>setView("home")}>← Back</button>
            <div style={{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1.5rem",marginBottom:"1.5rem",display:"flex",gap:"1rem",alignItems:"center"}}>
              <div style={{fontSize:"40px",width:"64px",height:"64px",background:"#1A1A24",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{selectedBiz.emoji}</div>
              <div>
                <div style={{fontWeight:"700",fontSize:"18px",marginBottom:"2px"}}>{selectedBiz.name} <span style={{color:"#F97316",fontSize:"13px"}}>✓</span></div>
                <div style={{color:"#9090A8",fontSize:"13px"}}>{selectedBiz.category} · {selectedBiz.uni} · by {selectedBiz.founder}</div>
                <div style={{color:"#9090A8",fontSize:"13px",marginTop:"6px"}}>{selectedBiz.desc}</div>
              </div>
            </div>
            <div style={{fontWeight:"700",fontSize:"12px",color:"#5A5A72",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"1rem"}}>Products</div>
            <div style={s.grid}>
              {products.filter(p=>(p.bizId||p.biz_id)===selectedBiz.id).map(p=>(
                <div key={p.id} style={s.card} onClick={()=>{setSelectedProduct(p);setView("productdetail")}}>
                  <div style={s.cardImg}>{p.emoji}</div>
                  <div style={s.cardBody}>
                    <div style={{fontWeight:"600",marginBottom:"4px"}}>{p.name}</div>
                    <div style={{fontSize:"12px",color:"#9090A8",marginBottom:"8px"}}>{p.desc||p.description}</div>
                    <div style={{fontSize:"18px",fontWeight:"800",color:"#F97316",marginBottom:"8px"}}>${p.price}</div>
                    <button style={{...s.btn,...s.btnAccent,width:"100%"}} onClick={e=>{e.stopPropagation();addToCart(p)}}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontWeight:"700",fontSize:"18px",marginTop:"2rem",marginBottom:"1rem"}}>Business Reviews</div>
            <ReviewSummary type="business" targetId={selectedBiz.id} reviews={reviews} />
            <ReviewForm onSubmit={()=>addReview("business",selectedBiz.id)} newReview={newReview} setNewReview={setNewReview} />
            {getBizReviews(selectedBiz.id).map(r=><ReviewCard key={r.id} review={r} />)}
          </div>
        )}

        {/* PRODUCT DETAIL */}
        {portal==="consumer"&&view==="productdetail"&&selectedProduct&&(
          <div>
            <button style={{...s.btn,...s.btnOutline,marginBottom:"1rem",fontSize:"12px"}} onClick={()=>setView("bizdetail")}>← Back</button>
            <div style={{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"2rem",marginBottom:"1.5rem",display:"flex",gap:"2rem",alignItems:"flex-start",flexWrap:"wrap"}}>
              <div style={{fontSize:"80px",width:"120px",height:"120px",background:"#1A1A24",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center"}}>{selectedProduct.emoji}</div>
              <div style={{flex:1,minWidth:"250px"}}>
                <div style={{fontWeight:"700",fontSize:"24px",marginBottom:"8px"}}>{selectedProduct.name}</div>
                <div style={{fontSize:"16px",color:"#9090A8",marginBottom:"1rem"}}>{selectedProduct.desc||selectedProduct.description}</div>
                <div style={{fontSize:"32px",fontWeight:"800",color:"#F97316",marginBottom:"1rem"}}>${selectedProduct.price}</div>
                <button style={{...s.btn,...s.btnAccent,padding:"12px 24px",fontSize:"16px"}} onClick={()=>addToCart(selectedProduct)}>Add to Cart</button>
              </div>
            </div>
            <div style={{fontWeight:"700",fontSize:"18px",marginBottom:"1rem"}}>Reviews</div>
            <ReviewSummary type="product" targetId={selectedProduct.id} reviews={reviews} />
            <ReviewForm onSubmit={()=>addReview("product",selectedProduct.id)} newReview={newReview} setNewReview={setNewReview} />
            {getProductReviews(selectedProduct.id).map(r=><ReviewCard key={r.id} review={r} />)}
          </div>
        )}

        {/* SHOP */}
        {portal==="consumer"&&view==="shop"&&(
          <div>
            <div style={{marginBottom:"1.5rem"}}><h2 style={{fontWeight:"800",marginBottom:"4px"}}>Shop All Products 🛒</h2></div>
            <div style={s.grid}>
              {products.map(p=>{const b=bizList.find(x=>x.id===(p.bizId||p.biz_id));return(
                <div key={p.id} style={s.card} onClick={()=>{setSelectedProduct(p);setView("productdetail")}}>
                  <div style={s.cardImg}>{p.emoji}</div>
                  <div style={s.cardBody}>
                    <div style={{fontWeight:"600",marginBottom:"2px"}}>{p.name}</div>
                    <div style={{fontSize:"11px",color:"#9090A8",marginBottom:"6px"}}>by {b?.name}</div>
                    <div style={{fontSize:"12px",color:"#9090A8",marginBottom:"8px"}}>{p.desc||p.description}</div>
                    <div style={{fontSize:"18px",fontWeight:"800",color:"#F97316",marginBottom:"8px"}}>${p.price}</div>
                    <button style={{...s.btn,...s.btnAccent,width:"100%"}} onClick={e=>{e.stopPropagation();addToCart(p)}}>Add to Cart</button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* CART */}
        {portal==="consumer"&&view==="cart"&&(
          <div>
            <div style={{marginBottom:"1.5rem"}}><h2 style={{fontWeight:"800",marginBottom:"4px"}}>Your Cart 🛒</h2></div>
            {cart.length===0?<div style={{textAlign:"center",padding:"3rem",color:"#9090A8"}}><div style={{fontSize:"40px",marginBottom:"1rem"}}>🛒</div><p>Your cart is empty</p></div>:
            <div>
              {/* Cart Items List */}
              <div style={{marginBottom:"2rem"}}>
                {cart.map(c=>{
                  const b = bizList.find(x => x.id === (c.bizId || c.biz_id));
                  return (
                    <div key={c.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:"1px solid #2A2A38"}}>
                      <div style={{fontSize:"28px",width:"44px",height:"44px",background:"#1A1A24",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>{c.emoji}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:"600",fontSize:"13px"}}>{c.name}</div>
                        <div style={{fontSize:"12px",color:"#9090A8"}}>by {b ? b.name : "Student Business"} · Qty: {c.qty}</div>
                      </div>
                      <div style={{fontWeight:"700",color:"#F97316"}}>${c.price*c.qty}</div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Status / Banner */}
              {promoEligible && (
                <div style={{
                  background: "rgba(249, 115, 22, 0.08)",
                  border: "1px dashed rgba(249, 115, 22, 0.4)",
                  borderRadius: "12px",
                  padding: "1rem",
                  marginBottom: "1.5rem"
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px",color:"#F97316",fontWeight:"700",fontSize:"14px",marginBottom:"4px"}}>
                    <span>🎉</span> Onboarding Promotion Active!
                  </div>
                  <div style={{fontSize:"12px",color:"#9090A8"}}>
                    Your first purchase qualifies for our flat <strong>$2.00</strong> onboarding special! The remaining balance is fully subsidized.
                  </div>
                </div>
              )}

              {/* Checkout Form */}
              <div style={{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1.25rem",marginBottom:"1.5rem"}}>
                <div style={{fontWeight:"700",marginBottom:"1rem",fontSize:"14px"}}>Checkout Contact Information 🚚</div>
                <label style={{fontSize:"12px",color:"#9090A8",marginBottom:"6px",display:"block"}}>Full Name</label>
                <input 
                  style={s.input} 
                  placeholder="Enter your full name" 
                  value={checkoutName} 
                  onChange={e=>setCheckoutName(e.target.value)} 
                />
                
                <label style={{fontSize:"12px",color:"#9090A8",marginBottom:"6px",display:"block"}}>Email Address</label>
                <input 
                  style={{
                    ...s.input,
                    borderColor: promoChecking ? "#F97316" : (checkoutEmail && !promoEligible && checkoutEmail.includes("@") ? "#FF4D6A" : "#2A2A38")
                  }} 
                  placeholder="Enter email to check promo eligibility" 
                  value={checkoutEmail} 
                  onChange={e=>setCheckoutEmail(e.target.value)} 
                />
                
                {promoReason && (
                  <div style={{
                    fontSize: "11px", 
                    color: promoEligible ? "#22C55E" : "#9090A8", 
                    marginTop: "-8px", 
                    marginBottom: "0.5rem",
                    fontWeight: "500"
                  }}>
                    {promoChecking ? "Checking eligibility... ⏳" : promoReason}
                  </div>
                )}
              </div>

              {/* Pricing Totals & Checkout Button */}
              <div style={{
                background: "#111118",
                border: "1px solid #2A2A38",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <div style={{fontSize:"12px",color:"#9090A8"}}>Total Amount Payable</div>
                  {promoEligible ? (
                    <div style={{display:"flex",alignItems:"baseline",gap:"8px",marginTop:"4px"}}>
                      <span style={{fontSize:"24px",fontWeight:"800",color:"#F97316"}}>$2.00</span>
                      <span style={{fontSize:"14px",color:"#5A5A72",textDecoration:"line-through"}}>${cartTotal.toFixed(2)}</span>
                      <span style={{
                        fontSize: "10px",
                        background: "rgba(34,197,94,0.15)",
                        color: "#22C55E",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontWeight: "700"
                      }}>
                        Saved ${(cartTotal - 2.0).toFixed(2)}!
                      </span>
                    </div>
                  ) : (
                    <div style={{fontSize:"24px",fontWeight:"800",color:"#F97316",marginTop:"4px"}}>${cartTotal.toFixed(2)}</div>
                  )}
                </div>
                
                <button 
                  style={{
                    ...s.btn,
                    ...s.btnAccent,
                    padding: "12px 24px",
                    fontSize: "14px",
                    opacity: (!checkoutEmail || !checkoutName) ? 0.5 : 1,
                    cursor: (!checkoutEmail || !checkoutName) ? "not-allowed" : "pointer"
                  }} 
                  onClick={handleCheckout}
                  disabled={!checkoutEmail || !checkoutName}
                >
                  {promoEligible ? "Claim $2 Offer! ⚡" : "Place Order →"}
                </button>
              </div>
            </div>}

            {/* Premium Stripe elements payment overlay modal */}
            {showPaymentModal && (
              <div style={{
                position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(10, 10, 15, 0.8)", backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyOrigin: "center", justifyContent: "center",
                zIndex: 9999
              }}>
                <div style={{
                  background: "#16161F", border: "1px solid #2A2A38", borderRadius: "16px",
                  padding: "2rem", width: "100%", maxWidth: "400px", boxShadow: "0 24px 60px rgba(0,0,0,0.6)"
                }}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem"}}>
                    <h3 style={{fontWeight:"800", fontSize:"18px", color:"#F97316"}}>💳 Stripe Secure Checkout</h3>
                    <button style={{background:"transparent", border:"none", color:"#9090A8", cursor:"pointer", fontSize:"18px"}} onClick={() => setShowPaymentModal(false)}>✕</button>
                  </div>
                  
                  <div style={{background:"#111118", border:"1px solid #2A2A38", borderRadius:"8px", padding:"10px 14px", marginBottom:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <span style={{fontSize:"13px", color:"#9090A8"}}>Total Amount Payable:</span>
                    <span style={{fontSize:"16px", fontWeight:"800", color:"#22C55E"}}>${promoEligible ? "2.00" : cartTotal.toFixed(2)}</span>
                  </div>

                  <div style={{marginBottom:"1rem"}}>
                    <label style={{fontSize:"12px", color:"#9090A8", display:"block", marginBottom:"6px"}}>Card Number</label>
                    <input 
                      style={s.input} 
                      placeholder="4242 4242 4242 4242"
                      value={paymentCardNumber}
                      onChange={e => setPaymentCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      maxLength={19}
                    />
                  </div>

                  <div style={{display:"flex", gap:"1rem", marginBottom:"1.5rem"}}>
                    <div style={{flex: 1}}>
                      <label style={{fontSize:"12px", color:"#9090A8", display:"block", marginBottom:"6px"}}>Expiry Date</label>
                      <input 
                        style={s.input} 
                        placeholder="MM/YY" 
                        value={paymentExpiry}
                        onChange={e => setPaymentExpiry(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                    <div style={{flex: 1}}>
                      <label style={{fontSize:"12px", color:"#9090A8", display:"block", marginBottom:"6px"}}>CVC / CVV</label>
                      <input 
                        style={s.input} 
                        placeholder="123" 
                        value={paymentCvv}
                        onChange={e => setPaymentCvv(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <button 
                    style={{...s.btn, ...s.btnAccent, width:"100%", padding:"12px", fontSize:"14px", fontWeight:"700"}}
                    onClick={handlePaymentConfirm}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? "⚡ Processing Payment via Stripe..." : `Pay $${promoEligible ? "2.00" : cartTotal.toFixed(2)} Now`}
                  </button>
                  <div style={{textAlign:"center", marginTop:"10px", fontSize:"11px", color:"#5A5A72"}}>
                    🔒 Powered by Stripe Sandbox
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LUCKY SPIN EVENT */}
        {portal==="consumer"&&view==="spin"&&(
          <LuckySpin 
            showToast={showToast} 
            userEmail={userEmail}
            onSpinCompleted={(email) => {
              fetchWalletData(email, false)
            }}
          />
        )}

        {/* WALLET VIEW (BOTH CONSUMER AND FOUNDER) */}
        {(portal==="consumer"||portal==="founder")&&view==="wallet"&&(
          <div style={{maxWidth:"600px", margin:"0 auto"}}>
            <div style={{marginBottom:"1.5rem"}}>
              <h2 style={{fontWeight:"800", marginBottom:"4px"}}>LeoCash Wallet 🪙</h2>
              <p style={{color:"#9090A8", fontSize:"14px"}}>
                {portal==="founder" ? "Manage business earnings and bonuses" : "Manage your LeoCoins, referral rewards, and earnings"}
              </p>
            </div>
            
            {portal==="consumer" && !userEmail ? (
              <div style={{background:"#16161F", border:"1px solid #2A2A38", borderRadius:"16px", padding:"2rem", textAlign:"center"}}>
                <div style={{fontSize:"48px", marginBottom:"1rem"}}>🪙</div>
                <h3 style={{fontWeight:"800", marginBottom:"8px"}}>Unlock Your Wallet</h3>
                <p style={{color:"#9090A8", fontSize:"14px", marginBottom:"1.5rem"}}>
                  Enter your student email address to check your balance, view transaction history, and refer friends!
                </p>
                <input 
                  style={{...s.input, textAlign:"center", padding:"12px"}}
                  type="email"
                  placeholder="name@student.edu.sg"
                  value={tempEmail}
                  onChange={e => setTempEmail(e.target.value)}
                />
                <button 
                  style={{...s.btn, ...s.btnAccent, width:"100%", padding:"12px", fontSize:"14px"}}
                  onClick={() => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    if (!emailRegex.test(tempEmail)) {
                      showToast("⚠️ Please enter a valid email address.")
                      return
                    }
                    setUserEmail(tempEmail.trim().lower())
                    localStorage.setItem("leo_user_email", tempEmail.trim().lower())
                    showToast("✓ Wallet Unlocked! 🎉")
                  }}
                >
                  Access Wallet ⚡
                </button>
              </div>
            ) : (
              <div>
                {/* Wallet Balance Card */}
                <div style={{
                  background: "linear-gradient(135deg, #1E1B4B 0%, #111118 100%)",
                  border: "1px solid #312E81",
                  borderRadius: "20px",
                  padding: "2rem",
                  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.15)",
                  textAlign: "center",
                  marginBottom: "2rem",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-50px",
                    left: "-50px",
                    width: "150px",
                    height: "150px",
                    background: "rgba(249, 115, 22, 0.15)",
                    filter: "blur(50px)",
                    borderRadius: "50%"
                  }} />
                  <div style={{fontSize:"13px", color:"#9090A8", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"8px"}}>Available Balance</div>
                  <div style={{fontSize:"40px", fontWeight:"900", color:"#F97316", textShadow:"0 0 10px rgba(249, 115, 22, 0.3)"}}>
                    🪙 {(portal==="founder" ? bizWalletBalance : walletBalance).toLocaleString()} <span style={{fontSize:"20px", fontWeight:"600", color:"#9090A8"}}>LeoCoins</span>
                  </div>
                  <div style={{fontSize:"12px", color:"#5A5A72", marginTop:"6px"}}>
                    Linked to {portal==="founder" ? "clara@student.nus.edu.sg (Crème by Clara)" : userEmail}
                  </div>
                  {portal==="consumer" && (
                    <button 
                      style={{...s.btn, ...s.btnOutline, fontSize:"11px", padding:"4px 10px", marginTop:"14px"}} 
                      onClick={() => {
                        setUserEmail("")
                        localStorage.removeItem("leo_user_email")
                        showToast("Wallet Disconnected")
                      }}
                    >
                      Switch Account ➔
                    </button>
                  )}
                </div>

                {/* Consumer Referral Panel */}
                {portal==="consumer" && (
                  <div style={{background:"#16161F", border:"1px solid #2A2A38", borderRadius:"16px", padding:"1.5rem", marginBottom:"2rem"}}>
                    <h3 style={{fontWeight:"800", fontSize:"15px", marginBottom:"8px", color:"#F97316"}}>Refer Friends, Earn Together! 🤝</h3>
                    <p style={{color:"#9090A8", fontSize:"13px", marginBottom:"1.25rem"}}>
                      Share your unique code. When a friend redeems it, you both get **500 LeoCoins** instantly!
                    </p>
                    
                    <div style={{display:"flex", gap:"8px", marginBottom:"1.25rem", alignItems:"center"}}>
                      <div style={{
                        background:"#0A0A0F", 
                        border:"1px dashed #2A2A38", 
                        borderRadius:"8px", 
                        padding:"10px 14px", 
                        fontWeight:"800", 
                        fontSize:"16px", 
                        letterSpacing:"0.05em",
                        color:"#F97316",
                        flex: 1,
                        textAlign:"center"
                      }}>
                        {referralCode}
                      </div>
                      <button 
                        style={{...s.btn, ...s.btnAccent, height:"42px"}} 
                        onClick={() => {
                          navigator.clipboard.writeText(referralCode)
                          showToast("📋 Referral Code Copied!")
                        }}
                      >
                        Copy Code
                      </button>
                    </div>
                    
                    <div style={{borderTop:"1px solid #2A2A38", paddingTop:"1.25rem"}}>
                      <label style={{fontSize:"12px", color:"#9090A8", marginBottom:"6px", display:"block"}}>Have a referral code? Redeem it here:</label>
                      <div style={{display:"flex", gap:"8px"}}>
                        <input 
                          style={{...s.input, marginBottom:0, flex:1}} 
                          placeholder="Enter friend's LEO-XXXX code" 
                          value={friendCode}
                          onChange={e => setFriendCode(e.target.value)}
                        />
                        <button 
                          style={{...s.btn, ...s.btnSuccess}}
                          onClick={async () => {
                            if (!friendCode) return
                            try {
                              const res = await fetch("/api/referral/claim", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: userEmail, code: friendCode })
                              })
                              const data = await res.json()
                              if (!res.ok || !data.success) {
                                showToast("❌ " + (data.detail || "Failed to claim referral"))
                              } else {
                                showToast("🎉 " + data.message)
                                fetchWalletData(userEmail, false)
                                setFriendCode("")
                              }
                            } catch (err) {
                              console.error("Referral claim failed, simulating fallback:", err)
                              const codeClean = friendCode.trim().toUpperCase()
                              if (codeClean === referralCode.toUpperCase()) {
                                showToast("❌ You cannot redeem your own referral code!")
                                return
                              }
                              
                              const claimedKey = `leo_claimed_referral_${userEmail}`
                              if (localStorage.getItem(claimedKey)) {
                                showToast("❌ You have already claimed a referral code!")
                                return
                              }
                              
                              localStorage.setItem(claimedKey, "true")
                              const balKey = `leo_wallet_balance_${userEmail}`
                              const txKey = `leo_wallet_txs_${userEmail}`
                              const currentBal = parseInt(localStorage.getItem(balKey) || "0", 10)
                              const newBal = currentBal + 500
                              localStorage.setItem(balKey, String(newBal))
                              
                              let txs = []
                              try { txs = JSON.parse(localStorage.getItem(txKey) || "[]") } catch(e){}
                              txs.unshift({
                                amount: 500,
                                type: "credit",
                                description: "Referral welcome bonus",
                                created_at: new Date().toISOString()
                              })
                              localStorage.setItem(txKey, JSON.stringify(txs))
                              
                              setWalletBalance(newBal)
                              setWalletTransactions(txs)
                              setFriendCode("")
                              showToast("🎉 Welcome bonus claimed! +500 LeoCoins! (Simulated) 🪙")
                            }
                          }}
                        >
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transactions Ledger */}
                <div style={{marginBottom:"1.5rem"}}>
                  <h3 style={{fontWeight:"800", fontSize:"16px", marginBottom:"1rem"}}>Transaction Ledger</h3>
                  {(portal === "founder" ? bizTransactions : walletTransactions).length === 0 ? (
                    <div style={{textAlign:"center", padding:"2rem", color:"#5A5A72", border:"1px dashed #2A2A38", borderRadius:"12px"}}>
                      No transactions recorded yet.
                    </div>
                  ) : (
                    <div>
                      {(portal === "founder" ? bizTransactions : walletTransactions).map((tx, idx) => (
                        <div key={idx} style={{
                          background: "#16161F",
                          border: "1px solid #2A2A38",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginBottom: "8px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <div>
                            <div style={{fontWeight:"600", fontSize:"13px"}}>{tx.description}</div>
                            <div style={{fontSize:"11px", color:"#5A5A72", marginTop:"4px"}}>
                              {new Date(tx.created_at).toLocaleString("en-SG", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </div>
                          <div style={{
                            fontWeight: "800", 
                            color: tx.amount >= 0 ? "#22C55E" : "#FF4D6A",
                            fontSize: "14px"
                          }}>
                            {tx.amount >= 0 ? `+${tx.amount}` : tx.amount} 🪙
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BUSINESS OWNER DASHBOARD */}
        {portal==="founder"&&view==="home"&&(
          <div>
            <div style={{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1.5rem",marginBottom:"1.5rem",display:"flex",gap:"1rem",alignItems:"center"}}>
              <div style={{fontSize:"32px",width:"56px",height:"56px",background:"#1A1A24",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{founderBiz.emoji}</div>
              <div><div style={{fontWeight:"700",fontSize:"18px"}}>{founderBiz.name}</div><div style={{color:"#9090A8",fontSize:"13px"}}>{founderBiz.category} · {founderBiz.uni} · <span style={{color:"#22C55E",fontWeight:"600"}}>✓ Approved</span></div></div>
            </div>
            
            <div style={s.statsGrid}>
              {[
                ["Products Listed", founderProducts.length, "Active items"],
                ["Total Sales", dashboardMetrics?.total_sales ?? 3, "Orders completed"],
                ["Total Revenue", `$${(dashboardMetrics?.total_revenue ?? 62.0).toFixed(2)}`, "All time earnings"],
                ["LeoCoins Balance", `${bizWalletBalance} 🪙`, "Available balance"]
              ].map(([l,v,sub])=>(
                <div key={l} style={s.statCard}>
                  <div style={{fontSize:"11px",color:"#9090A8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"6px"}}>{l}</div>
                  <div style={{fontSize:"24px",fontWeight:"800",color:"#F97316"}}>{v}</div>
                  <div style={{fontSize:"11px",color:"#5A5A72"}}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Visual Analytics Representation */}
            <div style={{background:"#16161F", border:"1px solid #2A2A38", borderRadius:"12px", padding:"1.5rem", marginTop:"1.5rem"}}>
              <h3 style={{fontWeight:"800", fontSize:"15px", marginBottom:"1.25rem", color:"#F97316"}}>📊 Sales & Views Distribution</h3>
              <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
                {(dashboardMetrics?.product_metrics ?? [
                  {name: "Croissant Box (6 pcs)", views: 29, sales: 2},
                  {name: "Matcha Madeleine Set", views: 22, sales: 1}
                ]).map(item => {
                  const maxVal = Math.max(...(dashboardMetrics?.product_metrics ?? [
                    {views: 29}, {views: 22}
                  ]).map(i => i.views || 30), 30);
                  const viewsPercent = (item.views / maxVal) * 100;
                  const salesPercent = (item.sales / maxVal) * 100;
                  return (
                    <div key={item.id || item.name} style={{background:"#111118", border:"1px solid #2A2A38", borderRadius:"8px", padding:"1rem"}}>
                      <div style={{fontWeight:"600", fontSize:"13px", marginBottom:"8px"}}>{item.name}</div>
                      
                      {/* Views Bar */}
                      <div style={{marginBottom:"8px"}}>
                        <div style={{display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#9090A8", marginBottom:"3px"}}>
                          <span>Views (Blue)</span>
                          <span>{item.views}</span>
                        </div>
                        <div style={{height:"6px", background:"#1A1A24", borderRadius:"3px", overflow:"hidden"}}>
                          <div style={{width:`${viewsPercent}%`, height:"100%", background:"#3B82F6", borderRadius:"3px"}} />
                        </div>
                      </div>

                      {/* Sales Bar */}
                      <div>
                        <div style={{display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#9090A8", marginBottom:"3px"}}>
                          <span>Sales (Orange)</span>
                          <span>{item.sales}</span>
                        </div>
                        <div style={{height:"6px", background:"#1A1A24", borderRadius:"3px", overflow:"hidden"}}>
                          <div style={{width:`${salesPercent}%`, height:"100%", background:"#F97316", borderRadius:"3px"}} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Recommendations & Analytics Table */}
            <div style={{background:"#16161F", border:"1px solid #2A2A38", borderRadius:"12px", padding:"1.5rem", marginTop:"2rem"}}>
              <h3 style={{fontWeight:"800", fontSize:"16px", marginBottom:"1.25rem", color:"#F97316"}}>⚡ Product Price Optimizer & Performance</h3>
              {dashboardLoading && !dashboardMetrics ? (
                <p style={{color:"#9090A8", fontSize:"13px"}}>Loading analytics...</p>
              ) : (
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%", borderCollapse:"collapse", textAlign:"left", fontSize:"13px"}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid #2A2A38", color:"#9090A8"}}>
                        <th style={{padding:"10px 8px"}}>Product</th>
                        <th style={{padding:"10px 8px"}}>Current Price</th>
                        <th style={{padding:"10px 8px"}}>Views</th>
                        <th style={{padding:"10px 8px"}}>Sales</th>
                        <th style={{padding:"10px 8px"}}>Conv. Rate</th>
                        <th style={{padding:"10px 8px"}}>Recommended Price</th>
                        <th style={{padding:"10px 8px"}}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dashboardMetrics?.product_metrics ?? []).map(item => (
                        <tr key={item.id} style={{borderBottom:"1px solid #1A1A24"}}>
                          <td style={{padding:"12px 8px", fontWeight:"600"}}>{item.name}</td>
                          <td style={{padding:"12px 8px", fontWeight:"700", color:"#F0F0F5"}}>${item.price.toFixed(2)}</td>
                          <td style={{padding:"12px 8px"}}>{item.views}</td>
                          <td style={{padding:"12px 8px"}}>{item.sales}</td>
                          <td style={{padding:"12px 8px", color:item.conversion_rate > 15 ? "#22C55E" : item.conversion_rate < 5 ? "#FF4D6A" : "#9090A8"}}>
                            {item.conversion_rate}%
                          </td>
                          <td style={{padding:"12px 8px"}}>
                            <span style={{fontWeight:"700", color:"#22C55E"}}>${item.recommended_price.toFixed(2)}</span>
                            <div style={{fontSize:"10px", color:"#9090A8", marginTop:"2px", maxWidth:"200px"}}>{item.recommendation_reason}</div>
                          </td>
                          <td style={{padding:"12px 8px"}}>
                            {item.price !== item.recommended_price ? (
                              <button 
                                style={{...s.btn, ...s.btnAccent, fontSize:"11px", padding:"4px 8px"}}
                                onClick={() => handleApplyRecommendedPrice(item.id, item.recommended_price)}
                              >
                                Apply
                              </button>
                            ) : (
                              <span style={{color:"#5A5A72", fontSize:"11px"}}>Optimal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {portal==="founder"&&view==="products"&&(
          <div>
            <h2 style={{fontWeight:"800",marginBottom:"1.5rem"}}>My Products</h2>
            <div style={{background:"#16161F",border:"1px solid #2A2A38",borderRadius:"12px",padding:"1.25rem",marginBottom:"1.5rem"}}>
              <div style={{fontWeight:"700",marginBottom:"1rem",fontSize:"14px"}}>+ Add New Product</div>
              <input style={s.input} placeholder="Product name" value={newProduct.name} onChange={e=>setNewProduct(p=>({...p,name:e.target.value}))} />
              <input style={s.input} placeholder="Description" value={newProduct.desc} onChange={e=>setNewProduct(p=>({...p,desc:e.target.value}))} />
              <input style={s.input} placeholder="Price (SGD)" type="number" value={newProduct.price} onChange={e=>setNewProduct(p=>({...p,price:e.target.value}))} />
              <input style={s.input} placeholder="Emoji icon e.g. 🎀" value={newProduct.emoji} onChange={e=>setNewProduct(p=>({...p,emoji:e.target.value}))} />
              <button style={{...s.btn,...s.btnAccent}} onClick={addProduct}>Add Product</button>
            </div>
            <div style={s.grid}>
              {founderProducts.map(p=>(
                <div key={p.id} style={s.card}>
                  <div style={s.cardImg}>{p.emoji}</div>
                  <div style={s.cardBody}>
                    <div style={{fontWeight:"600",marginBottom:"4px"}}>{p.name}</div>
                    <div style={{fontSize:"12px",color:"#9090A8",marginBottom:"8px"}}>{p.desc||p.description}</div>
                    <div style={{fontSize:"18px",fontWeight:"800",color:"#F97316",marginBottom:"8px"}}>${p.price}</div>
                    <button style={{...s.btn,...s.btnDanger,width:"100%",fontSize:"12px"}} onClick={()=>deleteProduct(p.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
