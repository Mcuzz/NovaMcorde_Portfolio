import type { RefObject } from 'react'

type FaceBackdropProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
}

// Versión decorativa del rostro: solo se usa en mobile, como watermark
// flotante detrás/encima del contenido con opacidad baja. No es
// interactivo (pointer-events: none) — el botón de "reset" vive en el
// MobileNav, no aquí.
export function FaceBackdrop({ canvasRef }: FaceBackdropProps) {
  return (
    <div className={"face-backdrop"} aria-hidden="true">
      <canvas ref={canvasRef} className="face-backdrop__canvas" />
    </div>
  )
}