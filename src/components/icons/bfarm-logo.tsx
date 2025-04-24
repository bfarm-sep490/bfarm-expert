import React from "react";

export const BFarmLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle cx="12" cy="12" r="11" fill="url(#bfarm-logo-gradient)" />

    <path
      fill="#ffffff"
      d="M12 6C9 6 7 8 7 10.5c0 2 .9 3.5 2.5 4.5l-1.5 3.5 4-2.5 4 2.5-1.5-3.5c1.6-1 2.5-2.5 2.5-4.5C17 8 15 6 12 6zm0 3.2c1.1 0 2 .9 2 2 0 1-.9 1.8-2 1.8s-2-.8-2-1.8c0-1.1.9-2 2-2z"
    />

    {/* Gradient definition */}
    <defs>
      <linearGradient
        id="bfarm-logo-gradient"
        x1="12"
        y1="0"
        x2="12"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="50%" stopColor="#34A853" />
        <stop offset="100%" stopColor="#2196F3" />
      </linearGradient>
    </defs>
  </svg>
);

export const BFarmLogoText: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={120}
    height={24}
    viewBox="0 0 120 24"
    fill="none"
    {...props}
  >
    <text
      x="0"
      y="20"
      fontFamily="'Roboto', sans-serif"
      fontWeight="bold"
      fontSize="18"
      fill="url(#bfarm-text-gradient)"
    >
      BFX Expert
    </text>

    <defs>
      <linearGradient
        id="bfarm-text-gradient"
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="50%" stopColor="#34A853" />
        <stop offset="100%" stopColor="#2196F3" />
      </linearGradient>
    </defs>
  </svg>
);
