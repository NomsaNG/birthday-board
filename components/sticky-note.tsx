"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface StickyNoteProps {
  message: string
  senderName: string
  createdAt: string
  colorClass: string
}

export function StickyNote({ message, senderName, createdAt, colorClass }: StickyNoteProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card
      className={`
        ${colorClass}
        ${isHovered ? "scale-105 z-50" : ""}
        p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
        border-l-4 border-t-4 relative overflow-hidden w-full max-w-[180px]
        h-[160px] flex flex-col
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tape effect */}
      <div className="absolute -top-2 left-3 w-6 h-3 bg-yellow-300 opacity-60 rotate-45 rounded-sm"></div>

      {/* Note content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 mb-2 overflow-y-auto pr-1">
          <p className="text-gray-800 text-xs leading-relaxed font-handwriting break-words">{message}</p>
        </div>

        <div className="mt-auto">
          <div className="text-xs font-semibold text-gray-700 truncate mb-1">- {senderName}</div>
          <div className="text-xs text-gray-600 text-right">{formatTime(createdAt)}</div>
        </div>
      </div>

      {/* Shadow effect */}
      <div className="absolute inset-0 bg-black opacity-5 rounded-lg transform translate-x-1 translate-y-1 -z-10"></div>
    </Card>
  )
}