import { useState } from "react";

export default function ProgressSlider({ form, setForm }) {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = form.progress_total > 0 
    ? Math.round((form.progress_watched / form.progress_total) * 100) 
    : 0;

  const handleSliderChange = (e) => {
    setForm((f) => ({
      ...f,
      progress_watched: parseInt(e.target.value),
    }));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative py-2">
      {/* Horizontal Layout: Slider + Total Input */}
      <div className="flex items-end gap-2">
        {/* Slider Container - Takes most space */}
        <div className="relative flex-1">
          {/* Tooltip - Shows while dragging */}
          {isDragging && (
            <div 
              className="absolute bg-violet-600 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-medium whitespace-nowrap z-10 transition-all duration-75"
              style={{
                left: `${(form.progress_watched / form.progress_total) * 100}%`,
                top: '-50px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-center">
                <div className="font-bold">{form.progress_watched} / {form.progress_total}</div>
                <div className="text-violet-200">{percentage}%</div>
              </div>
              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-violet-600 rotate-45"></div>
            </div>
          )}

          {/* Range Slider */}
          <input
            type="range"
            min="0"
            max={form.progress_total || 100}
            value={form.progress_watched || 0}
            onInput={handleSliderChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
            }}
          />

          {/* Progress Label Below Slider */}
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>0</span>
            <span className="text-violet-600 font-medium">
              {form.progress_watched || 0}
            </span>
            <span>{form.progress_total || 0}</span>
          </div>
        </div>

        {/* Total Episodes Input - Compact with label above */}
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-gray-600 text-right">Set total</label>
          <input
            type="number"
            min="0"
            placeholder="Total"
            value={form.progress_total}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                progress_total: e.target.value,
              }))
            }
            className="border px-2 py-1.5 rounded text-sm w-15 min-w-0"
          />
        </div>
      </div>

      {/* Add custom slider thumb styles */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          background: #8b5cf6;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #8b5cf6;
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
