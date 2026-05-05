import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id:1,  name:"极简机械键盘",    price:899,  orig:1199, cat:"数码",   rating:4.8, reviews:312, stock:15, img:"⌨️",  desc:"87键紧凑布局，红轴手感，RGB背光，适合程序员和设计师的高效工具。全键无冲，支持宏编程，附带腕托。",   tags:["热销","限量"], brand:"IKBC",      sold:2341 },
  { id:2,  name:"降噪无线耳机",    price:1299, orig:1599, cat:"音频",   rating:4.9, reviews:521, stock:8,  img:"🎧",  desc:"主动降噪技术，40小时续航，折叠便携设计，通勤必备神器。支持多设备同步，蓝牙5.3。",            tags:["爆款"],        brand:"Sony",      sold:5821 },
  { id:3,  name:"人体工学椅",      price:2399, orig:3200, cat:"家居",   rating:4.7, reviews:189, stock:3,  img:"🪑",  desc:"腰部支撑可调，透气网背，久坐不累，远程工作者的首选。可调节扶手，5年质保。",                  tags:["特价"],        brand:"西昊",      sold:987  },
  { id:4,  name:"便携超薄台灯",    price:299,  orig:399,  cat:"家居",   rating:4.6, reviews:88,  stock:30, img:"🪔",  desc:"无极调光，护眼无频闪，USB-C充电，折叠收纳超方便。三档色温，记忆功能。",                     tags:[],              brand:"米家",      sold:3210 },
  { id:5,  name:"智能手表 Pro",    price:1899, orig:2299, cat:"数码",   rating:4.8, reviews:403, stock:12, img:"⌚",  desc:"血氧心率监测，GPS定位，7天续航，运动健康全能管理。50米防水，支持微信支付。",                 tags:["新品"],        brand:"华为",      sold:4102 },
  { id:6,  name:"冷萃咖啡壶",      price:189,  orig:259,  cat:"厨房",   rating:4.5, reviews:67,  stock:25, img:"☕",  desc:"1L大容量，冰箱冷萃8小时，玻璃材质，在家喝出精品咖啡馆风味。耐热玻璃，易清洁。",             tags:[],              brand:"Hario",     sold:1567 },
  { id:7,  name:"旅行折叠雨伞",    price:129,  orig:179,  cat:"出行",   rating:4.4, reviews:145, stock:50, img:"☂️",  desc:"超轻210g，六折超小，防风骨架，雨天通勤的轻盈伴侣。钛合金骨架，遇风不翻。",                  tags:[],              brand:"天堂",      sold:6780 },
  { id:8,  name:"无线充电板",      price:219,  orig:299,  cat:"数码",   rating:4.7, reviews:234, stock:20, img:"🔋",  desc:"15W快充，兼容所有Qi设备，防滑静音设计，桌面必备。过温保护，异物检测。",                     tags:["热销"],        brand:"Anker",     sold:3890 },
  { id:9,  name:"手冲咖啡套装",    price:459,  orig:599,  cat:"厨房",   rating:4.9, reviews:211, stock:18, img:"🫖",  desc:"包含手冲壶、滤纸、磨豆机，一套入门精品咖啡。附赠入门教程手册。",                             tags:["新品","热销"], brand:"Timemore",  sold:2109 },
  { id:10, name:"蓝牙音箱",        price:699,  orig:899,  cat:"音频",   rating:4.6, reviews:178, stock:14, img:"🔊",  desc:"360°环绕音效，IPX7防水，20小时续航，户外出行的音乐伴侣。支持TWS双机配对。",               tags:[],              brand:"JBL",       sold:2870 },
  { id:11, name:"帆布双肩包",      price:349,  orig:499,  cat:"出行",   rating:4.5, reviews:302, stock:22, img:"🎒",  desc:"30L容量，15寸笔记本夹层，帆布材质耐磨防刮，通勤出差两用。含USB充电口。",                    tags:["热销"],        brand:"Herschel",  sold:4320 },
  { id:12, name:"颈挂风扇",        price:159,  orig:229,  cat:"数码",   rating:4.3, reviews:95,  stock:40, img:"🌀",  desc:"无叶设计，360°旋转，无绳佩戴，夏日通勤神器。三档风速，续航8小时。",                        tags:["新品"],        brand:"小米",      sold:8901 },
];

const CATS = ["全部", ...new Set(PRODUCTS.map(p => p.cat))];
const BANNERS = [
  { bg:"#1a1208", accent:"#c8a97e", title:"夏日好物节", sub:"全场满299减50，限时3天", icon:"🌞" },
  { bg:"#0d2137", accent:"#7eb8c8", title:"数码新品周", sub:"最新科技好物，先人一步", icon:"💻" },
  { bg:"#1a0d0d", accent:"#c87e7e", title:"咖啡生活馆", sub:"从一杯好咖啡开始每一天", icon:"☕" },
];

const fmt = n => "¥" + n.toLocaleString();
const disc = p => Math.round((1 - p.price / p.orig) * 100);

function Stars({ r, count }) {
  return <span style={{ fontSize:12 }}>
    <span style={{ color:"#e8a030" }}>{"★".repeat(Math.floor(r))}{"☆".repeat(5-Math.floor(r))}</span>
    <span style={{ color:"#999", marginLeft:5 }}>{r} ({count})</span>
  </span>;
}

export default function App() {
  const [page, setPage]         = useState("home");
  const [history, setHistory]   = useState([]);
  const [product, setProduct]   = useState(null);
  const [cart, setCart]         = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [user, setUser]         = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [search, setSearch]     = useState("");
  const [activeCat, setActiveCat] = useState("全部");
  const [sort, setSort]         = useState("default");
  const [toast, setToast]       = useState(null);
  const [bannerIdx, setBanner]  = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId]   = useState(null);
  const [form, setForm]         = useState({ name:"", pass:"", email:"" });
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setBanner(b => (b+1) % BANNERS.length), 3600);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2300);
  };

  const nav = (p, cb) => {
    setHistory(h => [...h, page]);
    setPage(p);
    cb && cb();
    setCartOpen(false);
    window.scrollTo(0,0);
  };

  const goBack = () => {
    const p = history[history.length-1] || "home";
    setHistory(h => h.slice(0,-1));
    setPage(p);
  };

  const addToCart = (p, qty=1) => {
    if (!user) { nav("auth"); showToast("请先登录","warn"); return; }
    setCart(c => {
      const f = c.find(i => i.id===p.id);
      return f ? c.map(i => i.id===p.id ? {...i, qty:i.qty+qty} : i) : [...c, {...p, qty}];
    });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 900);
    showToast(`${p.name} 已加入购物车`);
  };

  const setQty = (id, qty) => qty < 1 ? removeCart(id) : setCart(c => c.map(i => i.id===id ? {...i,qty} : i));
  const removeCart = id => setCart(c => c.filter(i => i.id!==id));
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);
  const cartTotal = cart.reduce((s,i) => s+i.price*i.qty, 0);

  const toggleWish = p => {
    if (!user) { nav("auth"); return; }
    setWishlist(w => w.find(i=>i.id===p.id) ? w.filter(i=>i.id!==p.id) : [...w,p]);
  };
  const wished = id => wishlist.some(i => i.id===id);

  const checkout = () => {
    if (!cart.length) return;
    const o = { id:"ORD"+Date.now(), items:[...cart], total:cartTotal, date:new Date().toLocaleDateString("zh-CN"), status:"待发货" };
    setOrders(prev => [o,...prev]);
    setCart([]);
    setCartOpen(false);
    setOrderDone(true);
    setTimeout(() => setOrderDone(false), 3000);
    nav("orders");
    showToast("🎉 订单提交成功！");
  };

  const handleAuth = () => {
    if (!form.name || !form.pass) { showToast("请填写完整信息","warn"); return; }
    setUser({ name:form.name, avatar:form.name[0].toUpperCase() });
    showToast(`欢迎，${form.name}！`);
    goBack();
  };

  const logout = () => { setUser(null); setCart([]); setWishlist([]); setOrders([]); nav("home"); };

  const filtered = PRODUCTS
    .filter(p => (activeCat==="全部"||p.cat===activeCat) && (search===""||p.name.includes(search)||p.brand.includes(search)))
    .sort((a,b) => sort==="price_asc"?a.price-b.price : sort==="price_desc"?b.price-a.price : sort==="rating"?b.rating-a.rating : sort==="sold"?b.sold-a.sold : 0);

  const bn = BANNERS[bannerIdx];

  // ── SHARED HEADER
  const Hdr = ({ title, back=true }) => (
    <header style={{ background:"#1a1208", color:"#f5f0eb", padding:"13px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 10px rgba(0,0,0,0.2)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {back && <button onClick={goBack} style={{ background:"none", border:"none", color:"#c8a97e", fontSize:22, cursor:"pointer", padding:0 }}>←</button>}
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:18 }}>{title}</span>
      </div>
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        {page!=="search" && <button onClick={() => nav("search")} style={{ background:"none", border:"none", color:"#c8a97e", fontSize:20, cursor:"pointer" }}>🔍</button>}
        <button onClick={() => setCartOpen(true)} style={{ background:"none", border:"none", color:"#f5f0eb", fontSize:22, cursor:"pointer", position:"relative" }}>
          🛒
          {cartCount>0 && <em style={{ position:"absolute", top:-6, right:-6, background:"#e05c2a", color:"#fff", borderRadius:"50%", width:18, height:18, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontStyle:"normal" }}>{cartCount}</em>}
        </button>
      </div>
    </header>
  );

  // ── BOTTOM NAV
  const BNav = () => {
    const tabs = [
      { id:"home", icon:"🏠", label:"首页" },
      { id:"list", icon:"🛍", label:"商城" },
      { id:"wishlist", icon:"❤️", label:"收藏", badge:wishlist.length },
      { id:"orders", icon:"📦", label:"订单" },
      { id:"profile", icon:"👤", label:"我的" },
    ];
    return (
      <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"#fff", borderTop:"1px solid #f0ece6", display:"flex", zIndex:90, boxShadow:"0 -2px 12px rgba(0,0,0,0.07)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => nav(t.id)} style={{ flex:1, background:"none", border:"none", padding:"9px 0 7px", cursor:"pointer", position:"relative" }}>
            <div style={{ fontSize:21 }}>{t.icon}</div>
            <div style={{ fontSize:10, color:page===t.id?"#c8a97e":"#aaa", fontWeight:page===t.id?700:400, marginTop:1 }}>{t.label}</div>
            {t.badge>0 && <em style={{ position:"absolute", top:5, right:"16%", background:"#e05c2a", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:9, display:"flex", alignItems:"center", justifyContent:"center", fontStyle:"normal" }}>{t.badge}</em>}
          </button>
        ))}
      </nav>
    );
  };

  // ── PRODUCT CARD
  const PCard = ({ p, mini }) => (
    <div onClick={() => { setProduct(p); nav("detail"); }} style={{ background:"#fff", borderRadius:16, overflow:"hidden", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.06)", transition:"transform 0.2s", minWidth:mini?140:undefined, flexShrink:mini?0:undefined }}>
      <div style={{ background:"#fdf6ee", height:mini?96:118, display:"flex", alignItems:"center", justifyContent:"center", fontSize:mini?42:50, position:"relative" }}>
        {p.img}
        <button onClick={e => { e.stopPropagation(); toggleWish(p); }} style={{ position:"absolute", top:6, right:6, background:"rgba(255,255,255,0.85)", border:"none", borderRadius:"50%", width:26, height:26, fontSize:13, cursor:"pointer" }}>
          {wished(p.id)?"❤️":"🤍"}
        </button>
        {p.tags[0] && <span style={{ position:"absolute", top:6, left:6, background:"#e05c2a", color:"#fff", fontSize:9, padding:"2px 6px", borderRadius:20, fontWeight:700 }}>{p.tags[0]}</span>}
      </div>
      <div style={{ padding:"10px 11px 12px" }}>
        <div style={{ fontSize:12, color:"#aaa", marginBottom:1 }}>{p.brand}</div>
        <div style={{ fontSize:13, fontWeight:600, lineHeight:1.3, marginBottom:4 }}>{p.name}</div>
        {!mini && <Stars r={p.rating} count={p.reviews} />}
        <div style={{ display:"flex", alignItems:"baseline", gap:5, margin:"6px 0 8px" }}>
          <span style={{ color:"#c85a00", fontWeight:700, fontSize:15 }}>{fmt(p.price)}</span>
          <span style={{ color:"#ccc", textDecoration:"line-through", fontSize:11 }}>{fmt(p.orig)}</span>
          <span style={{ background:"#fde8c8", color:"#8a4800", fontSize:10, padding:"1px 5px", borderRadius:4 }}>-{disc(p)}%</span>
        </div>
        {!mini && (
          <button onClick={e => { e.stopPropagation(); addToCart(p); }} style={{ width:"100%", background:addedId===p.id?"#3a6020":"#1a1208", color:"#f5f0eb", border:"none", padding:"8px 0", borderRadius:50, cursor:"pointer", fontSize:12, fontWeight:600, transition:"background 0.3s" }}>
            {addedId===p.id?"✓ 已加入":"加入购物车"}
          </button>
        )}
      </div>
    </div>
  );

  // ── CART DRAWER
  const CartDrawer = () => !cartOpen ? null : (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, display:"flex", alignItems:"flex-end" }} onClick={() => setCartOpen(false)}>
      <div style={{ background:"#fff", width:"100%", maxWidth:480, margin:"0 auto", maxHeight:"78vh", borderRadius:"24px 24px 0 0", padding:"20px 18px", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:19 }}>购物车 ({cartCount})</span>
          <button onClick={() => setCartOpen(false)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#bbb" }}>✕</button>
        </div>
        {cart.length===0
          ? <div style={{ textAlign:"center", padding:"40px 0", color:"#ccc" }}><div style={{ fontSize:48 }}>🛒</div><div style={{ marginTop:8 }}>购物车是空的</div></div>
          : <>
            {cart.map(i => (
              <div key={i.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #f5f0eb" }}>
                <div style={{ background:"#fdf6ee", borderRadius:10, width:50, height:50, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{i.img}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600 }}>{i.name}</div>
                  <div style={{ color:"#c85a00", fontWeight:700, fontSize:13, marginTop:2 }}>{fmt(i.price)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={() => setQty(i.id, i.qty-1)} style={{ width:26, height:26, borderRadius:"50%", border:"1px solid #ddd", background:"none", cursor:"pointer", fontSize:14 }}>−</button>
                  <span style={{ minWidth:18, textAlign:"center", fontWeight:700, fontSize:14 }}>{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty+1)} style={{ width:26, height:26, borderRadius:"50%", border:"none", background:"#1a1208", color:"#fff", cursor:"pointer", fontSize:14 }}>+</button>
                  <button onClick={() => removeCart(i.id)} style={{ background:"none", border:"none", color:"#ddd", fontSize:16, cursor:"pointer" }}>🗑</button>
                </div>
              </div>
            ))}
            <div style={{ paddingTop:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:"#888" }}>合计</div>
                <div style={{ fontSize:26, fontWeight:700, color:"#c85a00" }}>{fmt(cartTotal)}</div>
              </div>
              <button onClick={checkout} style={{ background:"#1a1208", color:"#f5f0eb", border:"none", padding:"13px 30px", borderRadius:50, cursor:"pointer", fontWeight:700, fontSize:15 }}>结算 →</button>
            </div>
          </>
        }
      </div>
    </div>
  );

  // ── WRAPPER
  const W = ({ children }) => (
    <div style={{ fontFamily:"'Georgia','Noto Serif SC',serif", minHeight:"100vh", background:"#f5f0eb", color:"#1a1208", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        button{font-family:inherit;cursor:pointer}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#c8a97e;border-radius:2px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
      `}</style>
      {children}
      <CartDrawer />
      {toast && (
        <div style={{ position:"fixed", top:68, left:"50%", transform:"translateX(-50%)", background:toast.type==="warn"?"#e05c2a":"#1a1208", color:"#fff", padding:"9px 22px", borderRadius:50, fontSize:13, zIndex:300, whiteSpace:"nowrap", animation:"fadeIn 0.25s ease", boxShadow:"0 4px 20px rgba(0,0,0,0.25)" }}>
          {toast.msg}
        </div>
      )}
      {orderDone && (
        <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"#fff", borderRadius:20, padding:"30px 40px", textAlign:"center", zIndex:300, boxShadow:"0 12px 40px rgba(0,0,0,0.2)", animation:"fadeIn 0.3s ease" }}>
          <div style={{ fontSize:52 }}>🎉</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginTop:10 }}>订单提交成功</div>
          <div style={{ color:"#888", fontSize:13, marginTop:6 }}>感谢你的购买！</div>
        </div>
      )}
    </div>
  );

  // ════════════════════════════════════════════════════
  // HOME
  // ════════════════════════════════════════════════════
  if (page==="home") return (
    <W>
      <Hdr title="🛍 好物集市" back={false} />
      {/* Banner */}
      <div style={{ background:bn.bg, color:bn.accent, padding:"26px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"background 0.6s" }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:3, opacity:0.55, marginBottom:5 }}>LIMITED OFFER</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, lineHeight:1.2 }}>{bn.title}</div>
          <div style={{ fontSize:13, opacity:0.7, marginTop:5 }}>{bn.sub}</div>
          <button onClick={() => nav("list")} style={{ marginTop:14, background:bn.accent, color:bn.bg, border:"none", padding:"9px 22px", borderRadius:50, fontWeight:700, fontSize:13 }}>立即选购 →</button>
        </div>
        <div style={{ fontSize:70, opacity:0.85 }}>{bn.icon}</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:6, padding:"9px 0", background:bn.bg }}>
        {BANNERS.map((_,i) => <div key={i} onClick={() => setBanner(i)} style={{ width:i===bannerIdx?20:6, height:6, borderRadius:3, background:i===bannerIdx?bn.accent:"rgba(255,255,255,0.25)", cursor:"pointer", transition:"all 0.3s" }} />)}
      </div>

      {/* Category pills */}
      <div style={{ padding:"16px 14px 0" }}>
        <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
          {CATS.slice(1).map(c => (
            <button key={c} onClick={() => { setActiveCat(c); nav("list"); }} style={{ background:"#fff", border:"1.5px solid #e8e0d5", padding:"7px 16px", borderRadius:50, whiteSpace:"nowrap", fontSize:13, color:"#6b5a3e" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Hot */}
      <div style={{ padding:"18px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17 }}>🔥 热销榜单</span>
          <button onClick={() => { setSort("sold"); nav("list"); }} style={{ background:"none", border:"none", color:"#c8a97e", fontSize:13 }}>查看全部 ›</button>
        </div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4 }}>
          {[...PRODUCTS].sort((a,b)=>b.sold-a.sold).slice(0,6).map(p => <PCard key={p.id} p={p} mini />)}
        </div>
      </div>

      {/* New */}
      <div style={{ padding:"18px 14px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:17 }}>✨ 最新上架</span>
          <button onClick={() => nav("list")} style={{ background:"none", border:"none", color:"#c8a97e", fontSize:13 }}>查看全部 ›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {PRODUCTS.filter(p=>p.tags.includes("新品")).map(p => <PCard key={p.id} p={p} />)}
        </div>
      </div>

      <div style={{ height:80 }} />
      <BNav />
    </W>
  );

  // ════════════════════════════════════════════════════
  // LIST
  // ════════════════════════════════════════════════════
  if (page==="list") return (
    <W>
      <Hdr title="全部商品" />
      <div style={{ background:"#fff", borderBottom:"1px solid #f0ece6", padding:"10px 12px" }}>
        <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:8 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} style={{ background:activeCat===c?"#1a1208":"#f0ece6", color:activeCat===c?"#f5f0eb":"#6b5a3e", border:"none", padding:"6px 14px", borderRadius:50, whiteSpace:"nowrap", fontSize:12, fontWeight:activeCat===c?700:400, transition:"all 0.2s" }}>
              {c}
            </button>
          ))}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["default","综合"],["price_asc","价格↑"],["price_desc","价格↓"],["rating","评分"],["sold","销量"]].map(([v,l]) => (
            <button key={v} onClick={() => setSort(v)} style={{ background:sort===v?"#c8a97e":"#f0ece6", color:sort===v?"#1a1208":"#888", border:"none", padding:"5px 12px", borderRadius:50, fontSize:11, fontWeight:sort===v?700:400 }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"12px 12px 100px" }}>
        <div style={{ color:"#bbb", fontSize:12, marginBottom:10 }}>共 {filtered.length} 件商品</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
          {filtered.map(p => <PCard key={p.id} p={p} />)}
        </div>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:"60px 0", color:"#ccc" }}><div style={{ fontSize:48 }}>🌿</div><div style={{ marginTop:8 }}>暂无商品</div></div>}
      </div>
      <BNav />
    </W>
  );

  // ════════════════════════════════════════════════════
  // DETAIL
  // ════════════════════════════════════════════════════
  if (page==="detail" && product) return (
    <W>
      <Hdr title={product.name} />
      <div style={{ paddingBottom:100 }}>
        <div style={{ background:"linear-gradient(135deg,#fdf6ee,#f0e8dc)", height:230, display:"flex", alignItems:"center", justifyContent:"center", fontSize:108, position:"relative" }}>
          {product.img}
          <button onClick={() => toggleWish(product)} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.9)", border:"none", borderRadius:"50%", width:40, height:40, fontSize:20, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
            {wished(product.id)?"❤️":"🤍"}
          </button>
        </div>
        <div style={{ padding:"20px 18px" }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
            {product.tags.map(t => <span key={t} style={{ background:"#fde8c8", color:"#8a4800", fontSize:11, padding:"2px 7px", borderRadius:20, fontWeight:700 }}>{t}</span>)}
            <span style={{ background:"#e8f0e0", color:"#3a6020", fontSize:11, padding:"2px 7px", borderRadius:20 }}>{product.cat}</span>
            <span style={{ background:"#e8eef8", color:"#2a4080", fontSize:11, padding:"2px 7px", borderRadius:20 }}>{product.brand}</span>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:6 }}>{product.name}</h1>
          <Stars r={product.rating} count={product.reviews} />
          <div style={{ color:"#aaa", fontSize:12, marginTop:4 }}>累计销售 {product.sold.toLocaleString()} 件</div>

          <div style={{ background:"linear-gradient(90deg,#1a1208,#3a2010)", borderRadius:14, padding:"16px 18px", margin:"16px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:"#c8a97e", fontSize:11, marginBottom:3 }}>限时特惠价</div>
              <div style={{ color:"#fff", fontSize:30, fontWeight:700 }}>{fmt(product.price)}</div>
              <div style={{ color:"#666", textDecoration:"line-through", fontSize:13 }}>{fmt(product.orig)}</div>
            </div>
            <div style={{ background:"#e05c2a", color:"#fff", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
              <div style={{ fontSize:18, fontWeight:700 }}>-{disc(product)}%</div>
              <div style={{ fontSize:10 }}>折扣</div>
            </div>
          </div>

          <div style={{ background:"#fdf6ee", borderRadius:12, padding:16, marginBottom:14 }}>
            <div style={{ fontWeight:700, marginBottom:8, fontSize:14 }}>📝 商品详情</div>
            <p style={{ fontSize:14, lineHeight:1.8, color:"#444" }}>{product.desc}</p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
            {[["📦","库存",`${product.stock}件`],["🚚","配送","免费"],["↩️","退换","7天"]].map(([i,l,v]) => (
              <div key={l} style={{ background:"#f5f0eb", borderRadius:10, padding:"12px 6px", textAlign:"center" }}>
                <div style={{ fontSize:18 }}>{i}</div>
                <div style={{ fontSize:10, color:"#888", marginTop:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ fontWeight:700, marginBottom:10, fontSize:14 }}>🔗 同类商品</div>
          <div style={{ display:"flex", gap:10, overflowX:"auto" }}>
            {PRODUCTS.filter(p=>p.cat===product.cat&&p.id!==product.id).slice(0,5).map(p => (
              <div key={p.id} onClick={() => { setProduct(p); window.scrollTo(0,0); }} style={{ background:"#fff", borderRadius:12, padding:10, minWidth:108, cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", flexShrink:0 }}>
                <div style={{ fontSize:30, textAlign:"center", marginBottom:4 }}>{p.img}</div>
                <div style={{ fontSize:12, fontWeight:600 }}>{p.name}</div>
                <div style={{ color:"#c85a00", fontWeight:700, fontSize:13, marginTop:2 }}>{fmt(p.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"#fff", padding:"12px 16px", borderTop:"1px solid #eee", display:"flex", gap:10, boxShadow:"0 -4px 20px rgba(0,0,0,0.07)" }}>
        <button onClick={() => toggleWish(product)} style={{ width:44, height:44, borderRadius:12, border:"1.5px solid #e0d8d0", background:"#fff", fontSize:20, flexShrink:0 }}>
          {wished(product.id)?"❤️":"🤍"}
        </button>
        <button onClick={() => setCartOpen(true)} style={{ flex:1, background:"#f0ece6", color:"#1a1208", border:"none", borderRadius:12, fontWeight:700, fontSize:13 }}>
          购物车({cartCount})
        </button>
        <button onClick={() => addToCart(product)} style={{ flex:2, background:addedId===product.id?"#3a6020":"#1a1208", color:"#f5f0eb", border:"none", borderRadius:12, fontWeight:700, fontSize:14, transition:"background 0.3s" }}>
          {addedId===product.id?"✓ 已加入":"加入购物车"}
        </button>
      </div>
    </W>
  );

  // ════════════════════════════════════════════════════
  // SEARCH
  // ════════════════════════════════════════════════════
  if (page==="search") return (
    <W>
      <header style={{ background:"#1a1208", padding:"11px 14px", display:"flex", gap:10, alignItems:"center", position:"sticky", top:0, zIndex:100 }}>
        <button onClick={goBack} style={{ background:"none", border:"none", color:"#c8a97e", fontSize:22 }}>←</button>
        <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索商品、品牌…"
          style={{ flex:1, background:"rgba(255,255,255,0.12)", border:"none", borderRadius:50, padding:"9px 16px", color:"#fff", fontSize:14, outline:"none" }} />
        {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", color:"#888", fontSize:18 }}>✕</button>}
      </header>
      <div style={{ padding:"14px 14px 100px" }}>
        {!search && (
          <div style={{ marginBottom:20 }}>
            <div style={{ color:"#aaa", fontSize:12, marginBottom:8 }}>热门搜索</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {["机械键盘","耳机","咖啡","工学椅","充电","蓝牙","背包"].map(k => (
                <button key={k} onClick={() => setSearch(k)} style={{ background:"#f0ece6", border:"none", padding:"6px 14px", borderRadius:50, fontSize:13, color:"#6b5a3e" }}>{k}</button>
              ))}
            </div>
          </div>
        )}
        {search && (
          <>
            <div style={{ color:"#bbb", fontSize:12, marginBottom:10 }}>找到 {filtered.length} 件商品</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
              {filtered.map(p => <PCard key={p.id} p={p} />)}
            </div>
            {filtered.length===0 && <div style={{ textAlign:"center", padding:"60px 0", color:"#ccc" }}><div style={{ fontSize:48 }}>🔍</div><div style={{ marginTop:8 }}>没有找到"{search}"相关商品</div></div>}
          </>
        )}
      </div>
    </W>
  );

  // ════════════════════════════════════════════════════
  // WISHLIST
  // ════════════════════════════════════════════════════
  if (page==="wishlist") return (
    <W>
      <Hdr title="❤️ 我的收藏" />
      <div style={{ padding:"14px 14px 100px" }}>
        {wishlist.length===0
          ? <div style={{ textAlign:"center", padding:"60px 0", color:"#ccc" }}><div style={{ fontSize:48 }}>🤍</div><div style={{ marginTop:8 }}>还没有收藏任何商品</div></div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
              {wishlist.map(p => <PCard key={p.id} p={p} />)}
            </div>
        }
      </div>
      <BNav />
    </W>
  );

  // ════════════════════════════════════════════════════
  // ORDERS
  // ════════════════════════════════════════════════════
  if (page==="orders") return (
    <W>
      <Hdr title="📦 我的订单" />
      <div style={{ padding:"14px 14px 100px" }}>
        {orders.length===0
          ? <div style={{ textAlign:"center", padding:"60px 0", color:"#ccc" }}><div style={{ fontSize:48 }}>📦</div><div style={{ marginTop:8 }}>暂无订单记录</div></div>
          : orders.map(o => (
            <div key={o.id} style={{ background:"#fff", borderRadius:14, padding:16, marginBottom:14, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontSize:11, color:"#bbb" }}>{o.id}</div>
                <span style={{ background:"#e8f0e0", color:"#3a6020", fontSize:11, padding:"2px 8px", borderRadius:20 }}>{o.status}</span>
              </div>
              {o.items.map(i => (
                <div key={i.id} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid #f5f0eb", alignItems:"center" }}>
                  <div style={{ fontSize:26 }}>{i.img}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{i.name}</div>
                    <div style={{ fontSize:12, color:"#aaa" }}>x{i.qty}</div>
                  </div>
                  <div style={{ fontWeight:700, color:"#c85a00", fontSize:13 }}>{fmt(i.price*i.qty)}</div>
                </div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, paddingTop:10, borderTop:"2px dashed #f0ece6" }}>
                <span style={{ fontSize:12, color:"#bbb" }}>{o.date}</span>
                <span style={{ fontWeight:700 }}>合计 {fmt(o.total)}</span>
              </div>
            </div>
          ))
        }
      </div>
      <BNav />
    </W>
  );

  // ════════════════════════════════════════════════════
  // PROFILE
  // ════════════════════════════════════════════════════
  if (page==="profile") return (
    <W>
      <Hdr title="👤 我的" back={false} />
      <div style={{ padding:"20px 16px 100px" }}>
        <div style={{ background:"linear-gradient(135deg,#1a1208,#3a2010)", borderRadius:20, padding:"24px 20px", color:"#f5f0eb", marginBottom:20, display:"flex", alignItems:"center", gap:18 }}>
          <div style={{ width:58, height:58, borderRadius:"50%", background:"#c8a97e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:"#1a1208", flexShrink:0 }}>
            {user ? user.avatar : "?"}
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20 }}>{user ? user.name : "未登录"}</div>
            <div style={{ color:"#c8a97e", fontSize:13, marginTop:2 }}>{user ? "✦ 普通会员" : "登录后享受更多特权"}</div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
          {[["📦","订单",orders.length,"orders"],["❤️","收藏",wishlist.length,"wishlist"],["🛒","购物车",cartCount,"home"]].map(([i,l,v,dest]) => (
            <div key={l} onClick={() => nav(dest)} style={{ background:"#fff", borderRadius:14, padding:"15px 0", textAlign:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize:22 }}>{i}</div>
              <div style={{ fontSize:18, fontWeight:700, marginTop:3 }}>{v}</div>
              <div style={{ fontSize:11, color:"#aaa" }}>{l}</div>
            </div>
          ))}
        </div>

        {[["📦 我的订单",()=>nav("orders")],["❤️ 我的收藏",()=>nav("wishlist")],["🎁 优惠券",()=>showToast("暂无可用优惠券","warn")],["💬 联系客服",()=>showToast("客服工作时间 9:00–21:00")],["⚙️ 账号设置",()=>showToast("功能开发中…","warn")]].map(([l,fn]) => (
          <div key={l} onClick={fn} style={{ background:"#fff", borderRadius:12, padding:"15px 18px", marginBottom:9, display:"flex", justifyContent:"space-between", cursor:"pointer", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize:14 }}>{l}</span><span style={{ color:"#ddd" }}>›</span>
          </div>
        ))}

        {user
          ? <button onClick={logout} style={{ width:"100%", marginTop:8, background:"#fff", border:"1.5px solid #e05c2a", color:"#e05c2a", padding:"14px", borderRadius:14, fontWeight:700, fontSize:15 }}>退出登录</button>
          : <button onClick={() => nav("auth")} style={{ width:"100%", marginTop:8, background:"#1a1208", color:"#f5f0eb", border:"none", padding:"14px", borderRadius:14, fontWeight:700, fontSize:15 }}>立即登录 / 注册</button>
        }
      </div>
      <BNav />
    </W>
  );

  // ════════════════════════════════════════════════════
  // AUTH
  // ════════════════════════════════════════════════════
  if (page==="auth") return (
    <W>
      <Hdr title={authMode==="login"?"登录":"注册"} />
      <div style={{ padding:"36px 24px" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:5 }}>{authMode==="login"?"欢迎回来":"创建账号"}</div>
        <div style={{ color:"#aaa", marginBottom:28, fontSize:14 }}>{authMode==="login"?"登录后解锁购物、收藏等功能":"注册账号开始你的购物之旅"}</div>
        {authMode==="register" && (
          <input value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="邮箱地址"
            style={{ display:"block", width:"100%", padding:"14px 16px", borderRadius:12, border:"1.5px solid #e0d8d0", marginBottom:12, fontSize:14, outline:"none", fontFamily:"inherit", background:"#fdf6ee" }} />
        )}
        <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="用户名"
          style={{ display:"block", width:"100%", padding:"14px 16px", borderRadius:12, border:"1.5px solid #e0d8d0", marginBottom:12, fontSize:14, outline:"none", fontFamily:"inherit", background:"#fdf6ee" }} />
        <input type="password" value={form.pass} onChange={e => setForm(f=>({...f,pass:e.target.value}))} placeholder="密码"
          style={{ display:"block", width:"100%", padding:"14px 16px", borderRadius:12, border:"1.5px solid #e0d8d0", marginBottom:16, fontSize:14, outline:"none", fontFamily:"inherit", background:"#fdf6ee" }} />
        <button onClick={handleAuth} style={{ width:"100%", background:"#1a1208", color:"#f5f0eb", border:"none", padding:"15px", borderRadius:14, fontWeight:700, fontSize:16 }}>
          {authMode==="login"?"登录":"注册"}
        </button>
        <div style={{ textAlign:"center", marginTop:18, color:"#aaa", fontSize:14 }}>
          {authMode==="login"?"还没有账号？":"已有账号？"}
          <button onClick={() => setAuthMode(m=>m==="login"?"register":"login")} style={{ background:"none", border:"none", color:"#c8a97e", fontWeight:700, fontSize:14 }}>
            {authMode==="login"?" 立即注册":" 去登录"}
          </button>
        </div>
      </div>
    </W>
  );

  return null;
}
