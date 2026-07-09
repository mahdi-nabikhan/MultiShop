// components/SectionHeading.tsx
import React from 'react';
import './SectionHeader.css'

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  showLine?: boolean;
  lineColor?: string;
}

const SectionHeader:React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = 'left',
  showLine = true,
  lineColor = '#2563eb',
}) => {
  return (
    <div className={`section-heading align-${align}`}>
      <div className="heading-header">
        {showLine && align === 'left' && (
          <span 
            className="line line-vertical"
            style={{ backgroundColor: lineColor }}
          ></span>
        )}
        
        <h2 className="heading-title">{title}</h2>
        
        {showLine && align === 'right' && (
          <span 
            className="line line-vertical"
            style={{ backgroundColor: lineColor }}
          ></span>
        )}
      </div>

      {showLine && align === 'center' && (
        <span 
          className="line line-horizontal"
          style={{ backgroundColor: lineColor }}
        ></span>
      )}

      {subtitle && <p className="heading-subtitle">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;