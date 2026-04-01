import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, getUserDisplayName, logout } from '../utils/auth';
import Avatar from '../components/Avatar';
import "./CategoriesPage.css";

const CATEGORIES_DATA = [
  { 
    id: 1, 
    name: "Audio", 
    emoji: "🎧", 
    description: "Headphones, Earbuds, Speakers",
    count: 8,
    color: "#ff4d00",
    products: [
      { id: 1, name: "AirPods Pro Max", price: 24999, oldPrice: 32000, badge: "HOT", emoji: "🎧", rating: 4.9 },
      { id: 8, name: "NoiseBuds X3", price: 3999, oldPrice: 5999, badge: "NEW", emoji: "🎵", rating: 4.4 },
      { id: 10, name: "Sony WH-1000XM5", price: 29999, oldPrice: 34999, badge: "DEAL", emoji: "🎧", rating: 4.8 },
      { id: 16, name: "JBL Flip 6", price: 8999, oldPrice: 11999, badge: "", emoji: "🔊", rating: 4.6 },
      { id: 22, name: "Sennheiser Momentum", price: 24999, oldPrice: 29999, badge: "", emoji: "🎧", rating: 4.7 },
      { id: 28, name: "Bose QuietComfort", price: 22999, oldPrice: 27999, badge: "DEAL", emoji: "🎧", rating: 4.6 },
    ]
  },
  { 
    id: 2, 
    name: "Laptops", 
    emoji: "💻", 
    description: "Ultrabooks, Gaming Laptops, Workstations",
    count: 6,
    color: "#2979ff",
    products: [
      { id: 2, name: "Ultrabook X1", price: 89999, oldPrice: 109999, badge: "NEW", emoji: "💻", rating: 4.7 },
      { id: 9, name: "MacBook Pro 16\"", price: 249999, oldPrice: 279999, badge: "HOT", emoji: "💻", rating: 4.9 },
      { id: 11, name: "Dell XPS 15", price: 129999, oldPrice: 159999, badge: "", emoji: "💻", rating: 4.6 },
      { id: 17, name: "HP Spectre x360", price: 149999, oldPrice: 179999, badge: "NEW", emoji: "💻", rating: 4.7 },
      { id: 23, name: "Lenovo ThinkPad X1", price: 169999, oldPrice: 199999, badge: "NEW", emoji: "💻", rating: 4.8 },
    ]
  },
  { 
    id: 3, 
    name: "Wearables", 
    emoji: "⌚", 
    description: "Smartwatches, Fitness Trackers",
    count: 4,
    color: "#00c853",
    products: [
      { id: 3, name: "SmartWatch Pro", price: 14999, oldPrice: 19999, badge: "DEAL", emoji: "⌚", rating: 4.8 },
      { id: 12, name: "Fitbit Charge 6", price: 12999, oldPrice: 16999, badge: "NEW", emoji: "⌚", rating: 4.5 },
      { id: 18, name: "Garmin Fenix 7", price: 64999, oldPrice: 74999, badge: "HOT", emoji: "⌚", rating: 4.9 },
      { id: 24, name: "Apple Watch Ultra 2", price: 79999, oldPrice: 89999, badge: "HOT", emoji: "⌚", rating: 4.9 },
    ]
  },
  { 
    id: 4, 
    name: "Accessories", 
    emoji: "🔌", 
    description: "Keyboards, Mice, Chargers & More",
    count: 5,
    color: "#ff9100",
    products: [
      { id: 4, name: "MechKeyboard RGB", price: 7499, oldPrice: 9999, badge: "", emoji: "⌨️", rating: 4.6 },
      { id: 6, name: "Gaming Mouse X", price: 4999, oldPrice: 6999, badge: "", emoji: "🖱️", rating: 4.7 },
      { id: 13, name: "USB-C Hub Pro", price: 3499, oldPrice: 4999, badge: "", emoji: "🔌", rating: 4.3 },
      { id: 19, name: "Wireless Charger Pad", price: 1999, oldPrice: 2999, badge: "", emoji: "🔋", rating: 4.2 },
      { id: 25, name: "Razer Blade Stealth", price: 12999, oldPrice: 15999, badge: "DEAL", emoji: "🎮", rating: 4.5 },
    ]
  },
  { 
    id: 5, 
    name: "Cameras", 
    emoji: "📷", 
    description: "DSLR, Mirrorless, Action Cameras",
    count: 4,
    color: "#e94560",
    products: [
      { id: 5, name: "4K Webcam Ultra", price: 11999, oldPrice: 15999, badge: "HOT", emoji: "📷", rating: 4.5 },
      { id: 14, name: "Canon EOS R6", price: 189999, oldPrice: 219999, badge: "HOT", emoji: "📷", rating: 4.9 },
      { id: 20, name: "GoPro Hero 12", price: 39999, oldPrice: 49999, badge: "DEAL", emoji: "📷", rating: 4.7 },
      { id: 26, name: "Nikon Z8", price: 279999, oldPrice: 319999, badge: "NEW", emoji: "📷", rating: 4.9 },
    ]
  },
  { 
    id: 6, 
    name: "Displays", 
    emoji: "🖥️", 
    description: "Monitors, TVs, Projectors",
    count: 4,
    color: "#aa00ff",
    products: [
      { id: 7, name: "Curved Monitor 32\"", price: 34999, oldPrice: 42999, badge: "DEAL", emoji: "🖥️", rating: 4.9 },
      { id: 15, name: "LG OLED 55\"", price: 149999, oldPrice: 179999, badge: "DEAL", emoji: "🖥️", rating: 4.8 },
      { id: 21, name: "Samsung Odyssey G9", price: 99999, oldPrice: 129999, badge: "HOT", emoji: "🖥️", rating: 4.8 },
      { id: 27, name: "ASUS ROG Swift", price: 79999, oldPrice: 99999, badge: "", emoji: "🖥️", rating: 4.7 },
    ]
  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleProfileClick = () => {
    if (user) {
      if (window.confirm(`Hi ${user.name}!\n\nDo you want to logout?`)) {
        logout();
        setUser(null);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

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
    <div className="categories-root">
      {toast && <div className="categories-toast">{toast}</div>}

      {/* NAV */}
      <nav className="categories-nav">
        <div className="nav-logo" onClick={() => navigate("/")}>⚡ NEXUS</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/deals" className="nav-link">Deals</Link>
          <Link to="/categories" className="nav-link active">Categories</Link>
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

      {/* HERO */}
      <section className="categories-hero">
        <div className="hero-content">
          <h1>Browse by Category</h1>
          <p>Explore our curated collection of premium tech products</p>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="categories-grid-section">
        {CATEGORIES_DATA.map((category) => (
          <div 
            key={category.id} 
            className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
            style={{ "--cat-color": category.color }}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <div className="cat-icon">{category.emoji}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <div className="cat-count">{category.count} Products</div>
            <div className="cat-arrow">→</div>
          </div>
        ))}
      </section>

      {/* PRODUCTS PREVIEW */}
      {selectedCategory && (
        <section className="category-products">
          <div className="products-header">
            <h2>
              {CATEGORIES_DATA.find(c => c.id === selectedCategory)?.emoji} 
              {" "}
              {CATEGORIES_DATA.find(c => c.id === selectedCategory)?.name} Products
            </h2>
            <button onClick={() => setSelectedCategory(null)}>Close ×</button>
          </div>
          
          <div className="products-grid">
            {CATEGORIES_DATA.find(c => c.id === selectedCategory)?.products.map((product, idx) => (
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
                  <h3 className="p-name">{product.name}</h3>
                  <div className="p-rating">
                    {"★".repeat(Math.floor(product.rating))}
                    <span className="p-rating-n">{product.rating}</span>
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
      )}

      {/* FOOTER */}
      <footer className="categories-footer">
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
