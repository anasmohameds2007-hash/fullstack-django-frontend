import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, getUserDisplayName, logout } from '../utils/auth';
import Avatar from '../components/Avatar';
import "./DealsPage.css";

const DEALS = [
  { id: 1, name: "AirPods Pro Max", cat: "Audio", price: 24999, oldPrice: 32000, badge: "HOT", emoji: "🎧", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&h=500&fit=crop", rating: 4.9, reviews: 2841, dealType: "flash" },
  { id: 3, name: "SmartWatch Pro", cat: "Wearables", price: 14999, oldPrice: 19999, badge: "DEAL", emoji: "⌚", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", rating: 4.8, reviews: 3402, dealType: "lightning" },
  { id: 5, name: "4K Webcam Ultra", cat: "Cameras", price: 11999, oldPrice: 15999, badge: "HOT", emoji: "📷", image: "https://images.unsplash.com/photo-1587825137904-6e0881d9b5f0?w=500&h=500&fit=crop", rating: 4.5, reviews: 567, dealType: "flash" },
  { id: 7, name: "Curved Monitor 32\"", cat: "Displays", price: 34999, oldPrice: 42999, badge: "DEAL", emoji: "🖥️", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop", rating: 4.9, reviews: 741, dealType: "bundle" },
  { id: 9, name: "MacBook Pro 16\"", cat: "Laptops", price: 249999, oldPrice: 279999, badge: "HOT", emoji: "💻", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&h=500&fit=crop", rating: 4.9, reviews: 4521, dealType: "flash" },
  { id: 10, name: "Sony WH-1000XM5", cat: "Audio", price: 29999, oldPrice: 34999, badge: "DEAL", emoji: "🎧", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop", rating: 4.8, reviews: 3892, dealType: "lightning" },
  { id: 14, name: "Canon EOS R6", cat: "Cameras", price: 189999, oldPrice: 219999, badge: "HOT", emoji: "📷", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop", rating: 4.9, reviews: 892, dealType: "flash" },
  { id: 15, name: "LG OLED 55\"", cat: "Displays", price: 149999, oldPrice: 179999, badge: "DEAL", emoji: "🖥️", image: "https://images.unsplash.com/photo-1593784697956-ec9c9bbd8dc9?w=500&h=500&fit=crop", rating: 4.8, reviews: 1234, dealType: "bundle" },
  { id: 18, name: "Garmin Fenix 7", cat: "Wearables", price: 64999, oldPrice: 74999, badge: "HOT", emoji: "⌚", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop", rating: 4.9, reviews: 1892, dealType: "lightning" },
  { id: 20, name: "GoPro Hero 12", cat: "Cameras", price: 39999, oldPrice: 49999, badge: "DEAL", emoji: "📷", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop", rating: 4.7, reviews: 2134, dealType: "flash" },
  { id: 21, name: "Samsung Odyssey G9", cat: "Displays", price: 99999, oldPrice: 129999, badge: "HOT", emoji: "🖥️", image: "https://images.unsplash.com/photo-1547082299-de196ea47f56?w=500&h=500&fit=crop", rating: 4.8, reviews: 567, dealType: "bundle" },
  { id: 24, name: "Apple Watch Ultra 2", cat: "Wearables", price: 79999, oldPrice: 89999, badge: "HOT", emoji: "⌚", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop", rating: 4.9, reviews: 5678, dealType: "lightning" },
  { id: 25, name: "Razer Blade Stealth", cat: "Accessories", price: 12999, oldPrice: 15999, badge: "DEAL", emoji: "🎮", image: "https://images.unsplash.com/photo-1593305841991-05c29736760b?w=500&h=500&fit=crop", rating: 4.5, reviews: 1234, dealType: "flash" },
  { id: 28, name: "Bose QuietComfort", cat: "Audio", price: 22999, oldPrice: 27999, badge: "DEAL", emoji: "🎧", image: "https://images.unsplash.com/photo-1524678606372-987d7e66c99f?w=500&h=500&fit=crop", rating: 4.6, reviews: 2345, dealType: "lightning" },
];

const DEAL_CATEGORIES = ["All", "Flash Sale", "Lightning Deals", "Bundle Offers"];
const TIME_LEFT = {
  flash: "Ends in 2h 34m",
  lightning: "Ends in 45m 12s",
  bundle: "Ends in 5h 20m"
};

export default function DealsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeDealType, setActiveDealType] = useState("All");
  const [toast, setToast] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Initialize countdown timers
    const timers = {};
    DEALS.forEach(deal => {
      timers[deal.id] = TIME_LEFT[deal.dealType];
    });
    setTimeLeft(timers);

    const interval = setInterval(() => {
      // Simulate countdown (in real app, calculate actual time)
      setTimeLeft(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          // Just for visual effect
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      if (window.confirm(`Hi ${getUserDisplayName(user)}!\n\nDo you want to logout?`)) {
        logout();
        setUser(null);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const filtered = activeDealType === "All" 
    ? DEALS 
    : DEALS.filter(deal => {
        const typeMap = {
          "Flash Sale": "flash",
          "Lightning Deals": "lightning",
          "Bundle Offers": "bundle"
        };
        return deal.dealType === typeMap[activeDealType];
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

  const discount = (p) => Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);

  return (
    <div className="deals-root">
      {toast && <div className="deals-toast">{toast}</div>}

      {/* NAV */}
      <nav className="deals-nav">
        <div className="nav-logo" onClick={() => navigate("/")}>⚡ NEXUS</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/deals" className="nav-link active">Deals</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/about" className="nav-link">About</Link>
        </div>
        <div className="nav-actions">
          <button className="nav-icon-btn" title="Search">🔍</button>
          <button className="nav-icon-btn" title="Wishlist">
            ♡ {wishlist.length > 0 && <span className="nav-badge">{wishlist.length}</span>}
          </button>
          <button className="nav-icon-btn" title="Cart">
            🛒 {cart.length > 0 && <span className="nav-badge">{cart.length}</span>}
          </button>
          {user ? (
            <Avatar 
              name={getUserDisplayName(user)} 
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
      </nav>

      {/* HERO BANNER */}
      <section className="deals-hero">
        <div className="hero-content">
          <div className="hero-badge">🔥 Limited Time Only</div>
          <h1>Mega Deals & Offers</h1>
          <p>Save big with our exclusive deals on premium tech products</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{filtered.length}</span>
              <span className="stat-label">Active Deals</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Up to 50%</span>
              <span className="stat-label">Off</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">Free</span>
              <span className="stat-label">Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* DEAL CATEGORIES */}
      <section className="deals-categories">
        {DEAL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`deal-cat-pill ${activeDealType === cat ? "active" : ""}`}
            onClick={() => setActiveDealType(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* DEALS GRID */}
      <section className="deals-products">
        <div className="deals-header">
          <h2>{activeDealType === "All" ? "All Deals" : activeDealType}</h2>
          <span className="deals-count">{filtered.length} deals available</span>
        </div>

        <div className="products-grid">
          {filtered.map((product, idx) => (
            <div key={product.id} className="deal-card" style={{ "--delay": `${idx * 0.05}s` }}>
              <div className={`deal-badge deal-${product.dealType}`}>
                {product.badge}
              </div>
              <div className="timer-badge">⏰ {timeLeft[product.id]}</div>
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
                  <span className="p-off-large">-{discount(product)}% OFF</span>
                </div>
                <div className="savings-text">You save ₹{(product.oldPrice - product.price).toLocaleString()}</div>
              </div>
              <button className="p-add-btn" onClick={() => addToCart(product)}>
                Grab Deal →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PROMO SECTION */}
      <section className="deals-promo">
        <div className="promo-banner">
          <h2>💰 Extra Savings Alert!</h2>
          <p>Use code <strong>MEGA500</strong> for additional ₹500 off on orders above ₹4999</p>
          <button className="promo-btn">Shop Now</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="deals-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>⚡ NEXUS</h3>
            <p>Your premium tech shopping destination</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/deals">Deals</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Policies</h4>
            <ul>
              <li><button onClick={() => {}} className="footer-link">Privacy Policy</button></li>
              <li><button onClick={() => {}} className="footer-link">Terms & Conditions</button></li>
              <li><button onClick={() => {}} className="footer-link">Return Policy</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <button onClick={() => {}} className="footer-link">Facebook</button>
              <button onClick={() => {}} className="footer-link">Twitter</button>
              <button onClick={() => {}} className="footer-link">Instagram</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 NEXUS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
