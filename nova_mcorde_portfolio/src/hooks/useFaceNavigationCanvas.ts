import { useCallback, useEffect, useRef } from 'react'
import {
  createMeshPoints,
  drawMeshImage,
  warpPoint,
  type MeshGeometry,
  type MeshPoint,
} from '../utils/faceMesh'
import type { SectionId } from '../types/portfolio'


type UseFaceNavigationCanvasOptions = {
  activeSection: SectionId
  onSelect: (section: SectionId) => void
  portraitSrc?: string
}

type RadialHandle = {
  angle: number
  section: SectionId | null
  progress: number
}

type Point = {
  x: number
  y: number
}

const canvasSize = 260
const innerHandleProgress = 0.5
const snapProgress = 0.94

const meshGeometry: MeshGeometry = {
  width: canvasSize,
  height: canvasSize,
  cols: 8,
  rows: 8,
  centerX: canvasSize / 2,
  centerY: canvasSize / 2,
  radius: 116,
}

const radialGuides: Array<Omit<RadialHandle, 'progress'>> = [
  { angle: -Math.PI / 2, section: 'projects' },
  { angle: -Math.PI / 4, section: null },
  { angle: 0, section: null },
  { angle: Math.PI / 4, section: 'skills' },
  { angle: Math.PI / 2, section: 'about' },
  { angle: (3 * Math.PI) / 4, section: null },
  { angle: Math.PI, section: null },
  { angle: (-3 * Math.PI) / 4, section: 'home' },
]

function createRadialHandles(): RadialHandle[] {
  return radialGuides.map((guide) => ({
    ...guide,
    progress: innerHandleProgress,
  }))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function pointFromAngle(angle: number, radius: number): Point {
  return {
    x: meshGeometry.centerX + Math.cos(angle) * radius,
    y: meshGeometry.centerY + Math.sin(angle) * radius,
  }
}

function getHandlePoint(handle: RadialHandle): Point {
  return pointFromAngle(handle.angle, meshGeometry.radius * handle.progress)
}

function projectPointToGuide(position: Point, angle: number) {
  const unitX = Math.cos(angle)
  const unitY = Math.sin(angle)
  const fromCenterX = position.x - meshGeometry.centerX
  const fromCenterY = position.y - meshGeometry.centerY
  const projectedDistance = fromCenterX * unitX + fromCenterY * unitY

  return clamp(projectedDistance / meshGeometry.radius, 0, 1)
}

function resetNavigationHandles(handles: RadialHandle[]) {
  handles.forEach((handle) => {
    if (handle.section) {
      handle.progress = innerHandleProgress
    }
  })
}

function rebuildMeshFromHandles(points: MeshPoint[], handles: RadialHandle[]) {
  points.forEach((point) => {
    point.x = point.ox
    point.y = point.oy
  })

  handles.forEach((handle) => {
    const displacementDistance = (handle.progress - innerHandleProgress) * meshGeometry.radius

    if (Math.abs(displacementDistance) < 0.4) {
      return
    }

    const unitX = Math.cos(handle.angle)
    const unitY = Math.sin(handle.angle)
    const displacementX = unitX * displacementDistance
    const displacementY = unitY * displacementDistance

    points.forEach((point) => {
      const fromCenterX = point.ox - meshGeometry.centerX
      const fromCenterY = point.oy - meshGeometry.centerY
      const distanceFromCenter = Math.hypot(fromCenterX, fromCenterY)

      if (distanceFromCenter < 1) {
        point.x += displacementX * 0.2
        point.y += displacementY * 0.2
        return
      }

      const alignment = clamp((fromCenterX * unitX + fromCenterY * unitY) / distanceFromCenter, 0, 1)
      const radialWeight = clamp(distanceFromCenter / meshGeometry.radius, 0.18, 1)
      const influence = Math.pow(alignment, 3.2) * (0.25 + radialWeight * 0.75)

      point.x += displacementX * influence
      point.y += displacementY * influence
    })
  })
}

export function useFaceNavigationCanvas({
  activeSection,
  onSelect,
  portraitSrc,
}: UseFaceNavigationCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointsRef = useRef<MeshPoint[]>(createMeshPoints(meshGeometry))
  const imageRef = useRef<HTMLImageElement | null>(null)
  const handlesRef = useRef<RadialHandle[]>(createRadialHandles())
  const draggingHandleRef = useRef<number | null>(null)
  const activeSectionRef = useRef(activeSection)

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
    ctx.lineWidth = 1
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

  const drawGuideCircle = useCallback(
    (ctx: CanvasRenderingContext2D, point: Point, radius: number, isActive = false) => {
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.34)'
      ctx.shadowBlur = isActive ? 12 : 8
      ctx.shadowOffsetY = 1.5
      ctx.fillStyle = isActive ? '#f4f1ea' : '#fbfaf6'
      ctx.strokeStyle = isActive ? 'rgba(127, 119, 221, 0.95)' : 'rgba(0, 0, 0, 0.76)'
      ctx.lineWidth = isActive ? 1.6 : 1.15
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.arc(point.x - 0.5, point.y - 0.5, radius - 2.2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    },
    [],
  )

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

    rebuildMeshFromHandles(pointsRef.current, handlesRef.current)

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

    ctx.restore()

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)'
    ctx.lineWidth = 0.65
    ctx.setLineDash([1.5, 1.5])
    radialGuides.forEach((guide) => {
      const edgePoint = pointFromAngle(guide.angle, meshGeometry.radius)
      ctx.beginPath()
      ctx.moveTo(meshGeometry.centerX, meshGeometry.centerY)
      ctx.lineTo(edgePoint.x, edgePoint.y)
      ctx.stroke()
    })
    ctx.setLineDash([])

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.82)'
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.arc(meshGeometry.centerX, meshGeometry.centerY, meshGeometry.radius, 0, Math.PI * 2)
    ctx.stroke()

    radialGuides.forEach((guide) => {
      const isNavigationPoint = guide.section === activeSectionRef.current
      drawGuideCircle(ctx, pointFromAngle(guide.angle, meshGeometry.radius), 4.9, isNavigationPoint)
    })

    drawGuideCircle(ctx, { x: meshGeometry.centerX, y: meshGeometry.centerY }, 5.3)

    handlesRef.current.forEach((handle, index) => {
      const isDragging = draggingHandleRef.current === index
      const isNavigationHandle = Boolean(handle.section)
      drawGuideCircle(ctx, getHandlePoint(handle), isDragging ? 7 : isNavigationHandle ? 6.2 : 5.8, isDragging)
    })
  }, [drawGuideCircle, drawSchematicFace])

  useEffect(() => {
    activeSectionRef.current = activeSection
    resetNavigationHandles(handlesRef.current)
    draw()
  }, [activeSection, draw])

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

    const toCanvasPosition = (event: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect()

      return {
        x: ((event.clientX - rect.left) / rect.width) * canvasSize,
        y: ((event.clientY - rect.top) / rect.height) * canvasSize,
      }
    }

    const findNearestHandle = (position: Point) => {
      let nearestIndex: number | null = null
      let nearestDistance = Number.POSITIVE_INFINITY

      handlesRef.current.forEach((handle, index) => {
        const handlePoint = getHandlePoint(handle)
        const distance = Math.hypot(handlePoint.x - position.x, handlePoint.y - position.y)

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      return nearestDistance <= 16 ? nearestIndex : null
    }

    const handlePointerDown = (event: PointerEvent) => {
      const nearestHandle = findNearestHandle(toCanvasPosition(event))

      if (nearestHandle === null) {
        return
      }

      draggingHandleRef.current = nearestHandle
      canvas.setPointerCapture(event.pointerId)
      draw()
    }

    const handlePointerMove = (event: PointerEvent) => {
      const activeHandleIndex = draggingHandleRef.current

      if (activeHandleIndex === null) {
        return
      }

      const handle = handlesRef.current[activeHandleIndex]
      const position = toCanvasPosition(event)
      handle.progress = projectPointToGuide(position, handle.angle)

      if (handle.section && handle.progress >= snapProgress) {
        const targetSection = handle.section
        resetNavigationHandles(handlesRef.current)
        draggingHandleRef.current = null
        draw()

        if (targetSection !== activeSectionRef.current) {
          onSelect(targetSection)
        }

        return
      }

      draw()
    }

    const finishDrag = () => {
      if (draggingHandleRef.current === null) {
        return
      }

      draggingHandleRef.current = null
      draw()
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
  }, [draw, onSelect])

  return { canvasRef }
}
