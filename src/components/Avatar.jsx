import React from 'react';
import './Avatar.css';

/**
 * Avatar Component
 * Displays user's first initial in a circular badge with interactive hover effects
 */
export default function Avatar({ 
  name, 
  size = 'medium', 
  onClick,
  showTooltip = true 
}) {
  // Get first letter of name (uppercase)
  const getInitial = () => {
    if (!name) return '?';
    const firstName = name.split(' ')[0];
    return firstName.charAt(0).toUpperCase();
  };

  // Generate consistent color based on name
  const getColorClass = () => {
    const initials = getInitial();
    const colors = [
      'avatar-red',
      'avatar-blue',
      'avatar-green',
      'avatar-purple',
      'avatar-orange',
      'avatar-pink',
      'avatar-teal',
      'avatar-indigo'
    ];
    
    // Use char code to pick consistent color
    const index = initials.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const initial = getInitial();
  const colorClass = getColorClass();

  return (
    <div 
      className={`avatar-container ${colorClass} avatar-${size} ${onClick ? 'avatar-clickable' : ''}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={showTooltip ? name : undefined}
    >
      <span className="avatar-initial">{initial}</span>
      
      {/* Optional status indicator - can be used for online/offline */}
      <span className="avatar-status"></span>
    </div>
  );
}

// Avatar sizes
Avatar.defaultProps = {
  size: 'medium', // small, medium, large
  showTooltip: true
};
