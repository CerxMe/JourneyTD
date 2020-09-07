import { useCallback } from 'react'

document.addEventListener('mousemove', moveMouseHandler)

const moveMouseHandler = useCallback(
  ({ clientX, clientY }) => {
    console.log(`X:${clientX};Y:${clientY}`)
  }
)
