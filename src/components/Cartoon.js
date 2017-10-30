import React, { Component } from 'react'
import './Cartoon.css'

class Cartoon extends Component {
  generateSlice() {
    this.animateNode = []
    const { sliceWidth, number } = this.props
    const sliceNodes = []
    for (let i = 0; i < number; i++) {
      sliceNodes.push(
        <div
          className={i < 6 ? `animate-${i+1}` : `animate-${11- i}`}
          ref={(mount) => {
            this.animateNode[i] = mount
          }}
          key={i}
          style={{
            width: sliceWidth - 10,
            height: 100,
            marginLeft: (i * this.props.sliceWidth + 4), 
          }}
        />,
      )
    }

    return sliceNodes
  }

  animate = () => {
    this.animateNode.forEach((node, i) => {
      node.style.height = this.props.data[i] + 'px'
      if(node.style.animation === '') {
        node.style.animation = 'wave 3s ease-in-out infinite'
        node.style.animationDelay = i < 6 ? `0.${i}s` : `0.${10- i}s`
      }
    })
    this.frameId = setTimeout(this.animate, 300)
  }

  start = () => {
    if (!this.frameId) {
      // this.frameId = requestAnimationFrame(this.animate)
      this.frameId = setTimeout(this.animate, 300)
    }
  }

  componentWillReceiveProps() {
    this.start()
  }

  render() {
    const { data } = this.props
    return (
      <div
        ref={(mount) => {
          this.container = mount
        }}
        className="animate-container"
      >
        {this.generateSlice()}
      </div>
    )
  }
}

export default Cartoon
