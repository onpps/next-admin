'use client';
import React from 'react';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
};

export const Button = ({ label, onClick, type = 'button', variant = 'primary' }: ButtonProps) => {
  const baseStyle = 'px-4 py-2 rounded text-white text-sm font-semibold transition';
  const variantStyle = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle[variant]}`}
    >
      {label}
    </button>
  );
};

export default Button;
