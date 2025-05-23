"use client"

import { useEffect, useRef } from "react"

interface WeatherBackgroundProps {
  weatherCode: number
  isDay: boolean
}

export default function WeatherBackground({ weatherCode, isDay }: WeatherBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Weather code groups:
  // 2xx: Thunderstorm
  // 3xx: Drizzle
  // 5xx: Rain
  // 6xx: Snow
  // 7xx: Atmosphere (fog, mist, etc.)
  // 800: Clear
  // 80x: Clouds

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Clear any previous animations
    let animationFrame: number
    const clearAnimation = () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }

    // Initialize particles array
    let particles: any[] = []

    // Create particles based on weather
    const createParticles = () => {
      particles = []

      // Number of particles based on weather
      let count = 0

      if (weatherCode >= 200 && weatherCode < 300) {
        // Thunderstorm - fewer raindrops + lightning
        count = 50
      } else if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
        // Rain or drizzle
        count = 100
      } else if (weatherCode >= 600 && weatherCode < 700) {
        // Snow
        count = 80
      } else if (weatherCode === 800) {
        // Clear sky - sun rays or stars
        count = 30
      } else if (weatherCode > 800) {
        // Clouds - floating cloud particles
        count = 20
      }

      for (let i = 0; i < count; i++) {
        particles.push(createParticle())
      }
    }

    // Create a single particle with properties based on weather
    const createParticle = () => {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 5 + 1
      const speed = Math.random() * 3 + 1

      // Different particle properties based on weather
      if (weatherCode >= 200 && weatherCode < 300) {
        // Thunderstorm - raindrops
        return {
          x,
          y,
          size,
          speed: speed * 2,
          color: "rgba(120, 120, 255, 0.8)",
          type: "rain",
        }
      } else if ((weatherCode >= 300 && weatherCode < 400) || (weatherCode >= 500 && weatherCode < 600)) {
        // Rain or drizzle
        return {
          x,
          y,
          size: size * 0.8,
          speed,
          color: "rgba(200, 200, 255, 0.6)",
          type: "rain",
        }
      } else if (weatherCode >= 600 && weatherCode < 700) {
        // Snow
        return {
          x,
          y,
          size: size * 1.5,
          speed: speed * 0.5,
          color: "rgba(255, 255, 255, 0.8)",
          type: "snow",
        }
      } else if (weatherCode === 800) {
        // Clear sky - sun rays or stars
        return {
          x,
          y,
          size: isDay ? size * 2 : size * 0.5,
          speed: speed * 0.2,
          color: isDay ? "rgba(255, 255, 150, 0.3)" : "rgba(255, 255, 255, 0.8)",
          type: isDay ? "sunray" : "star",
        }
      } else {
        // Clouds - floating cloud particles
        return {
          x,
          y,
          size: size * 3,
          speed: speed * 0.3,
          color: "rgba(255, 255, 255, 0.2)",
          type: "cloud",
        }
      }
    }

    // Draw and update particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Special effect for thunderstorms - occasional lightning flash
      if (weatherCode >= 200 && weatherCode < 300 && Math.random() < 0.005) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      particles.forEach((particle) => {
        ctx.beginPath()

        if (particle.type === "rain") {
          // Rain drop
          ctx.strokeStyle = particle.color
          ctx.lineWidth = particle.size / 2
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(particle.x, particle.y + particle.size * 2)
          ctx.stroke()
        } else if (particle.type === "snow") {
          // Snowflake
          ctx.fillStyle = particle.color
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.type === "sunray") {
          // Sun ray
          ctx.fillStyle = particle.color
          ctx.globalAlpha = Math.random() * 0.3 + 0.1
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        } else if (particle.type === "star") {
          // Star
          ctx.fillStyle = particle.color
          ctx.globalAlpha = Math.random() * 0.5 + 0.3
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        } else if (particle.type === "cloud") {
          // Cloud particle
          ctx.fillStyle = particle.color
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }

        // Update particle position
        if (particle.type === "rain") {
          particle.y += particle.speed * 2
          particle.x += particle.speed * 0.5 // Angle for rain
        } else if (particle.type === "snow") {
          particle.y += particle.speed
          particle.x += Math.sin(Date.now() * 0.001 + particle.x) * 0.5 // Swaying snow
        } else if (particle.type === "cloud") {
          particle.x += particle.speed * 0.2
        } else {
          // Sun rays and stars just twinkle in place
          particle.size = particle.size * (0.95 + Math.random() * 0.1)
          if (particle.size < 0.5) particle.size = Math.random() * 5 + 1
        }

        // Reset particles that go off screen
        if (particle.y > canvas.height || particle.x > canvas.width) {
          if (particle.type === "rain" || particle.type === "snow") {
            particle.y = -10
            particle.x = Math.random() * canvas.width
          } else if (particle.type === "cloud") {
            if (particle.x > canvas.width) {
              particle.x = -10
              particle.y = Math.random() * canvas.height * 0.7
            }
          }
        }
      })

      animationFrame = requestAnimationFrame(drawParticles)
    }

    // Initialize and start animation
    createParticles()
    drawParticles()

    // Cleanup
    return () => {
      clearAnimation()
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [weatherCode, isDay])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
