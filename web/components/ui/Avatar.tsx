import React from 'react'

type Props = {
  name?: string
  size?: number
}

export default function Avatar({ name = 'US', size = 32 }: Props) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold"
    >
      {initials}
    </div>
  )
}
