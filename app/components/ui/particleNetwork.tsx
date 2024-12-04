import { useEffect, useRef } from "react"

export default function ParticleNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return //Ensure canvass is not null

        const ctx = canvas.getContext('2d')
        if (!ctx) return //Ensure context is not null

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const particles: { x: number; y: number; vx: number; vy: number }[] = []
        const particleCount = 100

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            })
        }

        function animate() {
            if (!canvas || !ctx) return; // Check for null values
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            particles.forEach((particle, i) => {
                particle.x += particle.vx
                particle.y += particle.vy

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

                ctx.beginPath()
                ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.fill()

                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x
                    const dy = particle.y - otherParticle.y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.moveTo(particle.x, particle.y)
                        ctx.lineTo(otherParticle.x, otherParticle.y)
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance / 500})`
                        ctx.stroke()
                    }
                })
            })

            requestAnimationFrame(animate)
        }

        animate()
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}