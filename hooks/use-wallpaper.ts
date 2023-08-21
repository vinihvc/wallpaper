import React from 'react'

// Keeping the keys in a specific order to avoid issues when encoding/decoding
// the data.
const keysReference = [
  'ampl',
  'hueIncrement',
  'hueStart',
  'layers',
  'light',
  'lightIncrement',
  'offset',
  'offsetIncrement',
  'sat',
  'segments',
  'wl',
]

/**
 * Generate a set of randomized values to create a wallpaper from.
 */
export function generateValues(width: number) {
  // line segments (either few, or fluent lines (200))
  const segments = Math.random() < 0.5 ? 1 + Math.floor(9 * Math.random()) : 200
  // wavelength
  const wl = width / (5 + 15 * Math.random())

  // other random values
  return {
    segments,
    wl,
    layers: 3 + Math.floor(10 * Math.random()),
    hueStart: 360 * Math.random(),
    hueIncrement: 20 - 40 * Math.random(),
    ampl: 0.1 * wl + 0.9 * wl * Math.random(),
    offset: width * Math.random(),
    offsetIncrement: width / 20 + (width / 10) * Math.random(),
    sat: 15 + 35 * Math.random(),
    light: 15 + 45 * Math.random(),
    lightIncrement:
      Math.random() < 0.5 ? 2 + 4 * Math.random() : -(2 + 4 * Math.random()),
  }
}

/**
 * Parses an base64 encoded string to get all the variables for a wallpaper.
 * See "encodeValues" for the content.
 */
export function getValuesFromBase64(encoded: string) {
  const data = window.atob(encoded)
  // Quick validation for malformed "share" query parameter
  if (data.match(/,/g)!.length !== 10) {
    return null
  }
  // Should have sorted keys based on "keysReference"
  const values = data.split(',')
  const mappedValues = keysReference.reduce(
    (obj, key, index) => ({
      ...obj,
      [key]: Number(values[index]),
    }),
    {},
  )
  return mappedValues
}

export const useWallpaper = (canvas: React.RefObject<HTMLCanvasElement>) => {
  const [url, setUrl] = React.useState<string>('')

  const generateWallpaper = () => {
    if (!canvas.current) return

    const ctx = canvas.current.getContext('2d')!
    const width = 3840
    const height = 2160

    const values = generateValues(width)

    const {
      segments,
      layers,
      hueStart,
      hueIncrement,
      wl,
      ampl,
      offset,
      offsetIncrement,
      sat,
      light,
      lightIncrement,
    } = values

    ctx.fillStyle = 'hsl( ' + hueStart + ', ' + sat + '%, ' + light + '% )'
    ctx.fillRect(0, 0, width, height)

    for (let l = 0; l < layers; l++) {
      let h = hueStart + (l + 1) * hueIncrement
      let s = sat
      let v = light + (l + 1) * lightIncrement
      ctx.fillStyle = 'hsl( ' + h + ', ' + s + '%, ' + v + '% )'
      ctx.beginPath()
      let layerOffset = offset + offsetIncrement * l
      let offsetY = (l + 0.5) * (height / layers)
      let startY = offsetY + ampl * Math.sin(layerOffset / wl)
      ctx.moveTo(0, startY)
      for (let i = 0; i <= segments; i++) {
        let x = i * (width / segments)
        ctx.lineTo(x, startY + ampl * Math.sin((layerOffset + x) / wl))
      }
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.lineTo(0, startY)
      ctx.fill()
    }

    setUrl(canvas.current.toDataURL())
  }

  return { generateWallpaper, url }
}
