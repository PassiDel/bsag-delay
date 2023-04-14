/**
 * A linear interpolator for hexadecimal colors
 * @param {String} pFrom
 * @param {String} pTo
 * @param {Number} pRatio
 * @example
 * // returns #7F7F7F
 * lerpColor(0x000000, 0xffffff, 0.5)
 * @returns {String}
 * Source: https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
 */
export const lerpColor = function(pFrom:number, pTo:number, pRatio:number) {
  const ar = (pFrom & 0xFF0000) >> 16,
    ag = (pFrom & 0x00FF00) >> 8,
    ab = (pFrom & 0x0000FF),

    br = (pTo & 0xFF0000) >> 16,
    bg = (pTo & 0x00FF00) >> 8,
    bb = (pTo & 0x0000FF),

    rr = ar + pRatio * (br - ar),
    rg = ag + pRatio * (bg - ag),
    rb = ab + pRatio * (bb - ab);

  // return (rr << 16) + (rg << 8) + (rb | 0);
  return `#${((rr << 16) + (rg << 8) + (rb | 0)).toString(16).padStart(6, '0').slice(-6)}`
};
export const clamp = (min: number, max: number, value: number) => Math.min(Math.max(value, min), max)

export const stringToHex = (string: string) => parseInt(string.replace(/#/g, ''), 16)
export const colors = {
  red: stringToHex('#d93c2b'),
  yellow: stringToHex('#c8d92b'),
  green: stringToHex('#2bd931')
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}