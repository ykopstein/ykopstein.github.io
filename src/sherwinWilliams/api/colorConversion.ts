/**
 * Downloaded from https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e on 10 Jul 2025
 * 
 * Color conversion algorithms (RGB, HSL, XYZ, LAB, LCH)
 * Derived from jQuery Color Picker Sliders by István Ujj-Mészáros
 * Licensed under the Apache License 2.0
 * https://github.com/istvan-ujjmeszaros/jquery-colorpickersliders
 */

import type { IHsl, IHsv, ILab, ILch, IRgb } from "./types"

export const rgbToHsv = (r: number, g: number, b: number): IHsv => {
    const rPrime = r / 255;
    const gPrime = g / 255;
    const bPrime = b / 255;

    const cMax = Math.max(rPrime, gPrime, bPrime);
    const cMin = Math.min(rPrime, gPrime, bPrime);
    const delta = cMax - cMin;

    const h = +
        delta === 0 ? 0 :
        cMax === rPrime ? ((gPrime - bPrime) / delta % 6) :
            cMax === gPrime ? ((bPrime - rPrime) / delta + 2) :
                ((rPrime - gPrime) / delta + 4);

    const s =
        cMax === 0 ? 0 :
            delta / cMax;

    const v = cMax;

    return {
        h: h,
        s: s,
        v: v
    };
}

export function rgbToHsl(rgb: IRgb): IHsl {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h: number, s: number, l: number = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    h = 1;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  h *= 360
  s *= 100
  l *= 100

  return { h, s, l }
}

export function hslToRgb(hsl: IHsl): IRgb {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let r, g, b

  if (s == 0) {
    r = g = b = l // achromatic
  } else {
    function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  r *= 255
  g *= 255
  b *= 255

  return { r, g, b}
}

export function rgbToXyz(rgb: IRgb): { x: number, y: number, z: number } {
  let r = rgb.r / 255
  let g = rgb.g / 255
  let b = rgb.b / 255

  if (r > 0.04045) {
    r = Math.pow(((r + 0.055) / 1.055), 2.4)
  } else {
    r = r / 12.92
  }

  if (g > 0.04045) {
    g = Math.pow(((g + 0.055) / 1.055), 2.4)
  } else {
    g = g / 12.92
  }

  if (b > 0.04045) {
    b = Math.pow(((b + 0.055) / 1.055), 2.4)
  } else {
    b = b / 12.92
  }

  r *= 100
  g *= 100
  b *= 100

  // Observer = 2°, Illuminant = D65
  const x = r * 0.4124 + g * 0.3576 + b * 0.1805
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505

  return { x, y, z}
}

export function xyzToLab(xyz: { x: number, y: number, z: number }): ILab {
  // Observer = 2°, Illuminant = D65
  let x = xyz.x / 95.047
  let y = xyz.y / 100.000
  let z = xyz.z / 108.883

  if (x > 0.008856) {
    x = Math.pow(x, 0.333333333)
  } else {
    x = 7.787 * x + 0.137931034
  }

  if (y > 0.008856) {
    y = Math.pow(y, 0.333333333)
  } else {
    y = 7.787 * y + 0.137931034
  }

  if (z > 0.008856) {
    z = Math.pow(z, 0.333333333)
  } else {
    z = 7.787 * z + 0.137931034
  }

  const l = (116 * y) - 16
  const a = 500 * (x - y)
  const b = 200 * (y - z)

  return { l, a, b }
}

export function labToLch(lab: ILab): ILch {
  const { l, a, b } = lab

  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))

  let h = Math.atan2(b, a) //Quadrant by signs
  if (h > 0) {
    h = (h / Math.PI) * 180
  } else {
    h = 360 - (Math.abs(h) / Math.PI) * 180
  }

  return { l, c, h }
}

export function lchToLab(lch: ILch): ILab {
  const { l, c, h } = lch

  const a = Math.cos(h * 0.01745329251) * c
  const b = Math.sin(h * 0.01745329251) * c

  return { l, a, b }
}

export function labToXyz(lab: ILab): { x: number, y: number, z: number } {
  const { l, a, b } = lab

  let y = (l + 16) / 116
  let x = a / 500 + y
  let z = y - b / 200

  if (Math.pow(y, 3) > 0.008856) {
    y = Math.pow(y, 3)
  } else {
    y = (y - 0.137931034) / 7.787
  }

  if (Math.pow(x, 3) > 0.008856) {
    x = Math.pow(x, 3)
  } else {
    x = (x - 0.137931034) / 7.787
  }

  if (Math.pow(z, 3) > 0.008856) {
    z = Math.pow(z, 3)
  } else {
    z = (z - 0.137931034) / 7.787
  }

  // Observer = 2°, Illuminant = D65
  x = 95.047 * x
  y = 100.000 * y
  z = 108.883 * z

  return { x, y, z }
}

export function xyzToRgb(xyz: { x: number, y: number, z: number }): IRgb {
  // Observer = 2°, Illuminant = D65
  const x = xyz.x / 100 // X from 0 to 95.047
  const y = xyz.y / 100 // Y from 0 to 100.000
  const z = xyz.z / 100 // Z from 0 to 108.883

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570

  if (r > 0.0031308) {
    r = 1.055 * (Math.pow(r, 0.41666667)) - 0.055
  } else {
    r = 12.92 * r
  }

  if (g > 0.0031308) {
    g = 1.055 * (Math.pow(g, 0.41666667)) - 0.055
  } else {
    g = 12.92 * g
  }

  if (b > 0.0031308) {
    b = 1.055 * (Math.pow(b, 0.41666667)) - 0.055
  } else {
    b = 12.92 * b
  }

  r *= 255
  g *= 255
  b *= 255

  return { r, g, b }
}
