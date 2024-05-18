import React, { useState } from 'react';
import { RgbColor } from 'react-colorful';
import { State } from '../lib/ReactHelpers';
import { rgbToHex } from '../lib/ColorHelpers';
import { loadPaletteAsync, Palette } from '../lib/WebHelpers';
import { HiArrowRight } from 'react-icons/hi';

const paletteList: string[] = [
  '1bit-monitor-glow',
  'paperback-2',
  'pixel-ink',
  'bitbee',
  'noire-truth',
  'obra-dinn-ibm-8503',
  'mac-paint',
  'pastelito2',
  'knockia3310',
  'ys-neutral-green',
  'ys-flowers-and-asbestos',
  'paper-palette',
];

export default function LospecLoader(props: {
  inputLight: RgbColor;
  inputDark: RgbColor;
  onLoadPalette: (palette: Palette) => void;
}) {
  const [url, setUrl]: State<string> = useState('');

  const light = rgbToHex(props.inputLight);
  const dark = rgbToHex(props.inputDark);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    const replaced = value.replace(' ', '-');
    setUrl(replaced);
  }

  async function loadAsync(palette: string) {
    if (palette == '') return;

    const loaded = await loadPaletteAsync(palette);

    if (loaded != null) {
      props.onLoadPalette(loaded);
    }
  }

  function keyDownHandler(event: { key: string }) {
    if (event.key === 'Enter') {
      loadAsync(url);
    }
  }

  return (
    <div className="flex w-[700px] min-w-1">
      <input
        className="w-11/12 rounded-lg rounded-r-none border-2 border-[var(--lightCol)] bg-[var(--darkCol)] px-1 text-2xl text-[var(--lightCol)] transition-all placeholder:italic placeholder:text-[var(--lightCol)] placeholder:text-opacity-100 focus:bg-[var(--lightCol)] focus:text-[var(--darkCol)] selection:focus:bg-[var(--darkCol)] selection:focus:text-[var(--lightCol)] placeholder:focus:text-[var(--darkCol)]"
        type="text"
        placeholder="Enter Lospec palette URL..."
        value={url}
        onChange={handleChange}
        onKeyDown={keyDownHandler}
        onFocus={(e) => e.currentTarget.select()}
        STYLE={`--lightCol:${light}; --darkCol:${dark}`} // ignore ts, capitalizing "style" so the string gets passed through unchanged by react
      ></input>

      <div
        className="flex h-9 w-1/12 items-center justify-center rounded-r-lg border-2 border-[var(--lightCol)] bg-[var(--lightCol)] pb-1 pt-[7px] text-[var(--darkCol)] transition-all"
        STYLE={`--darkCol:${dark}; --lightCol:${light}`}
      >
        <HiArrowRight
          className="size-4 cursor-pointer transition-all hover:size-5 active:size-3"
          onClick={() => {
            loadAsync(url);
          }}
        />
      </div>
    </div>
  );
}
