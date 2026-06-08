import React from 'react';

const Logo = ({ size = 'md', theme = 'dark' }) => {
  const scales = { sm: 28, md: 36, lg: 44 };
  const px = scales[size] || 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';
  const textColor = theme === 'light' ? 'text-fz-dark' : 'text-white';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={px} height={px} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#00C853" />
        <path d="M27 5L11 23H22L18 39L34 21H23L27 5Z" fill="white" />
      </svg>
      <span className={`font-display font-black uppercase leading-none ${textSize} ${textColor}`}>
        Foot<span className="text-fz-green">Zone</span>
      </span>
    </div>
  );
};

export default Logo;
