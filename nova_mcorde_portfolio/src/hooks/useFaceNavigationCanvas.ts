import { useCallback, useEffect, useMemo, useRef } from 'react'
import { faceMotion } from '../animations/motion'
import {
  applyDirectionalPull,
  createMeshPoints,
  drawMeshImage,
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

// ── Malla 5×5: menos nodos → deformación más contundente y visible ──
const meshGeometry: MeshGeometry = {
  width: canvasSize,
  height: canvasSize,
  cols: 5,
  rows: 5,
  centerX: canvasSize / 2,
  centerY: canvasSize / 2,
  radius: 116,
}

// ── Zonas de snap: coinciden con los extremos de las 6 líneas ──
// Las direcciones en sectionDirections son:
//   home     → (0, -1)        arriba
//   projects → (1, -0.36)     derecha-arriba
//   skills   → (1,  0.74)     derecha-abajo
//   about    → (0,  1)        abajo
// Cada zona está justo al borde del círculo en esa dirección
const snapZones: Array<{ section: SectionId; x: number; y: number }> = [
  { section: 'home',     x: meshGeometry.centerX,        y: 6 },
  { section: 'projects', x: meshGeometry.width - 6,      y: meshGeometry.centerY - 42 },
  { section: 'skills',   x: meshGeometry.width - 6,      y: meshGeometry.centerY + 58 },
  { section: 'about',    x: meshGeometry.centerX,        y: meshGeometry.height - 6 },
]

export function useFaceNavigationCanvas({
  activeSection,
  onSelect,
  portraitSrc,
}: UseFaceNavigationCanvasOptions) {
  const canvasRef    = useRef<HTMLCanvasElement | null>(null)
  const pointsRef    = useRef<MeshPoint[]>(createMeshPoints(meshGeometry))
  const imageRef     = useRef<HTMLImageElement | null>(null)
  const draggingRef  = useRef<number | null>(null)
  const animationRef = useRef<number | null>(null)
  const hasMountedRef    = useRef(false)
  const activeSectionRef = useRef(activeSection)
  const pulledSectionRef = useRef<SectionId | null>(null)
  const prefersReducedMotion = useReducedMotion()

  // Todos los puntos de control de la malla (5×5 → 6×6 vértices = 36)
  const visibleControlPoints = useMemo(() => {
    const indexes: number[] = []
    for (let row = 0; row <= meshGeometry.rows; row += 1) {
      for (let col = 0; col <= meshGeometry.cols; col += 1) {
        indexes.push(pointIndex(row, col, meshGeometry.cols))
      }
    }
    return indexes
  }, [])

  // ── Cara esquemática (cuando no hay foto) ──────────────────────────────────
  const drawSchematicFace = useCallback((ctx: CanvasRenderingContext2D) => {
    const pts = pointsRef.current
    const w   = (x: number, y: number) => warpPoint(x, y, pts, meshGeometry)

    const hairTop  = w(130, 42)
    const jawLeft  = w(79, 170)
    const jawRight = w(181, 170)
    const chin     = w(130, 205)
    const leftEye  = w(93, 108)
    const rightEye = w(166, 108)
    const nose     = w(130, 139)
    const mouthL   = w(104, 166)
    const mouthR   = w(158, 166)

    // Piel
    ctx.fillStyle = '#f2dfd3'
    ctx.beginPath()
    ctx.moveTo(hairTop.x, hairTop.y + 28)
    ctx.bezierCurveTo(w(62,76).x, w(62,76).y, jawLeft.x, jawLeft.y, chin.x, chin.y)
    ctx.bezierCurveTo(jawRight.x, jawRight.y, w(198,76).x, w(198,76).y, hairTop.x, hairTop.y + 28)
    ctx.closePath()
    ctx.fill()

    // Cabello
    ctx.fillStyle = '#171513'
    ctx.beginPath()
    ctx.moveTo(w(67,91).x, w(67,91).y)
    ctx.bezierCurveTo(w(72,38).x, w(72,38).y, w(146,23).x, w(146,23).y, w(193,77).x, w(193,77).y)
    ctx.bezierCurveTo(w(179,53).x, w(179,53).y, w(118,58).x, w(118,58).y, w(84,97).x, w(84,97).y)
    ctx.closePath()
    ctx.fill()

    // Ojos contorno
    ctx.strokeStyle = 'rgba(25, 22, 20, 0.62)'
    ctx.lineWidth = 1.2
    ctx.beginPath(); ctx.ellipse(leftEye.x,  leftEye.y,  15, 7, -0.07, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.ellipse(rightEye.x, rightEye.y, 15, 7,  0.07, 0, Math.PI * 2); ctx.stroke()

    // Pupilas
    ctx.fillStyle = '#171513'
    ctx.beginPath(); ctx.arc(leftEye.x  + 2, leftEye.y,  3.2, 0, Math.PI * 2)
    ctx.arc(rightEye.x - 2, rightEye.y, 3.2, 0, Math.PI * 2); ctx.fill()

    // Nariz
    ctx.strokeStyle = 'rgba(25, 22, 20, 0.35)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(nose.x - 7, nose.y - 14)
    ctx.quadraticCurveTo(nose.x + 4, nose.y + 2, nose.x - 2, nose.y + 16)
    ctx.stroke()

    // Boca
    ctx.strokeStyle = 'rgba(137, 61, 68, 0.72)'
    ctx.lineWidth = 1.3
    ctx.beginPath()
    ctx.moveTo(mouthL.x, mouthL.y)
    ctx.quadraticCurveTo(w(130,175).x, w(130,175).y, mouthR.x, mouthR.y)
    ctx.stroke()
  }, [])

  // ── Draw principal ─────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx    = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const targetSize = canvasSize * dpr
    if (canvas.width !== targetSize || canvas.height !== targetSize) {
      canvas.width  = targetSize
      canvas.height = targetSize
      canvas.style.width  = `${canvasSize}px`
      canvas.style.height = `${canvasSize}px`
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvasSize, canvasSize)

    // ── Interior del círculo (clip) ────────────────────────────────────────
    ctx.save()
    ctx.beginPath()
    ctx.arc(meshGeometry.centerX, meshGeometry.centerY, meshGeometry.radius, 0, Math.PI * 2)
    ctx.clip()

    // Fondo suave
    const grad = ctx.createRadialGradient(104, 88, 20, 130, 130, 136)
    grad.addColorStop(0,    '#fff8f2')
    grad.addColorStop(0.74, '#f4f1ea')
    grad.addColorStop(1,    '#ebe8df')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Imagen o cara esquemática
    if (imageRef.current) {
      drawMeshImage(ctx, imageRef.current, pointsRef.current, meshGeometry)
    } else {
      drawSchematicFace(ctx)
    }

    // Grid de la malla (solo para depuración visual sutil)
    ctx.strokeStyle = 'rgba(25, 24, 21, 0.08)'
    ctx.lineWidth   = 0.4
    for (let row = 0; row < meshGeometry.rows; row++) {
      for (let col = 0; col < meshGeometry.cols; col++) {
        const tl = pointsRef.current[pointIndex(row,   col,   meshGeometry.cols)]
        const tr = pointsRef.current[pointIndex(row,   col+1, meshGeometry.cols)]
        const bl = pointsRef.current[pointIndex(row+1, col,   meshGeometry.cols)]
        const br = pointsRef.current[pointIndex(row+1, col+1, meshGeometry.cols)]
        ctx.beginPath()
        ctx.moveTo(tl.x, tl.y); ctx.lineTo(tr.x, tr.y)
        ctx.lineTo(br.x, br.y); ctx.lineTo(bl.x, bl.y)
        ctx.closePath(); ctx.stroke()
      }
    }

    // Puntos de control visibles
    visibleControlPoints.forEach((index) => {
      const pt   = pointsRef.current[index]
      const dist = Math.hypot(pt.x - meshGeometry.centerX, pt.y - meshGeometry.centerY)
      if (dist > meshGeometry.radius + 6) return
      const isDragging = draggingRef.current === index
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, isDragging ? 5 : 2.2, 0, Math.PI * 2)
      ctx.fillStyle = isDragging ? '#11110f' : 'rgba(17,17,15,0.18)'
      ctx.fill()
    })

    ctx.restore()

    // ── Fuera del clip: borde + 6 líneas de navegación ────────────────────

    // 3 diámetros completos = 6 líneas desde el centro hacia afuera
    // Ángulos: las 4 secciones definen 4 de los 6 extremos;
    // las otras 2 son los opuestos exactos de HOME (abajo=ABOUT) y PROJECTS (opuesto=izq-arriba)
    // En realidad home→about ya son opuestos, y projects←→punto simétrico izq-arriba.
    // Así que dibujamos los 3 diámetros completos:
    //   Diámetro 1: HOME (arriba) ↔ ABOUT (abajo)
    //   Diámetro 2: PROJECTS (der-arriba) ↔ opuesto izq-abajo
    //   Diámetro 3: SKILLS (der-abajo) ↔ opuesto izq-arriba

    const cx = meshGeometry.centerX
    const cy = meshGeometry.centerY
    const R  = meshGeometry.radius + 28  // longitud de línea (llega hasta los labels)

    const lineAngles: Array<{ section: SectionId | null; angle: number }> = [
      // Diámetro 1
      { section: 'home',     angle: -Math.PI / 2 },        // arriba
      { section: 'about',    angle:  Math.PI / 2 },         // abajo
      // Diámetro 2
      { section: 'projects', angle: Math.atan2(-0.36, 1) }, // der-arriba
      { section: null,       angle: Math.atan2(-0.36, 1) + Math.PI }, // opuesto
      // Diámetro 3
      { section: 'skills',   angle: Math.atan2(0.74, 1) },  // der-abajo
      { section: null,       angle: Math.atan2(0.74, 1) + Math.PI }, // opuesto
    ]

    // Dibuja cada diámetro como una línea continua de extremo a extremo
    // (3 líneas completas, no 6 medias)
    const diameters = [
      [lineAngles[0], lineAngles[1]],
      [lineAngles[2], lineAngles[3]],
      [lineAngles[4], lineAngles[5]],
    ]

    diameters.forEach(([a, b]) => {
      // La línea es activa si alguno de sus extremos corresponde a la sección activa
      const isActive =
        a.section === activeSectionRef.current ||
        b.section === activeSectionRef.current

      ctx.strokeStyle = isActive ? 'rgba(0,0,0,0.80)' : 'rgba(0,0,0,0.18)'
      ctx.lineWidth   = isActive ? 0.9 : 0.6
      ctx.setLineDash([])

      const x1 = cx + Math.cos(a.angle) * R
      const y1 = cy + Math.sin(a.angle) * R
      const x2 = cx + Math.cos(b.angle) * R
      const y2 = cy + Math.sin(b.angle) * R

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    })

    // Borde circular
    ctx.strokeStyle = 'rgba(0,0,0,0.78)'
    ctx.lineWidth   = 0.8
    ctx.setLineDash([])
    ctx.beginPath()
    ctx.arc(cx, cy, meshGeometry.radius, 0, Math.PI * 2)
    ctx.stroke()
  }, [drawSchematicFace, visibleControlPoints])

  // ── Animación hacia un estado de pull ─────────────────────────────────────
  const animateToState = useCallback(
    (targetSection: SectionId | null, strength: number, onComplete?: () => void) => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current)

      if (prefersReducedMotion) {
        if (targetSection) {
          applyDirectionalPull(targetSection, pointsRef.current, meshGeometry, strength)
        } else {
          pointsRef.current.forEach((p) => { p.x = p.ox; p.y = p.oy })
        }
        draw()
        onComplete?.()
        return
      }

      const steps = 30
      let step    = 0

      const tick = () => {
        const t      = step / steps
        const eased  = 1 - Math.pow(1 - t, 3) // ease-out cubic

        if (targetSection) {
          const dir    = sectionDirections[targetSection]
          const len    = Math.hypot(dir.x, dir.y) || 1
          const ux     = dir.x / len
          const uy     = dir.y / len

          pointsRef.current.forEach((point) => {
            const fx  = point.ox - meshGeometry.centerX
            const fy  = point.oy - meshGeometry.centerY
            const proj = (fx * ux + fy * uy) / meshGeometry.radius
            const dist = Math.hypot(fx, fy) / meshGeometry.radius
            const inf  = Math.min(1, Math.max(0, Math.max(0, proj) * 0.7 + dist * 0.18))
            const tx   = point.ox + ux * strength * inf
            const ty   = point.oy + uy * strength * inf
            point.x    = point.ox + (tx - point.ox) * eased
            point.y    = point.oy + (ty - point.oy) * eased
          })
        } else {
          pointsRef.current.forEach((p) => {
            p.x += (p.ox - p.x) * 0.16
            p.y += (p.oy - p.y) * 0.16
          })
        }

        draw()
        step += 1
        if (step <= steps) {
          animationRef.current = window.requestAnimationFrame(tick)
        } else {
          onComplete?.()
        }
      }

      animationRef.current = window.requestAnimationFrame(tick)
    },
    [draw, prefersReducedMotion],
  )

  // Vuelve a la deformación de la sección activa tras soltar un drag
  const snapBack = useCallback(() => {
    animateToState(pulledSectionRef.current, faceMotion.pullStrength)
  }, [animateToState])

  // ── Reacciona al cambio de sección ────────────────────────────────────────
  useEffect(() => {
    activeSectionRef.current = activeSection
    pulledSectionRef.current = activeSection

    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      applyDirectionalPull(activeSection, pointsRef.current, meshGeometry, faceMotion.pullStrength * 0.4)
      draw()
      return
    }

    animateToState(activeSection, faceMotion.pullStrength)
  }, [activeSection, animateToState, draw])

  // ── Carga de imagen portrait ───────────────────────────────────────────────
  useEffect(() => {
    if (!portraitSrc) { imageRef.current = null; draw(); return }
    const img    = new Image()
    img.decoding = 'async'
    img.onload   = () => { imageRef.current = img; draw() }
    img.src      = portraitSrc
  }, [draw, portraitSrc])

  // ── Eventos de puntero ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const toCanvas = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - r.left) / r.width)  * canvasSize,
        y: ((e.clientY - r.top)  / r.height) * canvasSize,
      }
    }

    const nearestPoint = (pos: { x: number; y: number }) => {
      let best = Number.POSITIVE_INFINITY
      let idx: number | null = null
      visibleControlPoints.forEach((i) => {
        const p = pointsRef.current[i]
        const d = Math.hypot(p.x - pos.x, p.y - pos.y)
        if (d < best) { best = d; idx = i }
      })
      return best < 36 ? idx : null
    }

    const checkSnap = (pos: { x: number; y: number }) => {
      const hit = snapZones.find(
        (z) => Math.hypot(pos.x - z.x, pos.y - z.y) < 36,
      )
      if (hit && hit.section !== activeSectionRef.current) {
        draggingRef.current = null
        onSelect(hit.section)
      }
    }

    const onDown = (e: PointerEvent) => {
      const pos = toCanvas(e)
      draggingRef.current = nearestPoint(pos)
      if (draggingRef.current !== null) {
        canvas.setPointerCapture(e.pointerId)
        if (animationRef.current) window.cancelAnimationFrame(animationRef.current)
      }
      draw()
    }

    const onMove = (e: PointerEvent) => {
      if (draggingRef.current === null) return
      const pos = toCanvas(e)
      const pt  = pointsRef.current[draggingRef.current]
      pt.x = Math.max(-16, Math.min(canvasSize + 16, pos.x))
      pt.y = Math.max(-16, Math.min(canvasSize + 16, pos.y))
      draw()
      checkSnap(pos)
    }

    const onUp = () => {
      if (draggingRef.current === null) return
      draggingRef.current = null
      snapBack()
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup',   onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('lostpointercapture', onUp)
    window.addEventListener('resize', draw)

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup',   onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('lostpointercapture', onUp)
      window.removeEventListener('resize', draw)
    }
  }, [draw, onSelect, snapBack, visibleControlPoints])

  useEffect(() => () => {
    if (animationRef.current) window.cancelAnimationFrame(animationRef.current)
  }, [])

  return { canvasRef }
}