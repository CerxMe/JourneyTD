
import React, { useRef, useEffect, useCallback, useState } from 'react'
import useEventListener from '../use-event-listener'

const Canvas = props => {

  // State for storing mouse coordinates
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Event handler utilizing useCallback ...
  // ... so that reference never changes.
  const handler = useCallback(
    ({ clientX, clientY }) => {
      // Update coordinates
      setCoords({ x: clientX, y: clientY });
    },
    [setCoords]
  );

  // Add event listener using our hook
  useEventListener('mousemove', handler);


  const canvasRef = useRef(null)

  function resizeCanvas(canvas) {
    const { width, height } = canvas.getBoundingClientRect()

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio:ratio=1 } = window
      const context = canvas.getContext('2d')
      canvas.width = width*ratio
      canvas.height = height*ratio
      context.scale(ratio, ratio)
      return true
    }

    return false
  }

  useEffect(() => {

    // set window size
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    resizeCanvas(canvas)
    const { width, height } = canvas.getBoundingClientRect();


    function drawHexagon(center, size){
      // get corners
      const corners = []
      for(let i = 0; i <= 6; i++ ){
        const cornerPosition =  (center, size, i) => {
          const angle_deg = 60 * i - 30
          const angle_rad = Math.PI / 180 * angle_deg
          return {
            x: center.x + size * Math.cos(angle_rad),
            y: center.y + size * Math.sin(angle_rad)
          }
        }
        corners.push(cornerPosition(center,size,i))
      }
      // draw a circle at each corner
      // for(const corner of corners){
      //   ctx.beginPath();
      //   ctx.arc(corner.x, corner.y, 2, 0, 2 * Math.PI);
      //   ctx.fillStyle = '#B7FFBD'
      //   ctx.closePath();
      //   ctx.fill();
      // }
      // draw polygon
      // connect corners
      ctx.beginPath()
      for(let i = 0; i <= corners.length -1; i++){
        if(i===0) {
          ctx.moveTo(corners[i].x,corners[i].y)
        }
        const to = corners[i+1] || corners[0]
        ctx.lineTo(to.x, to.y);
      }
      ctx.closePath();
      ctx.fillStyle = '#FF8B93'
      ctx.shadowBlur = 3
      ctx.shadowColor = '#B7FFBD'
      ctx.strokeStyle = '#B7FFBD'
      ctx.stroke()




      console.log(corners)
    }
    drawHexagon({x: width/2, y: height/2}, 50)

    // draw X across the screen
    // ctx.beginPath()
    // ctx.moveTo(0, 0)
    // ctx.lineTo(width, height);
    // ctx.strokeStyle = '#9B99FF'
    // ctx.stroke()
    // ctx.beginPath()
    // ctx.moveTo(width, 0)
    // ctx.lineTo(0, height);
    // ctx.strokeStyle = '#9B99FF'
    // ctx.stroke()
  })

  return <canvas className={'gameWindow'} ref={canvasRef} {...props}/>
}

export default Canvas
