import { useNavigate } from 'react-router-dom';
import './StaticPage.css';

export default function StaticPage({ type = 'shop' }) {
  const navigate = useNavigate();

  const shopSections = [
    { emoji: '🎧', title: 'Audio', desc: 'Headphones, Earbuds, Speakers', link: '/shop?category=Audio' },
    { emoji: '💻', title: 'Laptops', desc: 'Gaming, Business, Ultrabooks', link: '/shop?category=Laptops' },
    { emoji: '⌚', title: 'Wearables', desc: 'Smartwatches, Fitness Bands', link: '/shop?category=Wearables' },
    { emoji: '📷', title: 'Cameras', desc: 'DSLR, Mirrorless, Action Cams', link: '/shop?category=Cameras' },
    { emoji: '🖥️', title: 'Displays', desc: 'Monitors, TVs, Projectors', link: '/shop?category=Displays' },
    { emoji: '🔌', title: 'Accessories', desc: 'Cables, Chargers, Cases', link: '/shop?category=Accessories' },
  ];

  const supportItems = [
    { emoji: '📦', title: 'Track Order', desc: 'Real-time order tracking', link: '/shop?status=tracking' },
    { emoji: '🔄', title: 'Returns', desc: 'Easy return policy', link: '/support#returns' },
    { emoji: '❓', title: 'FAQs', desc: 'Common questions answered', link: '/support#faqs' },
    { emoji: '📞', title: 'Contact Us', desc: '24/7 customer support', link: '/support#contact' },
    { emoji: '💬', title: 'Live Chat', desc: 'Chat with our team', link: '/support#chat' },
    { emoji: '📧', title: 'Email Support', desc: 'support@nexus.com', action: () => window.location.href = 'mailto:support@nexus.com' },
  ];

  const companyItems = [
    { emoji: '🏢', title: 'About Us', desc: 'Our story and mission', link: '/about' },
    { emoji: '💼', title: 'Careers', desc: 'Join our team', link: '/careers' },
    { emoji: '📰', title: 'Blog', desc: 'Latest news & updates', link: '/blog' },
    { emoji: '📺', title: 'Press', desc: 'Media coverage', link: '/press' },
    { emoji: '🤝', title: 'Partners', desc: 'Our brand partners', link: '/partners' },
    { emoji: '📍', title: 'Stores', desc: 'Visit our outlets', link: '/stores' },
  ];

  const renderContent = () => {
    if (type === 'shop') {
      return (
        <div className="static-grid">
          {shopSections.map((item) => (
            <div 
              key={item.title} 
              className="category-card"
              onClick={() => navigate(item.link)}
            >
              <div className="cat-emoji">{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button className="cat-btn">Shop Now →</button>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'support') {
      return (
        <div className="static-grid">
          {supportItems.map((item) => (
            <div 
              key={item.title} 
              className="support-card"
              onClick={() => item.link ? navigate(item.link) : item.action()}
            >
              <div className="support-emoji">{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      );
    }

    if (type === 'company') {
      return (
        <div className="static-grid">
          {companyItems.map((item) => (
            <div 
              key={item.title} 
              className="company-card"
              onClick={() => navigate(item.link)}
            >
              <div className="company-emoji">{item.emoji}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const getTitle = () => {
    if (type === 'shop') return 'Shop by Category';
    if (type === 'support') return 'How Can We Help?';
    if (type === 'company') return 'About Nexus';
    return '';
  };

  const getSubtitle = () => {
    if (type === 'shop') return 'Explore our premium collection';
    if (type === 'support') return 'We\'re here to assist you';
    if (type === 'company') return 'Building the future of shopping';
    return '';
  };

  return (
    <div className="static-page">
      {/* Background Prism Effect */}
      <div className="prism-bg">
        <div className="strip-strip"></div>
        <div className="strip-strip"></div>
        <div className="strip-strip"></div>
        <div className="strip-dot"></div>
        <div className="strip-dot"></div>
        <div className="strip-dot"></div>
      </div>

      <div className="static-container">
        {/* Header */}
        <div className="static-header">
          <h1 className="static-title">{getTitle()}</h1>
          <p className="static-subtitle">{getSubtitle()}</p>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Back Button */}
        <div className="static-back">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
