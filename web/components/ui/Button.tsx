import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'danger'
}

export default function Button({ variant = 'primary', className = '', children, ...rest }: Props) {
  const base = 'px-4 py-2 rounded-md font-semibold '
  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    outline: 'bg-white border border-gray-200 text-slate-900',
    danger: 'bg-danger text-white hover:opacity-95'
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
