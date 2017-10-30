import React, { Component } from 'react'
import Cartoon from './Cartoon'
import Particles from './Particles'
import './Audio.css'

class Audio extends Component {
  constructor(props) {
    super(props)
    this.file = ''
    this.NUM_SLICE = 11
    this.NUM_PARTICLES = 36
    this.sliceWidth = 360 / this.NUM_SLICE
    this.state = {
      visualData: 0,
    }
  }

  componentWillMount() {
    this.context = new AudioContext()
    // 缓冲区
    this.processor = this.context.createScriptProcessor(1024)
    // 分析节点
    this.analyser = this.context.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.5
    this.analyser.fftSize = 256
    this.processor.connect(this.context.destination)
    this.analyser.connect(this.processor)
  }

  openFile = () => {
    const filter = /mp3/gi
    const files = this.fileInput.files
    if (files.length) {
      this.reader = new FileReader()
      this.file = files[0]
      console.log(this.file)
      if (!filter.test(this.file.type)) {
        alert('上传MP3文件')
        return
      }

      this.reader.readAsArrayBuffer(this.file)
      this.reader.onload = this.readerBufferLoad
    }
  }

  readerBufferLoad = e => {
    this.buffer = e.target.result
    this.sound = this.context.createBufferSource()
    this.context.decodeAudioData(this.buffer, buffer => {
      this.sound.buffer = buffer
      this.sound.start()
      this.sound.connect(this.analyser)
      this.sound.connect(this.context.destination)
      const self = this
      this.processor.onaudioprocess = function() {
        self.data = new Uint8Array(self.analyser.frequencyBinCount)
        self.analyser.getByteTimeDomainData(self.data)
        const visualData = self.genAnimateValue(self.data)
        self.setState({
          visualData,
        })
      }
    })
  }

  genAnimateValue(data) {
    const value = []
    for (let i = 0; i < this.NUM_SLICE; i++) {
      const index = parseInt(data.length / this.NUM_SLICE * i, 10)
      value[i] = data[index]
    }
    return value
  }

  stop = () => {
    this.sound.stop()
    /* this.sound.disconnect()
    this.sound = null
    this.processor.onaudioprocess = function() {} */
  }

  start = () => {
    this.sound.start()
  }

  render() {
    return (
      <Particles number={this.NUM_PARTICLES} data={this.state.visualData}>
        <div className="audio-container">
          <div className="file-container" data-text={this.file.name}>
            <input
              ref={mount => {
                this.fileInput = mount
              }}
              type="file"
              name="audio"
              id="audioFile"
              onChange={this.openFile}
            />
          </div>
          <Cartoon
            sliceWidth={this.sliceWidth}
            number={this.NUM_SLICE}
            data={this.state.visualData}
          />
        </div>
      </Particles>
    )
  }
}

export default Audio
