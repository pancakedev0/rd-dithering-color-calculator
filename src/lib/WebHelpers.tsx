import { RgbColor } from 'react-colorful';
import { hexToRgb, rgbLuminance } from './ColorHelpers';

// ported to typescript from https://stackoverflow.com/questions/2499567/how-to-make-a-json-call-to-an-url/2499647#2499647
export const getJSON = async (url: string | URL | Request) => {
  const response = await fetch(url);
  if (!response.ok)
    // check if response worked (no 404 errors etc...)
    throw new Error(response.statusText);

  const data = response.json(); // get JSON from the response
  return data; // returns a promise, which resolves to this data value
};

export type Palette = {
  name?: string;
  author?: string;
  url?: string;
  light: RgbColor;
  dark: RgbColor;
};

type LospecResponse = {
  name: string;
  author: string;
  colors: string[];
};

export async function loadPaletteAsync(
  palette: string
): Promise<Palette | null> {
  const split = palette.split('/');
  const slug = split[split.length - 1];

  const jsonUrl = `https://lospec.com/palette-list/${slug}.json`;
  return await getJSON(jsonUrl)
    .then((json: LospecResponse) => {
      const colors = json.colors;
      let luminances: { color: RgbColor; luminance: number }[] = []; // the key number is the index of the color, the value number is the luminance

      colors.forEach((color) => {
        const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
        luminances.push({ color: rgb, luminance: rgbLuminance(rgb) });
      });

      luminances.sort((a, b) => a.luminance - b.luminance);

      const darkColor = luminances[0].color; // the color with the least luminance
      const lightColor = luminances[luminances.length - 1].color; // the color with the most luminance

      const palette = {
        name: json.name,
        author: json.author,
        url: `https://lospec.com/palette-list/${slug}`,
        light: lightColor,
        dark: darkColor,
      };

      // console.log(JSON.stringify(palette));

      return palette;
    })
    .catch(() => {
      alert(`Something went wrong when trying to load palette ${slug}`);

      return null;
    });
}
