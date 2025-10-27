import React from 'react';

export const HotelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75v.75h-.75V6.75zm.75 2.25h.75v.75h-.75V9zm-.75 2.25h.75v.75h-.75v-.75zm2.25-4.5h.75v.75h-.75V6.75zm.75 2.25h.75v.75h-.75V9zm-.75 2.25h.75v.75h-.75v-.75zm2.25-4.5h.75v.75h-.75V6.75zm.75 2.25h.75v.75h-.75V9zm-.75 2.25h.75v.75h-.75v-.75z" 
    />
  </svg>
);
