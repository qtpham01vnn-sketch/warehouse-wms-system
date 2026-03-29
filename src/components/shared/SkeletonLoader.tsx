import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'table-row' | 'avatar';
  count?: number;
  width?: string;
  height?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  type = 'text', 
  count = 1,
  width,
  height
}) => {
  const getStyle = () => {
    switch (type) {
      case 'text': return { width: width || '100%', height: height || '20px', borderRadius: '4px' };
      case 'card': return { width: width || '100%', height: height || '150px', borderRadius: 'var(--radius-card)' };
      case 'table-row': return { width: width || '100%', height: height || '60px', borderRadius: '8px' };
      case 'avatar': return { width: width || '40px', height: height || '40px', borderRadius: '50%' };
      default: return {};
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={idx} 
          className={`skeleton skeleton-${type}`} 
          style={{ ...getStyle(), marginBottom: count > 1 ? '12px' : 0 }}
        />
      ))}
    </>
  );
};
