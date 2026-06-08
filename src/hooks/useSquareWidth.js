import { useState, useEffect, useRef } from 'react'

export const useSquareWidth = () => {
  const squareRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!squareRef.current) return

    const updateWidth = () => {
      if (squareRef.current) {
        setWidth(squareRef.current.offsetWidth)
      }
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(squareRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  return { squareRef, width }
}
