import { useCallback, useEffect, useMemo, useRef } from 'react'
import { faceMotion } from '../animations/motion'
import {
  applyDirectionalPull,
  createMeshPoints,
  drawMeshImage,
  movePointsTowardOrigin,
  pointIndex,
  sectionDirections,
  warpPoint,
  type MeshGeometry,
  type MeshPoint,
} from '../utils/faceMesh'
import type { SectionId } from '../types/portfolio'
import { useReducedMotion } from './useReducedMotion'

type UseFaceNavigationCanvasOptions = {
  activeSection: SectionId
  onSelect: (section: SectionId) => void
  portraitSrc?: string
}

const canvasSize = 260
const meshGeometry: MeshGeometry = {
  width: canvasSize,
  height: canvasSize,
  cols: 8,
  rows: 8,
  centerX: canvasSize / 2,
  centerY: canvasSize / 2,
  radius: 116,
}

const snapZones: Array<{ section: SectionId; x: number; y: number }> = [
  { section: 'home', x: meshGeometry.centerX, y: 8 },
  { section: 'projects', x: meshGeometry.width - 8, y: meshGeometry.centerY - 42 },
  { section: 'skills', x: meshGeometry.width - 8, y: meshGeometry.centerY + 58 },
  { section: 'about', x: meshGeometry.centerX, y: meshGeometry.height - 8 },
]

export function useFaceNavigationCanvas({
  activeSection,
  onSelect,
  portraitSrc,
}: UseFaceNavigationCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointsRef = useRef<MeshPoint[]>(createMeshPoints(meshGeometry))
  const imageRef = useRef<HTMLImageElement | null>(null)
  const draggingRef = useRef<number | null>(null)
  const animationRef = useRef<number | null>(null)
  const hasMountedRef = useRef(false)
  const activeSectionRef = useRef(activeSection)
  const prefersReducedMotion = useReducedMotion()

  const visibleControlPoints = useMemo(() => {
    const indexes: number[] = []

    for (let row = 0; row <= meshGeometry.rows; row += 1) {
      for (let col = 0; col <= meshGeometry.cols; col += 1) {
        if ((row + col) % 2 === 0) {
          indexes.push(pointIndex(row, col, meshGeometry.cols))
        }
      }
    }

    return indexes
  }, [])

  const drawSchematicFace = useCallback((ctx: CanvasRenderingContext2D) => {
    const points = pointsRef.current
    const warp = (x: number, y: number) => warpPoint(x, y, points, meshGeometry)

    const hairTop = warp(130, 42)
    const jawLeft = warp(79, 170)
    const jawRight = warp(181, 170)
    const chin = warp(130, 205)
    const leftEye = warp(93, 108)
    const rightEye = warp(166, 108)
    const nose = warp(130, 139)
    const mouthLeft = warp(104, 166)
    const mouthRight = warp(158, 166)

    ctx.fillStyle = '#f2dfd3'
    ctx.beginPath()
    ctx.moveTo(hairTop.x, hairTop.y + 28)
    ctx.bezierCurveTo(warp(62, 76).x, warp(62, 76).y, jawLeft.x, jawLeft.y, chin.x, chin.y)
    ctx.bezierCurveTo(jawRight.x, jawRight.y, warp(198, 76).x, warp(198, 76).y, hairTop.x, hairTop.y + 28)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#171513'
    ctx.beginPath()
    ctx.moveTo(warp(67, 91).x, warp(67, 91).y)
    ctx.bezierCurveTo(warp(72, 38).x, warp(72, 38).y, warp(146, 23).x, warp(146, 23).y, warp(193, 77).x, warp(193, 77).y)
    ctx.bezierCurveTo(warp(179, 53).x, warp(179, 53).y, warp(118, 58).x, warp(118, 58).y, warp(84, 97).x, warp(84, 97).y)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(25, 22, 20, 0.62)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.ellipse(leftEye.x, leftEye.y, 15, 7, -0.07, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(rightEye.x, rightEye.y, 15, 7, 0.07, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#171513'
    ctx.beginPath()
    ctx.arc(leftEye.x + 2, leftEye.y, 3.2, 0, Math.PI * 2)
    ctx.arc(rightEye.x - 2, rightEye.y, 3.2, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'rgba(25, 22, 20, 0.35)'
    ctx.beginPath()
    ctx.moveTo(nose.x - 7, nose.y - 14)
    ctx.quadraticCurveTo(nose.x + 4, nose.y + 2, nose.x - 2, nose.y + 16)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(137, 61, 68, 0.72)'
    ctx.lineWidth = 1.3
    ctx.beginPath()
    ctx.moveTo(mouthLeft.x, mouthLeft.y)
    ctx.quadraticCurveTo(warp(130, 175).x, warp(130, 175).y, mouthRight.x, mouthRight.y)
    ctx.stroke()
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) {
      return
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    const targetSize = canvasSize * pixelRatio

    if (canvas.width !== targetSize || canvas.height !== targetSize) {
      canvas.width = targetSize
      canvas.height = targetSize
      canvas.style.width = `${canvasSize}px`
      canvas.style.height = `${canvasSize}px`
    }

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    ctx.save()
    ctx.beginPath()
    ctx.arc(meshGeometry.centerX, meshGeometry.centerY, meshGeometry.radius, 0, Math.PI * 2)
    ctx.clip()

    const gradient = ctx.createRadialGradient(104, 88, 20, 130, 130, 136)
    gradient.addColorStop(0, '#fff8f2')
    gradient.addColorStop(0.74, '#f4f1ea')
    gradient.addColorStop(1, '#ebe8df')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    if (imageRef.current) {
      drawMeshImage(ctx, imageRef.current, pointsRef.current, meshGeometry)
    } else {
      drawSchematicFace(ctx)
    }

    ctx.strokeStyle = 'rgba(25, 24, 21, 0.12)'
    ctx.lineWidth = 0.5
    for (let row = 0; row < meshGeometry.rows; row += 1) {
      for (let col = 0; col < meshGeometry.cols; col += 1) {
        const topLeft = pointsRef.current[pointIndex(row, col, meshGeometry.cols)]
        const topRight = pointsRef.current[pointIndex(row, col + 1, meshGeometry.cols)]
        const bottomLeft = pointsRef.current[pointIndex(row + 1, col, meshGeometry.cols)]
        const bottomRight = pointsRef.current[pointIndex(row + 1, col + 1, meshGeometry.cols)]

        ctx.beginPath()
        ctx.moveTo(topLeft.x, topLeft.y)
        ctx.lineTo(topRight.x, topRight.y)
        ctx.lineTo(bottomRight.x, bottomRight.y)
        ctx.lineTo(bottomLeft.x, bottomLeft.y)
        ctx.closePath()
        ctx.moveTo(topLeft.x, topLeft.y)
        ctx.lineTo(bottomRight.x, bottomRight.y)
        ctx.stroke()
      }
    }

    visibleControlPoints.forEach((index) => {
      const point = pointsRef.current[index]
      const distanceFromCenter = Math.hypot(point.x - meshGeometry.centerX, point.y - meshGeometry.centerY)

      if (distanceFromCenter > meshGeometry.radius + 8) {
        return
      }

      ctx.beginPath()
      ctx.arc(point.x, point.y, draggingRef.current === index ? 5.5 : 2.8, 0, Math.PI * 2)
      ctx.fillStyle = draggingRef.current === index ? '#11110f' : 'rgba(17, 17, 15, 0.24)'
      ctx.fill()
    })

    ctx.restore()

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.82)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.arc(meshGeometry.centerX, meshGeometry.centerY, meshGeometry.radius, 0, Math.PI * 2)
    ctx.stroke()

    Object.entries(sectionDirections).forEach(([section, direction]) => {
      const lineLength = meshGeometry.radius + 22
      const normalizer = Math.hypot(direction.x, direction.y) || 1
      const endX = meshGeometry.centerX + (direction.x / normalizer) * lineLength
      const endY = meshGeometry.centerY + (direction.y / normalizer) * lineLength

      ctx.strokeStyle =
        section === activeSectionRef.current ? 'rgba(0, 0, 0, 0.82)' : 'rgba(0, 0, 0, 0.2)'
      ctx.beginPath()
      ctx.moveTo(meshGeometry.centerX, meshGeometry.centerY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    })
  }, [drawSchematicFace, visibleControlPoints])

  const snapBack = useCallback(() => {
    if (animationRef.current) {
      window.cancelAnimationFrame(animationRef.current)
    }

    const steps = prefersReducedMotion ? 1 : faceMotion.snapSteps
    let currentStep = 0

    const tick = () => {
      movePointsTowardOrigin(pointsRef.current, faceMotion.spring)
      draw()
      currentStep += 1

      if (currentStep < steps) {
        animationRef.current = window.requestAnimationFrame(tick)
      }
    }

    animationRef.current = window.requestAnimationFrame(tick)
  }, [draw, prefersReducedMotion])

  const stretchTowardSection = useCallback(
    (section: SectionId) => {
      if (prefersReducedMotion) {
        snapBack()
        return
      }

      applyDirectionalPull(section, pointsRef.current, meshGeometry, faceMotion.pullStrength)
      draw()
      window.setTimeout(snapBack, 150)
    },
    [draw, prefersReducedMotion, snapBack],
  )

  useEffect(() => {
    activeSectionRef.current = activeSection

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      draw()
      return
    }

    stretchTowardSection(activeSection)
  }, [activeSection, draw, stretchTowardSection])

  useEffect(() => {
    if (!portraitSrc) {
      imageRef.current = null
      draw()
      return
    }

    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      imageRef.current = image
      draw()
    }
    image.src = portraitSrc
  }, [draw, portraitSrc])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const getCanvasPosition = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()

      return {
        x: ((event.clientX - rect.left) / rect.width) * canvasSize,
        y: ((event.clientY - rect.top) / rect.height) * canvasSize,
      }
    }

    const findNearestPoint = (position: { x: number; y: number }) => {
      let nearestIndex: number | null = null
      let nearestDistance = Number.POSITIVE_INFINITY

      visibleControlPoints.forEach((index) => {
        const point = pointsRef.current[index]
        const distance = Math.hypot(point.x - position.x, point.y - position.y)

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      return nearestDistance < 28 ? nearestIndex : null
    }

    const checkSnapZone = (position: { x: number; y: number }) => {
      const target = snapZones.find((zone) => Math.hypot(position.x - zone.x, position.y - zone.y) < 34)

      if (target && target.section !== activeSectionRef.current) {
        draggingRef.current = null
        onSelect(target.section)
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      const position = getCanvasPosition(event)
      draggingRef.current = findNearestPoint(position)

      if (draggingRef.current !== null) {
        canvas.setPointerCapture(event.pointerId)
      }

      draw()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (draggingRef.current === null) {
        return
      }

      const position = getCanvasPosition(event)
      const point = pointsRef.current[draggingRef.current]
      point.x = Math.max(-12, Math.min(canvasSize + 12, position.x))
      point.y = Math.max(-12, Math.min(canvasSize + 12, position.y))

      draw()
      checkSnapZone(position)
    }

    const finishDrag = () => {
      if (draggingRef.current === null) {
        return
      }

      draggingRef.current = null
      snapBack()
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', finishDrag)
    canvas.addEventListener('pointercancel', finishDrag)
    canvas.addEventListener('lostpointercapture', finishDrag)
    window.addEventListener('resize', draw)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', finishDrag)
      canvas.removeEventListener('pointercancel', finishDrag)
      canvas.removeEventListener('lostpointercapture', finishDrag)
      window.removeEventListener('resize', draw)
    }
  }, [draw, onSelect, snapBack, visibleControlPoints])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return { canvasRef }
}
