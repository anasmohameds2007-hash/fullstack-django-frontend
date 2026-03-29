import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from '../utils/auth';
import Avatar from '../components/Avatar';
import "./AboutPage.css";

export default function AboutPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const values = [
    { icon: "🎯", title: "Innovation First", desc: "Cutting-edge technology and latest gadgets" },
    { icon: "💰", title: "Best Prices", desc: "Competitive pricing with regular discounts" },
    { icon: "🚀", title: "Fast Delivery", desc: "Quick shipping to your doorstep" },
    { icon: "❤️", title: "Customer Love", desc: "Support team available 24/7" },
  ];

  const milestones = [
    { year: "2020", event: "NEXUS Founded" },
    { year: "2021", event: "Reached 100K Users" },
    { year: "2022", event: "Expanded to 50+ Categories" },
    { year: "2024", event: "2M+ Happy Customers" },
  ];

  const team = [
    { name: "Anas Mohamed", role: "CEO & Founder", emoji: "👨‍💼" },
    { name: "Shek Irfan", role: "COO", emoji: "👩‍💼" },
    { name: "Hussain Sherief", role: "CTO", emoji: "👨‍💻" },
    { name: "Dharmalingam", role: "Head of Operations", emoji: "�‍💼" },
  ];

  return (
    <div className="about-root">
      {/* NAVBAR */}
      <nav className="about-nav">
        <div className="nav-logo" onClick={() => navigate("/")}>⚡ NEXUS</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/deals" className="nav-link">Deals</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          <Link to="/about" className="nav-link active">About</Link>
        </div>
        <button className="nav-profile" onClick={handleProfileClick}>
          {user ? (
            <Avatar 
              name={user.name} 
              size="medium"
              showTooltip={true}
            />
          ) : (
            'Sign In'
          )}
        </button>
      </nav>

      {/* HERO */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">About NEXUS</h1>
          <p className="hero-subtitle">Your Premium Tech Shopping Destination</p>
          <p className="hero-desc">
            Revolutionizing the way you shop for cutting-edge technology and premium gadgets.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="about-section story-section">
        <div className="section-inner">
          <div className="story-left">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, NEXUS was born from a simple vision: make premium technology accessible to everyone. 
              We started as a small team passionate about gadgets and customer service, and today we've grown into 
              a trusted platform serving millions of customers worldwide.
            </p>
            <p>
              Every product on NEXUS is carefully curated to ensure quality, authenticity, and value. We work directly 
              with manufacturers and authorized distributors to bring you the latest innovations at the best prices.
            </p>
            <p>
              Our mission is simple yet powerful: deliver excellence in every interaction, every product, and every 
              customer experience.
            </p>
          </div>
          <div className="story-stats">
            <div className="stat-box">
              <div className="stat-num">2M+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">50K+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">4.9★</div>
              <div className="stat-label">Rating</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">24/7</div>
              <div className="stat-label">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="about-section values-section">
        <h2 className="section-title">Our Core Values</h2>
        <div className="values-grid">
          {values.map((v) => (
            <div key={v.title} className="value-card">
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MILESTONES */}
      <section className="about-section milestones-section">
        <h2 className="section-title">Our Journey</h2>
        <div className="timeline">
          {milestones.map((m, idx) => (
            <div key={m.year} className="milestone">
              <div className="milestone-dot" />
              <div className="milestone-content">
                <div className="milestone-year">{m.year}</div>
                <div className="milestone-event">{m.event}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="about-section team-section">
        <h2 className="section-title">Leadership Team</h2>
        <div className="team-grid">
          {team.map((member) => (
            <div key={member.name} className="team-card">
              <div className="team-emoji">{member.emoji}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-section why-us-section">
        <h2 className="section-title">Why Choose NEXUS?</h2>
        <div className="why-us-grid">
          <div className="why-card">
            <span className="why-number">01</span>
            <h3>Authentic Products</h3>
            <p>100% genuine products directly from authorized dealers with warranty support.</p>
          </div>
          <div className="why-card">
            <span className="why-number">02</span>
            <h3>Competitive Pricing</h3>
            <p>Best prices with regular discounts, flash sales, and EMI options available.</p>
          </div>
          <div className="why-card">
            <span className="why-number">03</span>
            <h3>Fast Shipping</h3>
            <p>Free shipping on orders above ₹999 with express delivery options.</p>
          </div>
          <div className="why-card">
            <span className="why-number">04</span>
            <h3>Easy Returns</h3>
            <p>30-day return policy with full refund, no questions asked.</p>
          </div>
          <div className="why-card">
            <span className="why-number">05</span>
            <h3>Expert Support</h3>
            <p>Dedicated support team available 24/7 via chat, email, or phone.</p>
          </div>
          <div className="why-card">
            <span className="why-number">06</span>
            <h3>Secure Payments</h3>
            <p>Multiple payment options with bank-level security encryption.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="about-section contact-section">
        <div className="contact-inner">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you. Reach out to us anytime.</p>
          <div className="contact-grid">
            <div className="contact-box">
              <div className="contact-icon">📧</div>
              <h3>Email</h3>
              <p>support@nexus.com</p>
            </div>
            <div className="contact-box">
              <div className="contact-icon">📞</div>
              <h3>Phone</h3>
              <p>1-800-NEXUS-24</p>
            </div>
            <div className="contact-box">
              <div className="contact-icon">📍</div>
              <h3>Address</h3>
              <p>Tech Hub, Mumbai, India</p>
            </div>
            <div className="contact-box">
              <div className="contact-icon">⏰</div>
              <h3>Hours</h3>
              <p>24/7 Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="about-cta">
        <h2>Ready to Start Shopping?</h2>
        <p>Explore our premium collection of tech products</p>
        <div className="cta-buttons">
          <button className="cta-primary" onClick={() => navigate("/")}>Browse Products →</button>
          {!user && (
            <button className="cta-secondary" onClick={() => navigate("/login")}>Sign In</button>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="about-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>⚡ NEXUS</h3>
            <p>Your premium tech shopping destination</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => navigate("/shop")} className="footer-link">Shop</button></li>
              <li><button onClick={() => navigate("/deals")} className="footer-link">Deals</button></li>
              <li><button onClick={() => navigate("/categories")} className="footer-link">Categories</button></li>
              <li><button onClick={() => navigate("/about")} className="footer-link">About</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Policies</h4>
            <ul>
              <li><button onClick={() => {}} className="footer-link">Privacy Policy</button></li>
              <li><button onClick={() => {}} className="footer-link">Terms & Conditions</button></li>
              <li><button onClick={() => {}} className="footer-link">Return Policy</button></li>
              <li><button onClick={() => {}} className="footer-link">Shipping Info</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <button onClick={() => {}} className="footer-link">Facebook</button>
              <button onClick={() => {}} className="footer-link">Twitter</button>
              <button onClick={() => {}} className="footer-link">Instagram</button>
              <button onClick={() => {}} className="footer-link">LinkedIn</button>
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
