import React, { Component } from 'react'
import './Particles.css'

class Particles extends Component {
  constructor(props) {
    super(props)
    this.particles = []
    this.minRadius = 5
    this.maxRadius = 50
    this.minSpeed = 0.05
    this.maxSpeed = 0.5
    this.colors = [
      '#08AEEA',
      '#FEE140',
      '#2BFF88',
      '#228CE0',
      '#FF2525'
    ]
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d')
    this.createParticles()
  }

  draw(i) {
    this.ctx.beginPath()
    const grad = this.ctx.createRadialGradient(
      this.particles[i].xPos,
      this.particles[i].yPos,
      this.particles[i].radius,
      this.particles[i].xPos,
      this.particles[i].yPos,
      this.particles[i].radius / 1.25,
    )
    grad.addColorStop(1, this.colors[i % 5])
    grad.addColorStop(0, '#E0C3FC')
    this.ctx.fillStyle = grad

    this.ctx.arc(
      this.particles[i].xPos,
      this.particles[i].yPos,
      this.particles[i].radius,
      0,
      2 * Math.PI,
      false,
    )
    this.ctx.fill()
  }

  random(min, max) {
    return Math.random() * (max - min) + min
  }

  createParticles() {
    const { number, data } = this.props
    for (let i = 0; i < number; i++) {
      this.particles.push({
        radius: this.random(this.minRadius, this.maxRadius),
        xPos: this.random(0, this.canvas.width),
        yPos: this.random(0, this.canvas.height),
        xVelocity: this.random(this.minSpeed, this.maxSpeed),
        yVelocity: this.random(this.minSpeed, this.maxSpeed),
      })
      this.draw(i)
    }
    this.start()
    console.log(this.particles)
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const { number } = this.props
    for (var i = 0; i < number; i++) {
      this.particles[i].xPos += this.particles[i].xVelocity
      this.particles[i].yPos -= this.particles[i].yVelocity

      if (
        this.particles[i].xPos > this.canvas.width + this.particles[i].radius ||
        this.particles[i].yPos > this.canvas.height + this.particles[i].radius
      ) {
        this.resetParticle(i)
      } else {
        this.draw(i)
      }
    }
    this.frameId = requestAnimationFrame(this.animate)
  }

  // 重置 从下方
  resetParticle(i) {
    const ran = this.random(0, 1)
    if (ran > 0.5) {
      this.particles[i].xPos = this.random(0, this.canvas.width)
      this.particles[i].yPos = this.canvas.height + this.particles[i].radius
    } else {
      this.particles[i].xPos = - this.particles[i].radius
      this.particles[i].yPos = this.random(0, this.canvas.height)
    }
    
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  render() {
    const { children } = this.props
    return (
      <div className="particles-container">
        <canvas
          ref={mount => {
            this.canvas = mount
          }}
          width={document.body.offsetWidth}
          height={document.body.offsetHeight}
        />
        {children}
      </div>
    )
  }
}

export default Particles
