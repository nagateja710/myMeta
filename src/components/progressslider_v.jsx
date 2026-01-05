"use client";

import { useState, useRef, useEffect } from "react";

export default function ProgressSlider({
  watched = 0,
  total = 0,
  onCommit,
}) {
  const [value, setValue] = useState(watched);
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef(null);

  /* 🎨 Dynamic background */
  useEffect(() => {
    if (sliderRef.current && total > 0) {
      const percent = (value / total) * 100;
      sliderRef.current.style.background = `
        linear-gradient(
          to top,
          rgb(168, 85, 247) 0%,
          rgb(168, 85, 247) ${percent}%,
          rgb(209, 213, 219) ${percent}%,
          rgb(209, 213, 219) 100%
        )
      `;
    }
  }, [value, total]);

  /* 🔒 Lock body scroll while dragging (mobile fix) */
  useEffect(() => {
    if (dragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [dragging]);

  if (!total || total <= 0) return null;

  const percentage = Math.min(
    value >= total ? 100 : 99,
    Math.round((value / total) * 100)
  );

  const handleChange = (e) => {
    setValue(Number(e.target.value));
  };

  const startDrag = () => setDragging(true);
  const endDrag = () => {
    setDragging(false);
    onCommit?.(value);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top label */}
      <div className="text-[11px] text-gray-700 font-semibold">
        {total}
      </div>

      <div className="relative h-32 flex items-center justify-center">
        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={total}
          value={value}
          onChange={handleChange}

          /* 🟢 DRAG HANDLERS */
          onMouseDown={startDrag}
          onMouseUp={endDrag}
          onTouchStart={startDrag}
          onTouchEnd={endDrag}

          className="
            slider-vertical
            h-32
            w-2
            appearance-none
            rounded-full
            cursor-pointer
            outline-none
            touch-none   /* ⭐ THIS IS CRITICAL */
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-purple-500
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-purple-500
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-grab
          "
          style={{
            writingMode: "vertical-lr",
            direction: "rtl",
          }}
        />

        {/* Tooltip */}
        <div
          className="absolute left-4 bg-white text-purple-500 text-[10px] px-2 py-1 rounded-lg pointer-events-none shadow-lg whitespace-nowrap"
          style={{
            top: `${100 - percentage}%`,
            transform: "translateY(-50%)",
          }}
        >
          <p>{value}</p>
          {percentage}%
        </div>
      </div>

      {/* Bottom label */}
      <div className="text-[11px] text-gray-700 font-semibold">
        0
      </div>
    </div>
  );
}
