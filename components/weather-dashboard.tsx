"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import WeatherCard from "./weather-card"
import ForecastSection from "./forecast-section"
import WeatherBackground from "./weather-background"
import UnitToggle from "./unit-toggle"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getWeatherData } from "@/lib/weather"
import type { WeatherData } from "@/lib/types"

export default function WeatherDashboard() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentLocation, setCurrentLocation] = useState("")
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius")

  // Fetch weather for default location on load
  useEffect(() => {
    fetchWeatherForLocation("New York")
  }, [])

  // Update the fetchWeatherForLocation function to handle coordinates better
  const fetchWeatherForLocation = async (location: string) => {
    setLoading(true)
    setError("")
    try {
      const data = await getWeatherData(location)
      setWeatherData(data)
      setCurrentLocation(data.name)
      setLoading(false)
    } catch (err: any) {
      console.error("Error fetching weather:", err)
      setError(err.message || "Could not fetch weather data. Please try another location.")
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      fetchWeatherForLocation(city)
      setCity("")
    }
  }

  // Update the handleGetCurrentLocation function
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            // Use lat,lon format for the location parameter
            const data = await getWeatherData(`lat=${latitude}&lon=${longitude}`)
            setWeatherData(data)
            setCurrentLocation(data.name)
            setLoading(false)
          } catch (err: any) {
            console.error("Error fetching weather:", err)
            setError(err.message || "Could not fetch weather data for your location.")
            setLoading(false)
          }
        },
        (err) => {
          console.error("Geolocation error:", err)
          setError("Could not get your current location. Please try searching for a city instead.")
          setLoading(false)
        },
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  const handleUnitToggle = (newUnit: "celsius" | "fahrenheit") => {
    setUnit(newUnit)
  }

  // Determine if it's day or night for the background
  const isDay = weatherData
    ? weatherData.dt * 1000 > weatherData.sunrise * 1000 && weatherData.dt * 1000 < weatherData.sunset * 1000
    : true

  return (
    <div className="max-w-4xl mx-auto relative z-10">
      {weatherData && <WeatherBackground weatherCode={weatherData.weather_code} isDay={isDay} />}

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Weather Wonderland</h1>
        <p className="text-white/80 text-lg">Discover the weather with delightful animations!</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/20 backdrop-blur-lg rounded-xl p-4 mb-8 shadow-lg"
      >
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-white/50 border-none focus-visible:ring-2 focus-visible:ring-white"
          />
          <Button type="submit" variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
            <Search className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            className="bg-transparent border-white text-white hover:bg-white/20"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </form>
      </motion.div>

      {weatherData && <UnitToggle onToggle={handleUnitToggle} currentUnit={unit} />}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/80 text-white p-4 rounded-lg mb-6"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </motion.div>
        ) : weatherData ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <WeatherCard weatherData={weatherData} location={currentLocation} unit={unit} />
            <ForecastSection forecast={weatherData.forecast} unit={unit} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
