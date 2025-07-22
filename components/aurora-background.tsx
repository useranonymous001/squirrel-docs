"use client"

import { useEffect, useRef } from "react"

export function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      time += 0.01

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time) * 200,
        canvas.height / 2 + Math.cos(time * 0.8) * 150,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) * 0.8,
      )

      gradient.addColorStop(0, `hsla(220, 70%, 60%, ${0.1 + Math.sin(time) * 0.05})`)
      gradient.addColorStop(0.3, `hsla(240, 80%, 70%, ${0.08 + Math.cos(time * 1.2) * 0.03})`)
      gradient.addColorStop(0.6, `hsla(260, 60%, 80%, ${0.05 + Math.sin(time * 0.7) * 0.02})`)
      gradient.addColorStop(1, "hsla(280, 40%, 90%, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add floating particles
      for (let i = 0; i < 5; i++) {
        const x = canvas.width / 2 + Math.sin(time + i) * (200 + i * 50)
        const y = canvas.height / 2 + Math.cos(time * 0.8 + i) * (150 + i * 30)
        const radius = 2 + Math.sin(time * 2 + i) * 1

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${220 + i * 20}, 70%, 70%, 0.3)`
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  )
}
