import { useState, useRef, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

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

export default function App() {
  const [portal, setPortal] = useState(null)
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
    showToast("✓ Product added!")
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

  // LANDING PAGE
  if(!portal) return (
    <div style={{...s.page,...s.center,position:"relative",overflow:"hidden"}}>
      {/* Translucent lion watermark - smaller */}
      <img src="/logo.png" alt="" style={{position:"absolute",width:"1200px",height:"1200px",objectFit:"contain",opacity:0.15,pointerEvents:"none",zIndex:0,userSelect:"none"}} onError={e=>e.target.style.display="none"} />
      {/* Business Owner button top left */}
      <div style={{position:"absolute",top:"1rem",left:"1.5rem",zIndex:1}}>
        <button onClick={()=>enterPortal("founder")} style={{background:"transparent",border:"1px solid #2A2A38",borderRadius:"8px",padding:"6px 14px",color:"#F0F0F5",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"inherit"}}>
          Business Owner →
        </button>
      </div>
      {/* Main content */}
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{fontSize:"96px",fontWeight:"400",fontFamily:"'Pacifico',cursive",color:"#E8821A",lineHeight:1.1,marginBottom:"4px"}}>Leo</div>
        <div style={s.sub}>Singapore's student marketplace</div>
        <div style={s.cards}>
          <div onClick={()=>enterPortal("consumer")} style={{...s.portalCard,width:"240px"}}>
            <div style={{fontSize:"40px",marginBottom:"1rem"}}>🛍️</div>
            <div style={{fontWeight:"700",fontSize:"18px",marginBottom:"6px"}}>Shop Now</div>
            <div style={{fontSize:"13px",color:"#9090A8",marginBottom:"16px"}}>Discover & buy from student businesses</div>
            <div style={{...s.btn,...s.btnAccent,display:"inline-block"}}>Enter →</div>
          </div>
        </div>
      </div>
    </div>
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
          </>}
          {portal==="founder"&&<>
            <button style={{...s.navBtn,...(view==="home"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("home")}>Dashboard</button>
            <button style={{...s.navBtn,...(view==="feed"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("feed")}>Feed 📱</button>
            <button style={{...s.navBtn,...(view==="products"?{background:"#1A1A24",color:"#F0F0F5"}:{})}} onClick={()=>setView("products")}>Products</button>
          </>}
        </div>
        <button style={{...s.btn,...s.btnOutline,fontSize:"12px"}} onClick={()=>setPortal(null)}>← Switch</button>
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
              {cart.map(c=>(
                <div key={c.id} style={{display:"flex",alignItems:"center",gap:"12px",padding:"12px 0",borderBottom:"1px solid #2A2A38"}}>
                  <div style={{fontSize:"28px",width:"44px",height:"44px",background:"#1A1A24",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}>{c.emoji}</div>
                  <div style={{flex:1}}><div style={{fontWeight:"600",fontSize:"13px"}}>{c.name}</div><div style={{fontSize:"12px",color:"#9090A8"}}>Qty: {c.qty}</div></div>
                  <div style={{fontWeight:"700",color:"#F97316"}}>${c.price*c.qty}</div>
                </div>
              ))}
              <div style={{marginTop:"1.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:"12px",color:"#9090A8"}}>Total</div><div style={{fontSize:"24px",fontWeight:"800",color:"#F97316"}}>${cartTotal}</div></div>
                <button style={{...s.btn,...s.btnAccent}} onClick={()=>{setCart([]);showToast("🎉 Order placed!")}}>Checkout →</button>
              </div>
            </div>}
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
              {[["Products",founderProducts.length,"Listed"],["Reviews",getBizReviews(founderBiz.id).length,"Received"],["Views","142","This week"],["Orders","3","All time"]].map(([l,v,sub])=>(
                <div key={l} style={s.statCard}><div style={{fontSize:"11px",color:"#9090A8",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:"6px"}}>{l}</div><div style={{fontSize:"28px",fontWeight:"800",color:"#F97316"}}>{v}</div><div style={{fontSize:"11px",color:"#5A5A72"}}>{sub}</div></div>
              ))}
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
