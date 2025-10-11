import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const cardClass = `card ${className}`.trim();
  
  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
};

export default Card;