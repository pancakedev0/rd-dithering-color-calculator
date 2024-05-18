import React, { CSSProperties } from 'react';
import { HexColorPicker, HexColorInput, RgbColor } from 'react-colorful';
import { hexToRgb, rgbToHex } from '../lib/ColorHelpers';
import { Palette } from '../lib/WebHelpers';

export default function ColorPicker(props: {
  onChange: (newColor: RgbColor) => void;
  color: RgbColor;
  bgCol: string;
  textCol: string;
}) {
  function changeHandler(newColor: string) {
    props.onChange(hexToRgb(newColor) ?? { r: 0, g: 0, b: 0 });
  }

  const color = rgbToHex(props.color);

  return (
    <div className="flex flex-col p-8 transition-all">
      <HexColorPicker color={color} onChange={changeHandler} className="pb-2" />
      <HexColorInput
        className="rounded-lg border-2 border-[var(--textCol)] bg-[var(--bgCol)] pl-1 font-mono text-[var(--textCol)] transition-all selection:focus:bg-[var(--textCol)] selection:focus:text-[var(--bgCol)]"
        color={color}
        onChange={changeHandler}
        onFocus={(e) => e.currentTarget.select()}
        prefixed
        STYLE={`--bgCol:${props.bgCol}; --textCol:${props.textCol}`} // ignore ts, capitalizing "style" so the string gets passed through unchanged by react
      />
    </div>
  );
}
