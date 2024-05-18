import React, { useState } from 'react';
import { RgbColor } from 'react-colorful';
import ColorPicker from './ColorPicker';
import {
  colorToAlpha,
  findBaseColor,
  rgbToHex,
  rgbToRgba,
  rgbaClamp,
  rgbaToHex,
} from '../lib/ColorHelpers';
import { HiSwitchHorizontal, HiSun, HiOutlineMoon } from 'react-icons/hi';
import { Palette } from '../lib/WebHelpers';
import { copyTextToClipboard } from '../lib/BrowserHelpers';
import { State } from '../lib/ReactHelpers';
import { CopiedParticle } from './CopiedParticle';
import { CopyableSpan } from './CopyableSpan';

const white = { r: 255, g: 255, b: 255 };
const black = { r: 0, g: 0, b: 0 };

enum paletteValidity {
  perfect = '(perfect!)',
  recommended = '(recommended)',
  bad = '(not recommended)',
}

export default function ColorCalculator(props: {
  palette: Palette;
  onChangePalette: (newPalette: Palette) => void;
}) {
  const [twirl, setTwirl]: State<boolean> = useState(false);

  function switchColors() {
    const dark = inputDark;
    const light = inputLight;

    props.onChangePalette({
      dark: light,
      light: dark,
    });
  }

  function setLight(newLight: RgbColor) {
    props.onChangePalette({
      dark: inputDark,
      light: newLight,
    });
  }

  function setDark(newDark: RgbColor) {
    props.onChangePalette({
      dark: newDark,
      light: inputLight,
    });
  }

  const inputLight = props.palette.light;
  const inputDark = props.palette.dark;

  const fgDark = colorToAlpha(inputLight, white);
  const [bgDark, distDark] = findBaseColor(inputDark, fgDark);

  const fgLight = rgbaClamp(colorToAlpha(inputDark, black));
  const [bgLight, distLight] = findBaseColor(inputLight, fgLight);

  const light = rgbToHex(inputLight);
  const dark = rgbToHex(inputDark);

  let validDark = paletteValidity.bad;
  let validLight = paletteValidity.bad;

  if (distDark == 0) {
    // todo add wiggle room here. equality of floats is bad
    validDark = paletteValidity.perfect;
  } else if (distDark <= distLight) {
    validDark = paletteValidity.recommended;
  }

  if (distLight == 0) {
    validLight = paletteValidity.perfect;
  } else if (distLight <= distDark) {
    validDark = paletteValidity.recommended;
  }

  return (
    <div className="">
      <div className="flex flex-row items-center justify-center">
        <HiSun size={48} />
        <ColorPicker
          color={inputLight}
          onChange={setLight}
          bgCol={light}
          textCol={dark}
        />
        <button
          onClick={() => {
            switchColors();
            setTwirl(true);
          }}
        >
          <HiSwitchHorizontal
            className={`${twirl && 'animate-twirl'} size-8 transition-all hover:size-10 active:size-6`}
            onAnimationEnd={() => setTwirl(false)}
          />
        </button>
        <ColorPicker
          color={inputDark}
          onChange={setDark}
          bgCol={dark}
          textCol={light}
        />
        <HiOutlineMoon size={48} />
      </div>

      <div className="max-w-auto flex flex-row items-center justify-center text-center font-sans text-lg">
        <div className="left-0 pr-24">
          <p className="text-center font-semibold underline">
            For the dark template
          </p>
          <p>
            Foreground:{' '}
            <CopyableSpan palette={props.palette} text={rgbaToHex(fgDark)} />
          </p>
          <p>
            Background:{' '}
            <CopyableSpan
              palette={props.palette}
              text={rgbaToHex(rgbToRgba(bgDark))}
            />
          </p>
          <p>
            <i>{validDark}</i>
          </p>
        </div>

        <div className="">
          <p className="text-center font-semibold underline">
            For the light template
          </p>
          <p>
            Foreground:{' '}
            <CopyableSpan palette={props.palette} text={rgbaToHex(fgLight)} />
          </p>
          <p>
            Background:{' '}
            <CopyableSpan
              palette={props.palette}
              text={rgbaToHex(rgbToRgba(bgLight))}
            />
          </p>
          <p>
            <i>{validLight}</i>
          </p>
        </div>
      </div>
    </div>
  );
}
