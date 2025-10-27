import React from 'react';

export const RestaurantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M1.5 21.75l1.5-1.5m18-18l-1.5 1.5M19.5 3.75l-1.5 1.5M4.5 19.5l1.5-1.5M10.875 3.75h2.25M10.875 19.5h2.25M3.375 12h17.25c.621 0 1.125-.504 1.125-1.125V10.125c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.75c0 .621.504 1.125 1.125 1.125z" 
    />
  </svg>
);
