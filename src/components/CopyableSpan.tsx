import React, { useState } from 'react';
import { copyTextToClipboard } from '../lib/BrowserHelpers';
import { rgbToHex, rgbaToHex } from '../lib/ColorHelpers';
import { CopiedParticle } from './CopiedParticle';
import { Palette } from '../lib/WebHelpers';
import { State } from '../lib/ReactHelpers';

export function CopyableSpan(props: { palette: Palette; text: string }) {
  const [animating, setAnimating]: State<boolean> = useState(false);

  const light = rgbToHex(props.palette.light);
  const dark = rgbToHex(props.palette.dark);

  return (
    <>
      <span
        className="cursor-pointer rounded border-2 border-[var(--lightCol)] p-0.5 font-mono transition hover:bg-[var(--lightCol)] hover:text-[var(--darkCol)] active:bg-[var(--darkCol)] active:text-[var(--lightCol)]"
        onClick={() => {
          copyTextToClipboard(props.text);
          setAnimating(true);
        }}
        STYLE={`--lightCol:${light}; --darkCol:${dark}`} // ignore ts, capitalizing "style" so the string gets passed through unchanged by react
      >
        {props.text}
      </span>
      <CopiedParticle
        palette={props.palette}
        animating={animating}
        setAnimating={setAnimating}
      />
    </>
  );
}
