"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface UnitToggleProps {
  onToggle: (unit: "celsius" | "fahrenheit") => void
  currentUnit: "celsius" | "fahrenheit"
}

export default function UnitToggle({ onToggle, currentUnit }: UnitToggleProps) {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="bg-white/30 rounded-full p-1 flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle("celsius")}
          className={`rounded-full px-3 py-1 text-sm font-medium relative ${
            currentUnit === "celsius" ? "text-blue-600" : "text-white"
          }`}
        >
          °C
          {currentUnit === "celsius" && (
            <motion.div
              layoutId="unitHighlight"
              className="absolute inset-0 bg-white rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle("fahrenheit")}
          className={`rounded-full px-3 py-1 text-sm font-medium relative ${
            currentUnit === "fahrenheit" ? "text-blue-600" : "text-white"
          }`}
        >
          °F
          {currentUnit === "fahrenheit" && (
            <motion.div
              layoutId="unitHighlight"
              className="absolute inset-0 bg-white rounded-full -z-10"
              initial={false}
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
        </Button>
      </div>
    </div>
  )
}
