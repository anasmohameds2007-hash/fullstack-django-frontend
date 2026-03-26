import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const PRODUCTS = [
  { id: 1, name: "AirPods Pro Max", cat: "Audio", price: 24999, oldPrice: 32000, badge: "HOT", emoji: "🎧", rating: 4.9, reviews: 2841 },
  { id: 2, name: "Ultrabook X1", cat: "Laptops", price: 89999, oldPrice: 109999, badge: "NEW", emoji: "💻", rating: 4.7, reviews: 1203 },
  { id: 3, name: "SmartWatch Pro", cat: "Wearables", price: 14999, oldPrice: 19999, badge: "DEAL", emoji: "⌚", rating: 4.8, reviews: 3402 },
  { id: 4, name: "MechKeyboard RGB", cat: "Accessories", price: 7499, oldPrice: 9999, badge: "", emoji: "⌨️", rating: 4.6, reviews: 892 },
  { id: 5, name: "4K Webcam Ultra", cat: "Cameras", price: 11999, oldPrice: 15999, badge: "HOT", emoji: "📷", rating: 4.5, reviews: 567 },
  { id: 6, name: "Gaming Mouse X", cat: "Accessories", price: 4999, oldPrice: 6999, badge: "", emoji: "🖱️", rating: 4.7, reviews: 2103 },
  { id: 7, name: "Curved Monitor 32\"", cat: "Displays", price: 34999, oldPrice: 42999, badge: "DEAL", emoji: "🖥️", rating: 4.9, reviews: 741 },
  { id: 8, name: "NoiseBuds X3", cat: "Audio", price: 3999, oldPrice: 5999, badge: "NEW", emoji: "🎵", rating: 4.4, reviews: 1890 },

  // NEW PRODUCTS
  { id: 9, name: "Portable Speaker Boom", cat: "Audio", price: 6999, oldPrice: 8999, badge: "HOT", emoji: "🔊", rating: 4.6, reviews: 1523 },
  { id: 10, name: "Fitness Band Lite", cat: "Wearables", price: 2999, oldPrice: 4999, badge: "", emoji: "🎽", rating: 4.3, reviews: 1105 },
  { id: 11, name: "Drone X Pro", cat: "Cameras", price: 45999, oldPrice: 59999, badge: "DEAL", emoji: "🛸", rating: 4.8, reviews: 632 },
  { id: 12, name: "VR Headset Neo", cat: "Accessories", price: 22999, oldPrice: 29999, badge: "NEW", emoji: "🕶️", rating: 4.7, reviews: 891 },
  { id: 13, name: "Smartphone Z12", cat: "Phones", price: 55999, oldPrice: 67999, badge: "HOT", emoji: "📱", rating: 4.9, reviews: 3241 },
  { id: 14, name: "Laptop Stand Pro", cat: "Accessories", price: 1999, oldPrice: 2499, badge: "", emoji: "🛠️", rating: 4.5, reviews: 712 },
  { id: 15, name: "Action Camera 4K", cat: "Cameras", price: 14999, oldPrice: 19999, badge: "DEAL", emoji: "🎬", rating: 4.6, reviews: 432 },
  { id: 16, name: "Wireless Charger Pad", cat: "Accessories", price: 1499, oldPrice: 1999, badge: "", emoji: "🔌", rating: 4.4, reviews: 650 },
  { id: 17, name: "Gaming Headset XLR", cat: "Audio", price: 8999, oldPrice: 11999, badge: "HOT", emoji: "🎧", rating: 4.7, reviews: 980 },
  { id: 18, name: "Ultra HD Monitor 27\"", cat: "Displays", price: 24999, oldPrice: 32999, badge: "DEAL", emoji: "🖥️", rating: 4.8, reviews: 540 },
  { id: 19, name: "Smart Glasses V2", cat: "Wearables", price: 18999, oldPrice: 22999, badge: "NEW", emoji: "🕶️", rating: 4.5, reviews: 425 },
  { id: 20, name: "Bluetooth Earbuds S", cat: "Audio", price: 3499, oldPrice: 4999, badge: "", emoji: "🎵", rating: 4.4, reviews: 1120 },
];

const CATEGORIES = ["All", "Audio", "Laptops", "Wearables", "Accessories", "Cameras", "Displays"];

const HEROES = [
  { tag: "Flash Sale", title: "Beats by Sound", sub: "Up to 50% off on premium audio gear", cta: "Shop Audio", bg: "#ff4d00", accent: "#ffb800", emoji: "🎧" },
  { tag: "New Arrival", title: "Power Unleashed", sub: "Next-gen laptops that redefine performance", cta: "Explore Now", bg: "#0a0a0f", accent: "#ff4d00", emoji: "💻" },
  { tag: "Limited Time", title: "Wear the Future", sub: "Smartwatches engineered for your lifestyle", cta: "View Deals", bg: "#1a1a2e", accent: "#e94560", emoji: "⌚" },
];

const STATS = [
  { n: "2M+", label: "Happy Customers" },
  { n: "50K+", label: "Products Listed" },
  { n: "4.9★", label: "Average Rating" },
  { n: "24/7", label: "Customer Support" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroIdx, setHeroIdx] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartPop, setCartPop] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setHeroIdx((i) => (i + 1) % HEROES.length), 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.cat === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCart((c) => [...c, product]);
    showToast(`${product.emoji} Added to cart!`);
  };

  const toggleWishlist = (id) => {
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const hero = HEROES[heroIdx];
  const discount = (p) => Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);

  return (
    <div className="lp-root">
      {/* TOAST */}
      {toast && <div className="lp-toast">{toast}</div>}

      {/* NAV */}
      <nav className={`lp-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => window.scrollTo(0, 0)}>⚡ NEXUS</div>
        <div className="nav-links">
          {[
            { label: "Home", href: "/" },
            { label: "Shop", href: "#products" },
            { label: "Deals", href: "#deals" },
            { label: "Categories", href: "#categories" },
            { label: "About", href: "/about" }
          ].map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="nav-link"
              onClick={(e) => {
                if (link.href.startsWith("/")) {
                  e.preventDefault();
                  navigate(link.href);
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search">🔍</button>
          <button className="nav-icon-btn" title="Wishlist">
            ♡ {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </button>
          <button className="nav-icon-btn cart-btn" onClick={() => setCartPop(!cartPop)}>
            🛒 {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
          </button>
          <button className="nav-profile" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className={`nav-search-bar ${searchOpen ? "open" : ""}`}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={searchOpen}
          />
          <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>✕</button>
        </div>

        {/* CART POPUP */}
        {cartPop && (
          <div className="cart-popup">
            <div className="cart-popup-header">
              <span>🛒 Cart ({cart.length})</span>
              <button onClick={() => setCartPop(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="cart-empty">Your cart is empty</p>
            ) : (
              <>
                {cart.slice(-4).map((p, i) => (
                  <div key={i} className="cart-item">
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    <span className="cart-item-price">₹{p.price.toLocaleString()}</span>
                  </div>
                ))}
                <div className="cart-total">
                  Total: ₹{cart.reduce((s, p) => s + p.price, 0).toLocaleString()}
                </div>
                <button className="cart-checkout-btn">Checkout →</button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="lp-hero" style={{ "--hero-bg": hero.bg, "--hero-accent": hero.accent }}>
        <div className="hero-bg-anim">
          {[...Array(8)].map((_, i) => <div key={i} className="hero-orb" style={{ "--oi": i }} />)}
        </div>
        <div className="hero-content">
          <div className="hero-tag" style={{ background: hero.accent }}>
            {hero.tag}
          </div>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-sub">{hero.sub}</p>
          <div className="hero-btns">
            <button className="hero-cta">{hero.cta} →</button>
            <button className="hero-secondary">View All</button>
          </div>
          <div className="hero-stats">
            {STATS.map((s) => (
              <div key={s.n} className="hero-stat">
                <span className="stat-n">{s.n}</span>
                <span className="stat-l">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-emoji-bubble">{hero.emoji}</div>
          <div className="hero-ring r1" />
          <div className="hero-ring r2" />
          <div className="hero-ring r3" />
        </div>
        <div className="hero-dots">
          {HEROES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === heroIdx ? "active" : ""}`}
              onClick={() => { setHeroIdx(i); clearInterval(timerRef.current); }}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIES BAR */}
      <section className="lp-cats">
        <div className="cats-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* MARQUEE BANNER */}
      <div className="lp-marquee">
        <div className="marquee-track">
          {[...Array(3)].map((_, ri) =>
            ["🔥 Flash Sale Live", "✦ Free Shipping ₹999+", "🎁 New Arrivals Daily", "⭐ Top Rated", "💳 EMI Available", "🔄 Easy Returns"].map((t, i) => (
              <span key={`${ri}-${i}`} className="marquee-item">{t}</span>
            ))
          )}
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <section className="lp-products">
        <div className="section-header">
          <h2>
            {activeCategory === "All" ? "Featured Products" : activeCategory}
            <span className="count-badge">{filtered.length}</span>
          </h2>
          <p>Handpicked for you</p>
        </div>

        <div className="products-grid">
          {filtered.map((product, idx) => (
            <div key={product.id} className="product-card" style={{ "--delay": `${idx * 0.05}s` }}>
              {product.badge && (
                <span className={`p-badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
              )}
              <button
                className={`p-wish ${wishlist.includes(product.id) ? "wished" : ""}`}
                onClick={() => toggleWishlist(product.id)}
              >
                {wishlist.includes(product.id) ? "♥" : "♡"}
              </button>
              <div className="p-emoji-wrap">
                <div className="p-emoji">{product.emoji}</div>
              </div>
              <div className="p-info">
                <span className="p-cat">{product.cat}</span>
                <h3 className="p-name">{product.name}</h3>
                <div className="p-rating">
                  {"★".repeat(Math.floor(product.rating))}
                  <span className="p-rating-n">{product.rating}</span>
                  <span className="p-reviews">({product.reviews.toLocaleString()})</span>
                </div>
                <div className="p-pricing">
                  <span className="p-price">₹{product.price.toLocaleString()}</span>
                  <span className="p-old">₹{product.oldPrice.toLocaleString()}</span>
                  <span className="p-off">-{discount(product)}%</span>
                </div>
              </div>
              <button className="p-add-btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="lp-promo">
        <div className="promo-card promo-left">
          <span className="promo-label">🔥 Today's Deal</span>
          <h3>Flat ₹500 Off</h3>
          <p>On orders above ₹2999</p>
          <button className="promo-btn">Claim Now</button>
        </div>
        <div className="promo-card promo-right">
          <span className="promo-label">📦 Free Delivery</span>
          <h3>Across India</h3>
          <p>On all orders above ₹999</p>
          <button className="promo-btn">Shop Now</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">⚡ NEXUS</div>
            <p>Your premium shopping destination for electronics & lifestyle.</p>
            <div className="footer-socials">
              {["𝕏", "📘", "📸", "▶️"].map((s, i) => (
                <button key={i} className="social-icon">{s}</button>
              ))}
            </div>
          </div>
          {[
            { title: "Shop", links: ["Electronics", "Wearables", "Accessories", "Deals"] },
            { title: "Support", links: ["Track Order", "Returns", "FAQs", "Contact Us"] },
            { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
          ].map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              {col.links.map((l) => <a key={l} href="#">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2025 NEXUS. All rights reserved.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </footer>
    </div>
  );
}