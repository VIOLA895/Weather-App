"use client"

import { motion } from "framer-motion"
import type { WeatherData } from "@/lib/types"
import WeatherIcon from "./weather-icon"
import SunTimes from "./sun-times"
import { formatDate } from "@/lib/utils"
import { celsiusToFahrenheit } from "@/lib/weather"

interface WeatherCardProps {
  weatherData: WeatherData
  location: string
  unit: "celsius" | "fahrenheit"
}

export default function WeatherCard({ weatherData, location, unit }: WeatherCardProps) {
  const { temp, feels_like, description, humidity, wind_speed, weather_code, dt, sunrise, sunset } = weatherData

  // Convert temperature if needed
  const displayTemp = unit === "celsius" ? temp : celsiusToFahrenheit(temp)
  const displayFeelsLike = unit === "celsius" ? feels_like : celsiusToFahrenheit(feels_like)

  // Determine if it's day or night
  const currentTime = dt * 1000
  const isDay = currentTime > sunrise * 1000 && currentTime < sunset * 1000

  // Determine background gradient based on temperature
  const getBgGradient = () => {
    if (temp >= 30) return "from-orange-400 to-red-500" // Hot
    if (temp >= 20) return "from-yellow-300 to-orange-400" // Warm
    if (temp >= 10) return "from-blue-300 to-green-400" // Mild
    if (temp >= 0) return "from-blue-400 to-blue-500" // Cool
    return "from-blue-600 to-blue-800" // Cold
  }

  return (
    <motion.div
      className={`bg-gradient-to-br ${getBgGradient()} rounded-2xl overflow-hidden shadow-xl mb-8`}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{location}</h2>
            <p className="text-white/80">{formatDate(dt)}</p>
          </div>
          <motion.div
            initial={{ rotate: -10, y: -20 }}
            animate={{ rotate: 0, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="text-right"
          >
            <div className="text-5xl font-bold">
              {Math.round(displayTemp)}°{unit === "celsius" ? "C" : "F"}
            </div>
            <div className="text-white/80">
              Feels like {Math.round(displayFeelsLike)}°{unit === "celsius" ? "C" : "F"}
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex items-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
            className="mr-4"
          >
            <WeatherIcon weatherCode={weather_code} size={80} />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold capitalize">{description}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="text-white/80">Humidity: {humidity}%</div>
              <div className="text-white/80">Wind: {wind_speed} m/s</div>
            </div>
          </div>
        </div>

        <SunTimes sunrise={sunrise} sunset={sunset} />
      </div>
    </motion.div>
  )
}
