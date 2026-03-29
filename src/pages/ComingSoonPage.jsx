import { useNavigate } from 'react-router-dom';
import './StaticPage.css';

export default function ComingSoonPage({ type = 'careers' }) {
  const navigate = useNavigate();

  const content = {
    careers: {
      title: 'Join Our Team',
      subtitle: 'Build the future of e-commerce with us',
      description: 'We\'re always looking for talented individuals to join our growing team. Explore opportunities and become part of something extraordinary!',
      emoji: '💼',
      features: [
        { name: 'Competitive Salary', icon: '💰', link: '/careers#salary' },
        { name: 'Remote Friendly', icon: '🏠', link: '/careers#remote' },
        { name: 'Health Benefits', icon: '🏥', link: '/careers#benefits' },
        { name: 'Growth Opportunities', icon: '📈', link: '/careers#growth' },
        { name: 'Innovative Environment', icon: '💡', link: '/careers#culture' },
        { name: 'Work-Life Balance', icon: '⚖️', link: '/careers#balance' }
      ]
    },
    blog: {
      title: 'Nexus Blog',
      subtitle: 'Latest news, updates & insights',
      description: 'Explore product reviews, tech trends, shopping guides, and exclusive stories from the world of premium electronics.',
      emoji: '📰',
      features: [
        { name: 'Product Reviews', icon: '⭐', link: '/blog#reviews' },
        { name: 'Tech Trends', icon: '🚀', link: '/blog#trends' },
        { name: 'Shopping Guides', icon: '🛍️', link: '/blog#guides' },
        { name: 'Industry News', icon: '📰', link: '/blog#news' },
        { name: 'Tips & Tricks', icon: '💡', link: '/blog#tips' },
        { name: 'Exclusive Deals', icon: '🎁', link: '/deals' }
      ]
    },
    press: {
      title: 'Press & Media',
      subtitle: 'Nexus in the spotlight',
      description: 'Discover our journey, milestones, and achievements as we revolutionize e-commerce across India.',
      emoji: '📺',
      features: [
        { name: 'Press Releases', icon: '📢', link: '/press#releases' },
        { name: 'Media Coverage', icon: '📺', link: '/press#coverage' },
        { name: 'Company News', icon: '🏢', link: '/press#news' },
        { name: 'Awards', icon: '🏆', link: '/press#awards' },
        { name: 'Events', icon: '🎪', link: '/press#events' },
        { name: 'Brand Story', icon: '📖', link: '/press#story' }
      ]
    },
    partners: {
      title: 'Our Partners',
      subtitle: 'Trusted by leading brands',
      description: 'We partner with the world\'s most innovative technology and lifestyle brands to deliver excellence.',
      emoji: '🤝',
      features: [
        { name: 'Official Retailer', icon: '✓', link: '/partners#retailer' },
        { name: 'Authorized Dealer', icon: '📜', link: '/partners#dealer' },
        { name: 'Collaborations', icon: '🤝', link: '/partners#collab' },
        { name: 'Exclusive Launches', icon: '🎉', link: '/shop?category=New' },
        { name: 'Partner Network', icon: '🌐', link: '/partners#network' },
        { name: 'B2B Solutions', icon: '💼', link: '/partners#b2b' }
      ]
    },
    stores: {
      title: 'Store Locator',
      subtitle: 'Visit Nexus experience centers',
      description: 'Experience our premium products firsthand at Nexus stores across India. Find a store near you!',
      emoji: '📍',
      features: [
        { name: 'Experience Centers', icon: '🏬', link: '/stores#centers' },
        { name: 'Product Demos', icon: '🎮', link: '/stores#demos' },
        { name: 'Expert Staff', icon: '👨‍💼', link: '/stores#experts' },
        { name: 'Shop Now', icon: '🛒', link: '/shop' },
        { name: 'Support', icon: '🔧', link: '/support' },
        { name: 'In-Store Deals', icon: '💰', link: '/deals' }
      ]
    }
  };

  const page = content[type] || content.careers;

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
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>{page.emoji}</div>
          <h1 className="static-title">{page.title}</h1>
          <p className="static-subtitle">{page.subtitle}</p>
        </div>

        {/* Description Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '50px 40px',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 50px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.8',
            marginBottom: '40px'
          }}>
            {page.description}
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '25px',
            marginTop: '30px'
          }}>
            {page.features.map((feature, index) => (
              <div
                key={index}
                onClick={() => {
                  if (feature.link) {
                    navigate(feature.link);
                  } else {
                    alert(`Explore ${feature.name} - Coming Soon!`);
                  }
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '25px 20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: '12px',
                  transition: 'transform 0.3s ease'
                }}>
                  {feature.icon || '✦'}
                </div>
                <h3 style={{
                  fontSize: '1rem',
                  color: '#fff',
                  fontWeight: '600',
                  margin: '0'
                }}>
                  {feature.name}
                </h3>
                <div style={{
                  marginTop: '10px',
                  fontSize: '0.85rem',
                  color: '#667eea',
                  fontWeight: '600'
                }}>
                  Explore →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => alert(`Thank you for your interest in ${page.title}! We'll launch this section soon.`)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              padding: '18px 50px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginRight: '15px',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }}
          >
            🔔 Notify Me When Live
          </button>
          
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.8)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '16px 48px',
              borderRadius: '14px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            ← Back to Home
          </button>
        </div>

        {/* Quick Navigation */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '40px',
          marginTop: '50px'
        }}>
          <h3 style={{
            color: '#fff',
            fontSize: '1.3rem',
            marginBottom: '25px',
            textAlign: 'center'
          }}>Explore More</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate('/shop')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🛍️ Shop Now
            </button>
            <button
              onClick={() => navigate('/deals')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              🔥 Deals
            </button>
            <button
              onClick={() => navigate('/support')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ❓ Support
            </button>
            <button
              onClick={() => navigate('/about')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.3)';
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ℹ️ About Us
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '1rem',
          marginTop: '30px',
          marginBottom: '20px'
        }}>
          <p>Have questions? Reach out to us at{' '}
            <a 
              href="mailto:hello@nexus.com" 
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600'
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = 'mailto:hello@nexus.com';
              }}
            >
              hello@nexus.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
