import React from 'react'

const Button = ({ children, variant = 'primary', disabled, onClick, className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    ghost: 'bg-transparent text-amber-600 hover:bg-amber-50 active:bg-amber-100',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} cursor-pointer`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button
