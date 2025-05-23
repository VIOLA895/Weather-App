"use client"

import { motion } from "framer-motion"
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun, Wind } from "lucide-react"

interface WeatherIconProps {
  weatherCode: number
  size?: number
}

export default function WeatherIcon({ weatherCode, size = 24 }: WeatherIconProps) {
  // Map weather codes to icons and animations
  // Based on OpenWeatherMap API weather condition codes
  // https://openweathermap.org/weather-conditions

  const getWeatherIcon = () => {
    // Clear
    if (weatherCode >= 800 && weatherCode <= 801) {
      return (
        <motion.div
          animate={{
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 5,
          }}
        >
          <Sun size={size} className="text-yellow-300" />
        </motion.div>
      )
    }

    // Few clouds
    if (weatherCode === 802) {
      return (
        <motion.div
          animate={{
            x: [0, 5, 0, -5, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 4,
          }}
        >
          <CloudSun size={size} className="text-white" />
        </motion.div>
      )
    }

    // Clouds
    if (weatherCode >= 803 && weatherCode <= 804) {
      return (
        <motion.div
          animate={{
            x: [0, 5, 0, -5, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 4,
          }}
        >
          <Cloud size={size} className="text-white" />
        </motion.div>
      )
    }

    // Thunderstorm
    if (weatherCode >= 200 && weatherCode < 300) {
      return (
        <motion.div
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 0.5,
            repeatDelay: 1,
          }}
        >
          <CloudLightning size={size} className="text-yellow-300" />
        </motion.div>
      )
    }

    // Drizzle
    if (weatherCode >= 300 && weatherCode < 400) {
      return (
        <motion.div
          animate={{
            y: [0, 2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 1,
          }}
        >
          <CloudDrizzle size={size} className="text-blue-300" />
        </motion.div>
      )
    }

    // Rain
    if (weatherCode >= 500 && weatherCode < 600) {
      return (
        <motion.div
          animate={{
            y: [0, 2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 0.8,
          }}
        >
          <CloudRain size={size} className="text-blue-400" />
        </motion.div>
      )
    }

    // Snow
    if (weatherCode >= 600 && weatherCode < 700) {
      return (
        <motion.div
          animate={{
            rotate: [0, 10, 0, -10, 0],
            y: [0, 2, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 2,
          }}
        >
          <CloudSnow size={size} className="text-blue-100" />
        </motion.div>
      )
    }

    // Fog, Mist, etc.
    if (weatherCode >= 700 && weatherCode < 800) {
      return (
        <motion.div
          animate={{
            opacity: [1, 0.7, 1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 2,
          }}
        >
          <CloudFog size={size} className="text-gray-300" />
        </motion.div>
      )
    }

    // Default
    return <Wind size={size} className="text-white" />
  }

  return getWeatherIcon()
}
