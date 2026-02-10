"use client";
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export default function Button({ children, isLoading, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyles = "w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#00a884] hover:bg-[#008f6f] text-white",
    outline: "border border-gray-600 hover:bg-gray-800 text-gray-300"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
