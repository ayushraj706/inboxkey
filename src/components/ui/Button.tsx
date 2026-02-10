"use client";
import React from 'react';

interface ButtonProps {
  text: string;
  isLoading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export const Button = ({ text, isLoading, onClick, type = "button" }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className="relative flex items-center justify-center w-full py-3 px-6 font-bold text-white rounded-lg transition-all duration-300 
                 bg-metaGreen hover:bg-metaBlue active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-lg"
    >
      {isLoading ? (
        // यहाँ वह 'चकली' (Spinner) है जो Meta/GitHub पर दिखती है
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

