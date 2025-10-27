import React from 'react';

export const TrekkingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M6 20.25h12m-7.5-3.75v-6m3.75 6v-3.75m0-6V11.25m-3.75 0V7.5m-3.75 0V11.25m0 0V7.5m0 0V3.75m3.75 0V7.5m0 0V3.75m0 0h3.75M9.75 3.75H6m12 16.5h.008v.008H18v-.008zm-3.002 0h.008v.008h-.008v-.008z" 
    />
  </svg>
);
