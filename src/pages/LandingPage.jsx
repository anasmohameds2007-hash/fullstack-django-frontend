import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getCurrentUser, logout } from '../utils/auth';
import Avatar from '../components/Avatar';
import "./LandingPage.css";
 
const PRODUCTS = [
  { 
    id: 1, 
    name: "AirPods Pro Max", 
    cat: "Audio", 
    price: 24999, 
    oldPrice: 32000, 
    badge: "HOT", 
    emoji: "🎧", 
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 2841 
  },
  { 
    id: 2, 
    name: "Ultrabook X1", 
    cat: "Laptops", 
    price: 89999, 
    oldPrice: 109999, 
    badge: "NEW", 
    emoji: "💻", 
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    rating: 4.7, 
    reviews: 1203 
  },
  { 
    id: 3, 
    name: "SmartWatch Pro", 
    cat: "Wearables", 
    price: 14999, 
    oldPrice: 19999, 
    badge: "DEAL", 
    emoji: "⌚", 
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    rating: 4.8, 
    reviews: 3402 
  },
  { 
    id: 4, 
    name: "MechKeyboard RGB", 
    cat: "Accessories", 
    price: 7499, 
    oldPrice: 9999, 
    badge: "", 
    emoji: "⌨️", 
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&h=500&fit=crop",
    rating: 4.6, 
    reviews: 892 
  },
  { 
    id: 5, 
    name: "4K Webcam Ultra", 
    cat: "Cameras", 
    price: 11999, 
    oldPrice: 15999, 
    badge: "HOT", 
    emoji: "📷", 
    image: "https://images.unsplash.com/photo-1587825137904-6e0881d9b5f0?w=500&h=500&fit=crop",
    rating: 4.5, 
    reviews: 567 
  },
  { 
    id: 6, 
    name: "Gaming Mouse X", 
    cat: "Accessories", 
    price: 4999, 
    oldPrice: 6999, 
    badge: "", 
    emoji: "🖱️", 
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
    rating: 4.7, 
    reviews: 2103 
  },
  { 
    id: 7, 
    name: "Curved Monitor 32\"", 
    cat: "Displays", 
    price: 34999, 
    oldPrice: 42999, 
    badge: "DEAL", 
    emoji: "🖥️", 
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 741 
  },
  { 
    id: 8, 
    name: "NoiseBuds X3", 
    cat: "Audio", 
    price: 3999, 
    oldPrice: 5999, 
    badge: "NEW", 
    emoji: "🎵", 
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
    rating: 4.4, 
    reviews: 1890 
  },
  { 
    id: 9, 
    name: "MacBook Pro 16\"", 
    cat: "Laptops", 
    price: 249999, 
    oldPrice: 279999, 
    badge: "HOT", 
    emoji: "💻", 
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 4521 
  },
  { 
    id: 10, 
    name: "Sony WH-1000XM5", 
    cat: "Audio", 
    price: 29999, 
    oldPrice: 34999, 
    badge: "DEAL", 
    emoji: "🎧", 
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
    rating: 4.8, 
    reviews: 3892 
  },
  { 
    id: 11, 
    name: "Dell XPS 15", 
    cat: "Laptops", 
    price: 129999, 
    oldPrice: 159999, 
    badge: "", 
    emoji: "💻", 
    image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&h=500&fit=crop",
    rating: 4.6, 
    reviews: 987 
  },
  { 
    id: 12, 
    name: "Fitbit Charge 6", 
    cat: "Wearables", 
    price: 12999, 
    oldPrice: 16999, 
    badge: "NEW", 
    emoji: "⌚", 
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&h=500&fit=crop",
    rating: 4.5, 
    reviews: 2341 
  },
  { 
    id: 13, 
    name: "USB-C Hub Pro", 
    cat: "Accessories", 
    price: 3499, 
    oldPrice: 4999, 
    badge: "", 
    emoji: "🔌", 
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop",
    rating: 4.3, 
    reviews: 1567 
  },
  { 
    id: 14, 
    name: "Canon EOS R6", 
    cat: "Cameras", 
    price: 189999, 
    oldPrice: 219999, 
    badge: "HOT", 
    emoji: "📷", 
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 892 
  },
  { 
    id: 15, 
    name: "LG OLED 55\"", 
    cat: "Displays", 
    price: 149999, 
    oldPrice: 179999, 
    badge: "DEAL", 
    emoji: "🖥️", 
    image: "https://images.unsplash.com/photo-1593784697956-ec9c9bbd8dc9?w=500&h=500&fit=crop",
    rating: 4.8, 
    reviews: 1234 
  },
  { 
    id: 16, 
    name: "JBL Flip 6", 
    cat: "Audio", 
    price: 8999, 
    oldPrice: 11999, 
    badge: "", 
    emoji: "🔊", 
    image: "https://images.unsplash.com/photo-1543515816-18c6837265ea?w=500&h=500&fit=crop",
    rating: 4.6, 
    reviews: 2678 
  },
  { 
    id: 17, 
    name: "HP Spectre x360", 
    cat: "Laptops", 
    price: 149999, 
    oldPrice: 179999, 
    badge: "NEW", 
    emoji: "💻", 
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&h=500&fit=crop",
    rating: 4.7, 
    reviews: 756 
  },
  { 
    id: 18, 
    name: "Garmin Fenix 7", 
    cat: "Wearables", 
    price: 64999, 
    oldPrice: 74999, 
    badge: "HOT", 
    emoji: "⌚", 
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 1892 
  },
  { 
    id: 19, 
    name: "Wireless Charger Pad", 
    cat: "Accessories", 
    price: 1999, 
    oldPrice: 2999, 
    badge: "", 
    emoji: "🔋", 
    image: "https://images.unsplash.com/photo-1616169997363-2e3c3c0e0a7e?w=500&h=500&fit=crop",
    rating: 4.2, 
    reviews: 3421 
  },
  { 
    id: 20, 
    name: "GoPro Hero 12", 
    cat: "Cameras", 
    price: 39999, 
    oldPrice: 49999, 
    badge: "DEAL", 
    emoji: "📷", 
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop",
    rating: 4.7, 
    reviews: 2134 
  },
  { 
    id: 21, 
    name: "Samsung Odyssey G9", 
    cat: "Displays", 
    price: 99999, 
    oldPrice: 129999, 
    badge: "HOT", 
    emoji: "🖥️", 
    image: "https://images.unsplash.com/photo-1547082299-de196ea47f56?w=500&h=500&fit=crop",
    rating: 4.8, 
    reviews: 567 
  },
  { 
    id: 22, 
    name: "Sennheiser Momentum", 
    cat: "Audio", 
    price: 24999, 
    oldPrice: 29999, 
    badge: "", 
    emoji: "🎧", 
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    rating: 4.7, 
    reviews: 1456 
  },
  { 
    id: 23, 
    name: "Lenovo ThinkPad X1", 
    cat: "Laptops", 
    price: 169999, 
    oldPrice: 199999, 
    badge: "NEW", 
    emoji: "💻", 
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop",
    rating: 4.8, 
    reviews: 892 
  },
  { 
    id: 24, 
    name: "Apple Watch Ultra 2", 
    cat: "Wearables", 
    price: 79999, 
    oldPrice: 89999, 
    badge: "HOT", 
    emoji: "⌚", 
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 5678 
  },
  { 
    id: 25, 
    name: "Razer Blade Stealth", 
    cat: "Accessories", 
    price: 12999, 
    oldPrice: 15999, 
    badge: "DEAL", 
    emoji: "🎮", 
    image: "https://images.unsplash.com/photo-1593305841991-05c29736760b?w=500&h=500&fit=crop",
    rating: 4.5, 
    reviews: 1234 
  },
  { 
    id: 26, 
    name: "Nikon Z8", 
    cat: "Cameras", 
    price: 279999, 
    oldPrice: 319999, 
    badge: "NEW", 
    emoji: "📷", 
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    rating: 4.9, 
    reviews: 456 
  },
  { 
    id: 27, 
    name: "ASUS ROG Swift", 
    cat: "Displays", 
    price: 79999, 
    oldPrice: 99999, 
    badge: "", 
    emoji: "🖥️", 
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop",
    rating: 4.7, 
    reviews: 789 
  },
  { 
    id: 28, 
    name: "Bose QuietComfort", 
    cat: "Audio", 
    price: 22999, 
    oldPrice: 27999, 
    badge: "DEAL", 
    emoji: "🎧", 
    image: "https://images.unsplash.com/photo-1524678606372-987d7e66c99f?w=500&h=500&fit=crop",
    rating: 4.6, 
    reviews: 2345 
  },
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
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(urlCategory || "All");
  const [heroIdx, setHeroIdx] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartPop, setCartPop] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const timerRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      // Show logout confirmation or navigate to profile
      if (window.confirm(`Hi ${user.name}!\n\nDo you want to logout?`)) {
        logout();
        setUser(null);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };
 
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
        <div className="nav-logo">⚡ NEXUS</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/deals" className="nav-link">Deals</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search">🔍</button>
          <button className="nav-icon-btn" title="Wishlist">
            ♡ {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </button>
          <button className="nav-icon-btn cart-btn" onClick={() => setCartPop(!cartPop)}>
            🛒 {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
          </button>
          {user ? (
            <Avatar 
              name={user.name} 
              size="medium"
              onClick={handleProfileClick}
              showTooltip={true}
            />
          ) : (
            <button className="nav-profile" onClick={handleProfileClick}>
              Sign In
            </button>
          )}
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
            <button 
              className="hero-cta"
              onClick={() => {
                if (hero.cta === "Shop Audio") navigate("/shop");
                else if (hero.cta === "Explore Now") navigate("/shop");
                else if (hero.cta === "View Deals") navigate("/deals");
              }}
            >
              {hero.cta} →
            </button>
            <button className="hero-secondary" onClick={() => navigate("/shop")}>View All</button>
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
            <Link
              key={cat}
              to={cat === "All" ? "/" : `/?category=${encodeURIComponent(cat)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey) {
                  e.preventDefault();
                  setActiveCategory(cat);
                }
              }}
            >
              {cat}
            </Link>
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
              <div className="p-image-wrap">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="p-image"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to emoji-based placeholder if image fails
                    const emojiMap = {
                      '🎧': 'headphones',
                      '💻': 'laptop',
                      '⌚': 'smartwatch',
                      '⌨️': 'keyboard',
                      '📷': 'camera',
                      '🖱️': 'mouse',
                      '🖥️': 'monitor',
                      '🎵': 'earbuds',
                      '🔊': 'speaker',
                      '🔌': 'adapter',
                      '🔋': 'charger',
                      '🎮': 'gaming'
                    };
                    const keyword = emojiMap[product.emoji] || 'product';
                    e.target.src = `https://placehold.co/500x500/f3f4f6/667eea?text=${keyword}`;
                    e.target.alt = `${product.name} - Image unavailable`;
                  }}
                />
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
          <button 
            className="promo-btn"
            onClick={() => {
              showToast('🎉 Coupon Applied! Use code: DEAL500');
              navigate('/deals');
            }}
          >
            Claim Now →
          </button>
        </div>
        <div className="promo-card promo-right">
          <span className="promo-label">📦 Free Delivery</span>
          <h3>Across India</h3>
          <p>On all orders above ₹999</p>
          <button 
            className="promo-btn"
            onClick={() => {
              showToast('🛍️ Redirecting to shop...');
              navigate('/shop');
            }}
          >
            Shop Now →
          </button>
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
                <button key={i} className="social-icon" onClick={() => alert('Social media coming soon!')}>{s}</button>
              ))}
            </div>
          </div>
          {[
            { 
              title: "Shop", 
              links: [
                { label: "All Categories", path: "/shop-categories" },
                { label: "Deals", path: "/deals" },
                { label: "Electronics", path: "/shop?category=Audio" },
                { label: "Wearables", path: "/shop?category=Wearables" }
              ] 
            },
            { 
              title: "Support", 
              links: [
                { label: "Help Center", path: "/support" },
                { label: "Track Order", path: "/support" },
                { label: "Returns", path: "/support" },
                { label: "Contact Us", path: "/support" }
              ] 
            },
            { 
              title: "Company", 
              links: [
                { label: "About Us", path: "/about" },
                { label: "Our Team", path: "/company" },
                { label: "Careers", path: "/company" },
                { label: "Blog", path: "/company" }
              ] 
            },
          ].map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              {col.links.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => navigate(item.path)} 
                  className="footer-link"
                >
                  {item.label}
                </button>
              ))}
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