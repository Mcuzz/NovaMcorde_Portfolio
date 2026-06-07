import type { SectionId } from '../types/portfolio'

export type MeshPoint = {
  ox: number
  oy: number
  x: number
  y: number
}

export type MeshGeometry = {
  width: number
  height: number
  cols: number
  rows: number
  centerX: number
  centerY: number
  radius: number
}

export type Point = {
  x: number
  y: number
}

export const sectionDirections: Record<SectionId, Point> = {
  home: { x: 0, y: -1 },
  projects: { x: 1, y: -0.36 },
  skills: { x: 1, y: 0.74 },
  about: { x: 0, y: 1 },
}

export function createMeshPoints(geometry: MeshGeometry) {
  const points: MeshPoint[] = []

  for (let row = 0; row <= geometry.rows; row += 1) {
    for (let col = 0; col <= geometry.cols; col += 1) {
      const ox = (col / geometry.cols) * geometry.width
      const oy = (row / geometry.rows) * geometry.height
      points.push({ ox, oy, x: ox, y: oy })
    }
  }

  return points
}

export function pointIndex(row: number, col: number, cols: number) {
  return row * (cols + 1) + col
}

export function warpPoint(
  sourceX: number,
  sourceY: number,
  points: MeshPoint[],
  geometry: MeshGeometry,
) {
  const floatingCol = (sourceX / geometry.width) * geometry.cols
  const floatingRow = (sourceY / geometry.height) * geometry.rows
  const col = Math.min(Math.floor(floatingCol), geometry.cols - 1)
  const row = Math.min(Math.floor(floatingRow), geometry.rows - 1)
  const tx = floatingCol - col
  const ty = floatingRow - row

  const topLeft = points[pointIndex(row, col, geometry.cols)]
  const topRight = points[pointIndex(row, col + 1, geometry.cols)]
  const bottomLeft = points[pointIndex(row + 1, col, geometry.cols)]
  const bottomRight = points[pointIndex(row + 1, col + 1, geometry.cols)]

  return {
    x:
      topLeft.x * (1 - tx) * (1 - ty) +
      topRight.x * tx * (1 - ty) +
      bottomLeft.x * (1 - tx) * ty +
      bottomRight.x * tx * ty,
    y:
      topLeft.y * (1 - tx) * (1 - ty) +
      topRight.y * tx * (1 - ty) +
      bottomLeft.y * (1 - tx) * ty +
      bottomRight.y * tx * ty,
  }
}

export function movePointsTowardOrigin(points: MeshPoint[], spring: number) {
  points.forEach((point) => {
    point.x += (point.ox - point.x) * spring
    point.y += (point.oy - point.y) * spring
  })
}

export function applyDirectionalPull(
  section: SectionId,
  points: MeshPoint[],
  geometry: MeshGeometry,
  strength: number,
) {
  const direction = sectionDirections[section]
  const length = Math.hypot(direction.x, direction.y) || 1
  const unitX = direction.x / length
  const unitY = direction.y / length

  points.forEach((point) => {
    const fromCenterX = point.ox - geometry.centerX
    const fromCenterY = point.oy - geometry.centerY
    const projected = (fromCenterX * unitX + fromCenterY * unitY) / geometry.radius
    const distance = Math.hypot(fromCenterX, fromCenterY) / geometry.radius
    const edgeInfluence = Math.max(0, projected) * 0.7 + distance * 0.18
    const influence = Math.min(1, Math.max(0, edgeInfluence))

    point.x = point.ox + unitX * strength * influence
    point.y = point.oy + unitY * strength * influence
  })
}

export function drawMeshImage(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  points: MeshPoint[],
  geometry: MeshGeometry,
) {
  for (let row = 0; row < geometry.rows; row += 1) {
    for (let col = 0; col < geometry.cols; col += 1) {
      const topLeft = points[pointIndex(row, col, geometry.cols)]
      const topRight = points[pointIndex(row, col + 1, geometry.cols)]
      const bottomLeft = points[pointIndex(row + 1, col, geometry.cols)]
      const bottomRight = points[pointIndex(row + 1, col + 1, geometry.cols)]

      drawImageTriangle(ctx, image, topLeft, topRight, bottomLeft)
      drawImageTriangle(ctx, image, topRight, bottomRight, bottomLeft)
    }
  }
}

function drawImageTriangle(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  sourceA: MeshPoint,
  sourceB: MeshPoint,
  sourceC: MeshPoint,
) {
  const sourceX1 = sourceB.ox - sourceA.ox
  const sourceY1 = sourceB.oy - sourceA.oy
  const sourceX2 = sourceC.ox - sourceA.ox
  const sourceY2 = sourceC.oy - sourceA.oy
  const targetX1 = sourceB.x - sourceA.x
  const targetY1 = sourceB.y - sourceA.y
  const targetX2 = sourceC.x - sourceA.x
  const targetY2 = sourceC.y - sourceA.y
  const determinant = sourceX1 * sourceY2 - sourceX2 * sourceY1

  if (Math.abs(determinant) < 0.001) {
    return
  }

  const a = (targetX1 * sourceY2 - targetX2 * sourceY1) / determinant
  const b = (targetY1 * sourceY2 - targetY2 * sourceY1) / determinant
  const c = (targetX2 * sourceX1 - targetX1 * sourceX2) / determinant
  const d = (targetY2 * sourceX1 - targetY1 * sourceX2) / determinant
  const e = sourceA.x - a * sourceA.ox - c * sourceA.oy
  const f = sourceA.y - b * sourceA.ox - d * sourceA.oy

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(sourceA.x, sourceA.y)
  ctx.lineTo(sourceB.x, sourceB.y)
  ctx.lineTo(sourceC.x, sourceC.y)
  ctx.closePath()
  ctx.clip()
  ctx.transform(a, b, c, d, e, f)
  ctx.drawImage(image, 0, 0, 260, 260)
  ctx.restore()
}
