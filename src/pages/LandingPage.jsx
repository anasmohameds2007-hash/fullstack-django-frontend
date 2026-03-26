import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../api';
import "./LandingPage.css";

const CATEGORIES = ["All", "Audio", "Laptops", "Wearables", "Accessories", "Cameras", "Displays", "Phones"];

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

// Helper for authenticated fetch calls
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(apiUrl(url), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    }
  });
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const isLoggedIn = () => !!localStorage.getItem('token');

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (activeCategory !== 'All') {
        params.append('category', activeCategory);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (params.toString()) {
        url += '?' + params.toString();
      }
      const response = await fetch(apiUrl(url));
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const response = await authFetch('/api/cart');
      const data = await response.json();
      if (response.ok && data.cart) {
        // Transform cart items to match the UI format
        const cartItems = data.cart.items.map(item => ({
          ...item.productId,
          quantity: item.quantity
        }));
        setCart(cartItems);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  }, []);

  // Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const response = await authFetch('/api/wishlist');
      const data = await response.json();
      if (response.ok && data.wishlist) {
        // Extract product IDs for the wishlist state
        const wishlistIds = data.wishlist.products.map(p => p._id);
        setWishlist(wishlistIds);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist]);

  useEffect(() => {
    timerRef.current = setInterval(() => setHeroIdx((i) => (i + 1) % HEROES.length), 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = products;

  const addToCart = async (product) => {
    if (!isLoggedIn()) {
      // Client-side only for unauthenticated users
      setCart((c) => [...c, product]);
      showToast(`${product.emoji} Added to cart!`);
      return;
    }

    try {
      const response = await authFetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      const data = await response.json();
      if (response.ok && data.cart) {
        const cartItems = data.cart.items.map(item => ({
          ...item.productId,
          quantity: item.quantity
        }));
        setCart(cartItems);
        showToast(`${product.emoji} Added to cart!`);
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      // Fallback to client-side
      setCart((c) => [...c, product]);
      showToast(`${product.emoji} Added to cart!`);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isLoggedIn()) {
      setCart((c) => c.filter((p) => p._id !== productId));
      return;
    }

    try {
      const response = await authFetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok && data.cart) {
        const cartItems = data.cart.items.map(item => ({
          ...item.productId,
          quantity: item.quantity
        }));
        setCart(cartItems);
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!isLoggedIn()) {
      // Client-side only for unauthenticated users
      setWishlist((w) => w.includes(productId) ? w.filter((x) => x !== productId) : [...w, productId]);
      return;
    }

    try {
      const response = await authFetch('/api/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      const data = await response.json();
      if (response.ok && data.wishlist) {
        const wishlistIds = data.wishlist.products.map(p => p._id);
        setWishlist(wishlistIds);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      // Fallback to client-side
      setWishlist((w) => w.includes(productId) ? w.filter((x) => x !== productId) : [...w, productId]);
    }
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
                  <div key={p._id || i} className="cart-item">
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    <span className="cart-item-price">₹{p.price.toLocaleString()}</span>
                    <button 
                      onClick={() => removeFromCart(p._id)} 
                      style={{ marginLeft: '0.5rem', cursor: 'pointer', background: 'none', border: 'none', color: '#ff4d4d' }}
                    >
                      ✕
                    </button>
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

        {loading ? (
          <div className="products-loading" style={{ textAlign: 'center', padding: '3rem' }}>
            Loading products...
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((product, idx) => (
              <div key={product._id} className="product-card" style={{ "--delay": `${idx * 0.05}s` }}>
                {product.badge && (
                  <span className={`p-badge badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
                )}
                <button
                  className={`p-wish ${wishlist.includes(product._id) ? "wished" : ""}`}
                  onClick={() => toggleWishlist(product._id)}
                >
                  {wishlist.includes(product._id) ? "♥" : "♡"}
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
        )}
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