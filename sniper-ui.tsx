"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Wind, Crosshair, Target, ChevronUp, ChevronDown } from "lucide-react"

export default function SniperUI() {
  const [zoom, setZoom] = useState(2)
  const [windSpeed, setWindSpeed] = useState(1.5)
  const [windDirection, setWindDirection] = useState(45)
  const [distance, setDistance] = useState(350)
  const [breathing, setBreathing] = useState(true)
  const [steadiness, setSteadiness] = useState(100)
  const [holdingBreath, setHoldingBreath] = useState(false)

  // Simulate breathing effect
  useEffect(() => {
    if (!breathing) return

    const breathingInterval = setInterval(() => {
      if (holdingBreath) {
        setSteadiness((prev) => Math.max(prev - 1, 0))
      } else {
        setSteadiness((prev) => {
          const newValue = prev + (Math.random() * 2 - 1)
          return Math.max(Math.min(newValue, 100), 80)
        })
      }
    }, 100)

    return () => clearInterval(breathingInterval)
  }, [breathing, holdingBreath])

  // Handle holding breath
  const handleHoldBreath = () => {
    setHoldingBreath(true)
    setSteadiness(100)
  }

  const handleReleaseBreath = () => {
    setHoldingBreath(false)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Simulated background - would be replaced with actual game view */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          transform: `scale(${zoom})`,
          transition: "transform 0.5s ease-out",
        }}
      />

      {/* Scope overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Scope outer ring */}
        <div className="relative h-[95vh] w-[95vh] rounded-full border-[40px] border-black">
          {/* Scope inner view */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.8)",
              transform: `translate(${holdingBreath ? 0 : ((Math.random() * 4 - 2) * (100 - steadiness)) / 100}px, ${holdingBreath ? 0 : ((Math.random() * 4 - 2) * (100 - steadiness)) / 100}px)`,
            }}
          >
            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Vertical line */}
              <div className="absolute h-full w-[2px] bg-red-500 opacity-70"></div>

              {/* Horizontal line */}
              <div className="absolute h-[2px] w-full bg-red-500 opacity-70"></div>

              {/* Center dot */}
              <div className="absolute h-[6px] w-[6px] rounded-full bg-red-500"></div>

              {/* Distance markers */}
              <div className="absolute h-full w-full">
                {/* Top marker */}
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="h-[10px] w-[2px] bg-red-500 opacity-70"></div>
                  <div className="h-[10px] w-[2px] bg-red-500 opacity-70 mt-[20px]"></div>
                  <div className="h-[10px] w-[2px] bg-red-500 opacity-70 mt-[20px]"></div>
                </div>

                {/* Bottom marker */}
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="h-[10px] w-[2px] bg-red-500 opacity-70"></div>
                  <div className="h-[10px] w-[2px] bg-red-500 opacity-70 mt-[20px]"></div>
                  <div className="h-[10px] w-[2px] bg-red-500 opacity-70 mt-[20px]"></div>
                </div>

                {/* Left marker */}
                <div className="absolute left-[20%] top-1/2 -translate-y-1/2 flex flex-row items-center">
                  <div className="h-[2px] w-[10px] bg-red-500 opacity-70"></div>
                  <div className="h-[2px] w-[10px] bg-red-500 opacity-70 ml-[20px]"></div>
                  <div className="h-[2px] w-[10px] bg-red-500 opacity-70 ml-[20px]"></div>
                </div>

                {/* Right marker */}
                <div className="absolute right-[20%] top-1/2 -translate-y-1/2 flex flex-row items-center">
                  <div className="h-[2px] w-[10px] bg-red-500 opacity-70"></div>
                  <div className="h-[2px] w-[10px] bg-red-500 opacity-70 ml-[20px]"></div>
                  <div className="h-[2px] w-[10px] bg-red-500 opacity-70 ml-[20px]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 150px 100px rgba(0, 0, 0, 0.95)",
        }}
      ></div>

      {/* HUD Elements */}
      <div className="absolute bottom-8 left-8 text-red-500 font-mono text-sm space-y-2 bg-black/30 p-3 rounded-md">
        <div className="flex items-center gap-2">
          <Target size={16} />
          <span>DIST: {distance}m</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind size={16} />
          <span>
            WIND: {windSpeed} m/s @ {windDirection}°
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Crosshair size={16} />
          <span>ZOOM: {zoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-8 bottom-8 space-y-4 bg-black/30 p-3 rounded-md">
        <div className="flex flex-col items-center">
          <span className="text-red-500 font-mono text-xs mb-1">ZOOM</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-red-500 text-red-500 hover:bg-red-950"
              onClick={() => setZoom(Math.max(zoom - 0.5, 1))}
            >
              <ChevronDown size={16} />
            </Button>
            <Slider
              value={[zoom]}
              min={1}
              max={8}
              step={0.1}
              className="w-24"
              onValueChange={(value) => setZoom(value[0])}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-red-500 text-red-500 hover:bg-red-950"
              onClick={() => setZoom(Math.min(zoom + 0.5, 8))}
            >
              <ChevronUp size={16} />
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-950 font-mono text-xs"
            onMouseDown={handleHoldBreath}
            onMouseUp={handleReleaseBreath}
            onMouseLeave={handleReleaseBreath}
          >
            HOLD BREATH [{steadiness.toFixed(0)}%]
          </Button>
        </div>
      </div>

      {/* Scope edge shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 47.5vh, rgba(0, 0, 0, 0.95) 47.5vh)",
        }}
      ></div>
    </div>
  )
}

