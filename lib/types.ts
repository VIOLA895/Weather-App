export interface WeatherData {
  name: string
  temp: number
  feels_like: number
  description: string
  humidity: number
  wind_speed: number
  weather_code: number
  dt: number
  sunrise: number
  sunset: number
  forecast: ForecastData[]
}

export interface ForecastData {
  day: string
  min_temp: number
  max_temp: number
  weather_code: number
  dt: number
}
