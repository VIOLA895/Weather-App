"use client"

import { motion } from "framer-motion"
import { Sunrise, Sunset } from "lucide-react"

interface SunTimesProps {
  sunrise: number
  sunset: number
}

export default function SunTimes({ sunrise, sunset }: SunTimesProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/20 backdrop-blur-md rounded-xl p-4 mt-4 flex justify-between"
    >
      <div className="flex items-center">
        <motion.div
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mr-2 text-yellow-300"
        >
          <Sunrise size={24} />
        </motion.div>
        <div>
          <div className="text-xs text-white/70">Sunrise</div>
          <div className="text-white font-medium">{formatTime(sunrise)}</div>
        </div>
      </div>

      <div className="flex items-center">
        <motion.div
          initial={{ rotate: 20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mr-2 text-orange-300"
        >
          <Sunset size={24} />
        </motion.div>
        <div>
          <div className="text-xs text-white/70">Sunset</div>
          <div className="text-white font-medium">{formatTime(sunset)}</div>
        </div>
      </div>
    </motion.div>
  )
}
