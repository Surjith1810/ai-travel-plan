import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-10 w-10" }) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Trip AI Planner Logo"
  >
    <defs>
      <linearGradient id="brand-gradient" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
        <stop offset="50%" stopColor="#9333EA" /> {/* Purple-600 */}
        <stop offset="100%" stopColor="#DB2777" /> {/* Pink-600 */}
      </linearGradient>
      <linearGradient id="brand-gradient-light" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#818CF8" /> 
        <stop offset="100%" stopColor="#F472B6" /> 
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Background Circle (Subtle) */}
    <circle cx="20" cy="20" r="18" stroke="url(#brand-gradient)" strokeOpacity="0.1" strokeWidth="1" />
    
    {/* Flight Path Swoosh */}
    <path 
      d="M10 28 C 10 28, 14 34, 22 34 C 30 34, 34 26, 34 18" 
      stroke="url(#brand-gradient-light)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeDasharray="0.5 4"
      opacity="0.8"
    />

    {/* The Stylized Plane */}
    <path 
      d="M6 18L34 6L22 32L17 21L6 18Z" 
      fill="url(#brand-gradient)" 
      stroke="white" 
      strokeWidth="2" 
      strokeLinejoin="round" 
      filter="url(#glow)"
    />
    
    {/* Inner detail of plane for depth */}
    <path 
      d="M17 21L34 6" 
      stroke="white" 
      strokeWidth="1.5" 
      strokeOpacity="0.5"
    />
  </svg>
);

export default Logo;