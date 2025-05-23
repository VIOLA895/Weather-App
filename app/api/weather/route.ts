import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location")

  if (!location) {
    return NextResponse.json({ error: "Location parameter is required" }, { status: 400 })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    let currentWeatherUrl
    let forecastUrl

    // Check if location contains lat/lon coordinates
    if (location.includes("lat=") && location.includes("lon=")) {
      // It's a coordinate query
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?${location}&units=metric&appid=${apiKey}`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${location}&units=metric&appid=${apiKey}`
    } else {
      // It's a city name query
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
    }

    // Current weather
    const currentResponse = await fetch(currentWeatherUrl)

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json()
      return NextResponse.json(
        {
          error: `Weather API error: ${errorData.message || "Unknown error"}`,
        },
        { status: currentResponse.status },
      )
    }

    const currentData = await currentResponse.json()

    // 5-day forecast
    const forecastResponse = await fetch(forecastUrl)

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json()
      return NextResponse.json(
        {
          error: `Forecast API error: ${errorData.message || "Unknown error"}`,
        },
        { status: forecastResponse.status },
      )
    }

    const forecastData = await forecastResponse.json()

    return NextResponse.json({
      current: currentData,
      forecast: forecastData,
    })
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
