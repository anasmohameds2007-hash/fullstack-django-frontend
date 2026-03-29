import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCurrentUser, logout } from '../utils/auth';
import Avatar from '../components/Avatar';
import "./ShopPage.css";

const PRODUCTS = [
  { id: 1, name: "AirPods Pro Max", cat: "Audio", price: 24999, oldPrice: 32000, badge: "HOT", emoji: "🎧", image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&h=500&fit=crop", rating: 4.9, reviews: 2841 },
  { id: 2, name: "Ultrabook X1", cat: "Laptops", price: 89999, oldPrice: 109999, badge: "NEW", emoji: "💻", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop", rating: 4.7, reviews: 1203 },
  { id: 3, name: "SmartWatch Pro", cat: "Wearables", price: 14999, oldPrice: 19999, badge: "DEAL", emoji: "⌚", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", rating: 4.8, reviews: 3402 },
  { id: 4, name: "MechKeyboard RGB", cat: "Accessories", price: 7499, oldPrice: 9999, badge: "", emoji: "⌨️", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&h=500&fit=crop", rating: 4.6, reviews: 892 },
  { id: 5, name: "4K Webcam Ultra", cat: "Cameras", price: 11999, oldPrice: 15999, badge: "HOT", emoji: "📷", image: "https://images.unsplash.com/photo-1587825137904-6e0881d9b5f0?w=500&h=500&fit=crop", rating: 4.5, reviews: 567 },
  { id: 6, name: "Gaming Mouse X", cat: "Accessories", price: 4999, oldPrice: 6999, badge: "", emoji: "🖱️", image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop", rating: 4.7, reviews: 2103 },
  { id: 7, name: "Curved Monitor 32\"", cat: "Displays", price: 34999, oldPrice: 42999, badge: "DEAL", emoji: "🖥️", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop", rating: 4.9, reviews: 741 },
  { id: 8, name: "NoiseBuds X3", cat: "Audio", price: 3999, oldPrice: 5999, badge: "NEW", emoji: "🎵", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop", rating: 4.4, reviews: 1890 },
  { id: 9, name: "MacBook Pro 16\"", cat: "Laptops", price: 249999, oldPrice: 279999, badge: "HOT", emoji: "💻", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&h=500&fit=crop", rating: 4.9, reviews: 4521 },
  { id: 10, name: "Sony WH-1000XM5", cat: "Audio", price: 29999, oldPrice: 34999, badge: "DEAL", emoji: "🎧", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop", rating: 4.8, reviews: 3892 },
  { id: 11, name: "Dell XPS 15", cat: "Laptops", price: 129999, oldPrice: 159999, badge: "", emoji: "💻", image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&h=500&fit=crop", rating: 4.6, reviews: 987 },
  { id: 12, name: "Fitbit Charge 6", cat: "Wearables", price: 12999, oldPrice: 16999, badge: "NEW", emoji: "⌚", image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&h=500&fit=crop", rating: 4.5, reviews: 2341 },
  { id: 13, name: "USB-C Hub Pro", cat: "Accessories", price: 3499, oldPrice: 4999, badge: "", emoji: "🔌", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500&h=500&fit=crop", rating: 4.3, reviews: 1567 },
  { id: 14, name: "Canon EOS R6", cat: "Cameras", price: 189999, oldPrice: 219999, badge: "HOT", emoji: "📷", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop", rating: 4.9, reviews: 892 },
  { id: 15, name: "LG OLED 55\"", cat: "Displays", price: 149999, oldPrice: 179999, badge: "DEAL", emoji: "🖥️", image: "https://images.unsplash.com/photo-1593784697956-ec9c9bbd8dc9?w=500&h=500&fit=crop", rating: 4.8, reviews: 1234 },
  { id: 16, name: "JBL Flip 6", cat: "Audio", price: 8999, oldPrice: 11999, badge: "", emoji: "🔊", image: "https://images.unsplash.com/photo-1543515816-18c6837265ea?w=500&h=500&fit=crop", rating: 4.6, reviews: 2678 },
  { id: 17, name: "HP Spectre x360", cat: "Laptops", price: 149999, oldPrice: 179999, badge: "NEW", emoji: "💻", image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=500&h=500&fit=crop", rating: 4.7, reviews: 756 },
  { id: 18, name: "Garmin Fenix 7", cat: "Wearables", price: 64999, oldPrice: 74999, badge: "HOT", emoji: "⌚", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop", rating: 4.9, reviews: 1892 },
  { id: 19, name: "Wireless Charger Pad", cat: "Accessories", price: 1999, oldPrice: 2999, badge: "", emoji: "🔋", image: "https://images.unsplash.com/photo-1616169997363-2e3c3c0e0a7e?w=500&h=500&fit=crop", rating: 4.2, reviews: 3421 },
  { id: 20, name: "GoPro Hero 12", cat: "Cameras", price: 39999, oldPrice: 49999, badge: "DEAL", emoji: "📷", image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop", rating: 4.7, reviews: 2134 },
  { id: 21, name: "Samsung Odyssey G9", cat: "Displays", price: 99999, oldPrice: 129999, badge: "HOT", emoji: "🖥️", image: "https://images.unsplash.com/photo-1547082299-de196ea47f56?w=500&h=500&fit=crop", rating: 4.8, reviews: 567 },
  { id: 22, name: "Sennheiser Momentum", cat: "Audio", price: 24999, oldPrice: 29999, badge: "", emoji: "🎧", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", rating: 4.7, reviews: 1456 },
  { id: 23, name: "Lenovo ThinkPad X1", cat: "Laptops", price: 169999, oldPrice: 199999, badge: "NEW", emoji: "💻", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop", rating: 4.8, reviews: 892 },
  { id: 24, name: "Apple Watch Ultra 2", cat: "Wearables", price: 79999, oldPrice: 89999, badge: "HOT", emoji: "⌚", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop", rating: 4.9, reviews: 5678 },
  { id: 25, name: "Razer Blade Stealth", cat: "Accessories", price: 12999, oldPrice: 15999, badge: "DEAL", emoji: "🎮", image: "https://images.unsplash.com/photo-1593305841991-05c29736760b?w=500&h=500&fit=crop", rating: 4.5, reviews: 1234 },
  { id: 26, name: "Nikon Z8", cat: "Cameras", price: 279999, oldPrice: 319999, badge: "NEW", emoji: "📷", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop", rating: 4.9, reviews: 456 },
  { id: 27, name: "ASUS ROG Swift", cat: "Displays", price: 79999, oldPrice: 99999, badge: "", emoji: "🖥️", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop", rating: 4.7, reviews: 789 },
  { id: 28, name: "Bose QuietComfort", cat: "Audio", price: 22999, oldPrice: 27999, badge: "DEAL", emoji: "🎧", image: "https://images.unsplash.com/photo-1524678606372-987d7e66c99f?w=500&h=500&fit=crop", rating: 4.6, reviews: 2345 },
];

const CATEGORIES = ["All", "Audio", "Laptops", "Wearables", "Accessories", "Cameras", "Displays"];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "reviews", label: "Most Reviewed" },
];

export default function ShopPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filter products
  const filtered = PRODUCTS.filter((product) => {
    const matchCat = activeCategory === "All" || product.cat === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
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
    <div className="shop-root">
      {toast && <div className="shop-toast">{toast}</div>}

      {/* NAV */}
      <nav className="shop-nav">
        <div className="nav-logo" onClick={() => navigate("/")}>⚡ NEXUS</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link active">Shop</Link>
          <Link to="/deals" className="nav-link">Deals</Link>
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
      </nav>

      {/* HEADER */}
      <section className="shop-header">
        <div className="header-content">
          <h1>Shop All Products</h1>
          <p>Browse our complete collection of premium tech products</p>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="shop-controls">
        <div className="controls-left">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="results-count">{sorted.length} products found</div>
        </div>
        <div className="controls-right">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="shop-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* PRODUCTS GRID */}
      <section className="shop-products">
        {sorted.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
            <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>Clear Filters</button>
          </div>
        ) : (
          <div className="products-grid">
            {sorted.map((product, idx) => (
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

      {/* FOOTER */}
      <footer className="shop-footer">
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
