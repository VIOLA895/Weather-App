import type { WeatherData, ForecastData } from "./types"
import { getDayOfWeek } from "./utils"

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    // Use our server-side API route instead of direct API calls
    const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch weather data")
    }

    const data = await response.json()
    const currentData = data.current
    const forecastData = data.forecast

    // Process forecast data to get daily forecasts
    const dailyForecasts: ForecastData[] = processForecastData(forecastData.list)

    return {
      name: currentData.name,
      temp: currentData.main.temp,
      feels_like: currentData.main.feels_like,
      description: currentData.weather[0].description,
      humidity: currentData.main.humidity,
      wind_speed: currentData.wind.speed,
      weather_code: currentData.weather[0].id,
      dt: currentData.dt,
      sunrise: currentData.sys.sunrise,
      sunset: currentData.sys.sunset,
      forecast: dailyForecasts,
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    throw error
  }
}

function processForecastData(forecastList: any[]): ForecastData[] {
  const dailyData: { [key: string]: any } = {}

  // Group forecast data by day
  forecastList.forEach((item) => {
    const day = getDayOfWeek(item.dt)

    if (!dailyData[day]) {
      dailyData[day] = {
        temps: [],
        weather_codes: [],
        dt: item.dt,
      }
    }

    dailyData[day].temps.push(item.main.temp)
    dailyData[day].weather_codes.push(item.weather[0].id)
  })

  // Convert to array and calculate min/max temps
  return Object.keys(dailyData)
    .slice(0, 5)
    .map((day) => {
      const data = dailyData[day]
      const temps = data.temps

      // Get the most common weather code for the day
      const weatherCodeCounts: { [key: number]: number } = {}
      data.weather_codes.forEach((code: number) => {
        weatherCodeCounts[code] = (weatherCodeCounts[code] || 0) + 1
      })

      let mostCommonWeatherCode = data.weather_codes[0]
      let maxCount = 0

      Object.entries(weatherCodeCounts).forEach(([code, count]) => {
        if (count > maxCount) {
          mostCommonWeatherCode = Number.parseInt(code)
          maxCount = count as number
        }
      })

      return {
        day,
        min_temp: Math.min(...temps),
        max_temp: Math.max(...temps),
        weather_code: mostCommonWeatherCode,
        dt: data.dt,
      }
    })
}

// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}
