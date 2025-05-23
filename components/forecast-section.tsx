"use client"

import { motion } from "framer-motion"
import type { ForecastData } from "@/lib/types"
import WeatherIcon from "./weather-icon"
import { celsiusToFahrenheit } from "@/lib/weather"

interface ForecastSectionProps {
  forecast: ForecastData[]
  unit: "celsius" | "fahrenheit"
}

export default function ForecastSection({ forecast, unit }: ForecastSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  const getTemp = (temp: number) => {
    return unit === "celsius" ? temp : celsiusToFahrenheit(temp)
  }

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">5-Day Forecast</h2>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {forecast.map((day, index) => (
          <motion.div
            key={index}
            variants={item}
            className="bg-white/30 rounded-lg p-4 text-center hover:bg-white/40 transition-colors"
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
          >
            <div className="text-white font-medium mb-2">{day.day}</div>
            <div className="flex justify-center">
              <WeatherIcon weatherCode={day.weather_code} size={40} />
            </div>
            <div className="mt-2 text-white font-bold">{Math.round(getTemp(day.max_temp))}°</div>
            <div className="text-white/80 text-sm">{Math.round(getTemp(day.min_temp))}°</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
