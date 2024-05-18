import { RgbColor, RgbaColor } from 'react-colorful';

// ported to typescript from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

export function rgbIntsToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function hexToRgba(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex
  );

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4], 16),
      }
    : null;
}

// technically original code ig
export function rgbToHex(color: RgbColor) {
  return rgbIntsToHex(color.r, color.g, color.b);
}

export function rgbaIntsToHex(r: number, g: number, b: number, a: number) {
  return (
    '#' +
    componentToHex(r) +
    componentToHex(g) +
    componentToHex(b) +
    componentToHex(a)
  );
}

export function rgbaToHex(color: RgbaColor) {
  return rgbaIntsToHex(color.r, color.g, color.b, color.a);
}

export function rgbToRgba(color: RgbColor, a: number = 255): RgbaColor {
  return { r: color.r, g: color.g, b: color.b, a: a };
}

export function rgbSubtractUnclamped(left: RgbColor, right: RgbColor) {
  return {
    r: left.r - right.r,
    g: left.g - right.g,
    b: left.b - right.b,
  };
}

export function rgbAddUnclamped(left: RgbColor, right: RgbColor) {
  return {
    r: left.r + right.r,
    g: left.g + right.g,
    b: left.b + right.b,
  };
}

export function rgbDivUnclamped(left: RgbColor, right: number) {
  if (right == 0) throw new Error('Division by zero in rgbDivUnclamped');

  return {
    r: left.r == 0 ? 0 : left.r / right,
    g: left.g == 0 ? 0 : left.g / right,
    b: left.b == 0 ? 0 : left.b / right,
  };
}

export function rgbMultiplyUnclamped(left: RgbColor, right: number) {
  return {
    r: left.r * right,
    g: left.g * right,
    b: left.b * right,
  };
}

export function rgbRoundToInts(color: RgbColor) {
  return {
    r: Math.round(color.r),
    g: Math.round(color.g),
    b: Math.round(color.b),
  };
}

export function rgbEquals(left: RgbColor, right: RgbColor) {
  return left.r === right.r && left.g === right.g && left.b === right.b;
}

export function rgbDistance(colorA: RgbColor, colorB: RgbColor): number {
  // Orthogonal distance calculation
  const maxDifference = Math.max(
    Math.abs(colorA.r - colorB.r),
    Math.abs(colorA.g - colorB.g),
    Math.abs(colorA.b - colorB.b)
  );
  return maxDifference;
}

export function rgbClamp(color: RgbColor) {
  return {
    r: Math.max(Math.min(color.r, 255), 0),
    g: Math.max(Math.min(color.g, 255), 0),
    b: Math.max(Math.min(color.b, 255), 0),
  };
}

export function rgbaClamp(color: RgbaColor) {
  return {
    r: Math.max(Math.min(color.r, 255), 0),
    g: Math.max(Math.min(color.g, 255), 0),
    b: Math.max(Math.min(color.b, 255), 0),
    a: Math.max(Math.min(color.a, 255), 0),
  };
}

export function colorToAlpha(baseCol: RgbColor, alphaCol: RgbColor): RgbaColor {
  // Color to alpha, vaguely based on https://medium.com/@mcreynolds02/how-gimps-color-to-alpha-tool-works-82372367afcd
  /*
   * Series of events:
   * - Calculate the orthogonal distance between the base and the toAlpha color, and use it for the alpha (the further away the two colors are, the more opaque the final color will be)
   * - Calculate the vector between the base and the toAlpha, and extrapolate it until you hit the wall of the RGB cube
   * - Combine the color found by the vector with the alpha found by the distance for the final color
   */

  const orthoDist = rgbDistance(baseCol, alphaCol);
  const alpha = Math.round(orthoDist);

  const vector = rgbSubtractUnclamped(baseCol, alphaCol);
  const rescaled =
    orthoDist != 0 ? rgbDivUnclamped(vector, orthoDist) : { r: 0, g: 0, b: 0 }; // dodge dividing by zero if base and toAlpha are equal
  const rescaledAlphaCol = rgbDivUnclamped(alphaCol, 255);
  const positive = rgbAddUnclamped(rescaled, rescaledAlphaCol);
  const rgb = rgbRoundToInts(rgbMultiplyUnclamped(positive, 255));

  const rgba = rgbToRgba(rgb, alpha);

  return rgba;
}

export function findBaseColor(
  finalCol: RgbColor,
  layeredCol: RgbaColor
): [RgbColor, number] {
  // Takes a final color and a color layered on top of it and returns either the base rgb color and a number indicating distance from the desired color
  /*
   * algebra is bottomCol = (finalCol - alpha * topCol)/(1-alpha)
   */

  const a = layeredCol.a / 255;

  if (a >= 1) return [{ r: 0, g: 0, b: 0 }, Number.POSITIVE_INFINITY];

  const multiplied = rgbMultiplyUnclamped(layeredCol, a);
  const subtracted = rgbSubtractUnclamped(finalCol, multiplied);
  const divided = rgbDivUnclamped(subtracted, 1 - a);
  const bottomCol = rgbRoundToInts(divided);
  const clamped = rgbClamp(bottomCol);

  if (!rgbEquals(bottomCol, clamped)) {
    // calculate distance from planned bottomCol to clamped (possible) bottomCol
    const vector = rgbSubtractUnclamped(clamped, bottomCol);
    const dist = Math.hypot(vector.r, vector.g, vector.b);

    return [clamped, dist];
  }

  return [clamped, 0];
}

export function rgbLuminance(color: RgbColor) {
  const { r, g, b } = color;

  // Luminance formula from https://stackoverflow.com/a/596241
  return (r + r + b + g + g + g) / 6;
}
