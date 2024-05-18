import React from 'react';
import { Palette } from '../lib/WebHelpers';
import { rgbToHex } from '../lib/ColorHelpers';

export function CopiedParticle(props: {
  palette: Palette;
  animating: boolean;
  setAnimating: (newState: boolean) => void;
}) {
  const light = rgbToHex(props.palette.light);
  const dark = rgbToHex(props.palette.dark);

  return (
    <div
      className={`${props.animating && 'animate-rise'} fixed flex w-[70px] rounded-md bg-[var(--lightCol)] px-1 text-[var(--darkCol)] opacity-0`}
      STYLE={`--lightCol:${light}; --darkCol:${dark}`} // ignore ts, capitalizing "style" so the string gets passed through unchanged by react
      onAnimationEnd={() => props.setAnimating(false)}
    >
      Copied!
    </div>
  );
}
