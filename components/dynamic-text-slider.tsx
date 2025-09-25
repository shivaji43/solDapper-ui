import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatedText } from "./ui/animated-underline-text-one";
/**
 * Slider constants
 */
const MIN_RANGE = 50; // px – minimum gap between the two handles
const ROTATION_DEG = -2.76; // matches CSS transform
const THETA = ROTATION_DEG * (Math.PI / 180);
const COS_THETA = Math.cos(THETA);
const SIN_THETA = Math.sin(THETA);

/** Utility */
const clamp = (v: number, min: number, max: number): number => Math.min(Math.max(v, min), max);

/**
 * The visible heading that houses the range‑slider.
 * Width is measured from an off‑screen copy of the text so that the label
 * always clips precisely, regardless of font‑loading or window size.
 */
function TitleComponent() {
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const [textWidth, setTextWidth] = useState(408); // sensible default until measured

  // Re‑measure whenever fonts load or the viewport resizes
  useEffect(() => {
    const measure = () => setTextWidth(measureRef.current?.clientWidth ?? 408);
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (measureRef.current) ro.observe(measureRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-[300px] bg-transparent text-white flex flex-col items-center justify-center text-center  font-sans">
      <div className="max-w-5xl">
        {/* <h1 className="font-bold tracking-tighter text-5xl text-black dark:text-white md:text-7xl">
          The Open Source
        </h1> */}
        <AnimatedText
            text="Sol-Dapper "
            textClassName="text-5xl font-bold mb-2 font-sans"
            underlinePath="M 0,10 Q 75,0 150,10 Q 225,20 300,10"
            underlineHoverPath="M 0,10 Q 75,20 150,10 Q 225,0 300,10"
            underlineDuration={1.5}
          />
        
        {/* Hidden copy for width‑measurement. Font size must match the visible text in the slider. */}
        <span
          ref={measureRef}
          className="absolute -left-[9999px] px-4 whitespace-nowrap font-bold tracking-tighter text-5xl text-black dark:text-white md:text-7xl"
        >
          Video Editor
        </span>
        
        {/* Range‑slider container */}
        <div className="flex justify-center gap-4 mt-4 md:mt-6">
          <OpenSourceSlider width={textWidth} />
        </div>

        {/* Subheading */}
        <p className="mt-8 text-lg md:text-xl max-w-3xl mx-auto text-gray-400">
          A v0-like platform for generating and running Solana applications instantly in the browser. AI-powered generation creates complete Solana dApps from natural language prompts and runs them immediately using WebContainer—no deployment delays, no complex setup.
        </p>

        {/* "Get Started Now" button has been removed */}
      </div>
    </div>
  );
}

/**
 * A two‑handle slider that is itself rotated.
 * The rotation angle now changes dynamically based on handle positions.
/**
 * Dragging is projected onto this rotated axis so the handles feel natural.
 */
function OpenSourceSlider({
  width: initialWidth = 0,
  height = 70,
  handleSize = 28,
  onChange = undefined,
}: {
  width?: number;
  height?: number;
  handleSize?: number;
  onChange?: (args: { left: number; right: number; range: number }) => void;
}) {
  // Adjusted height to better accommodate larger text
  const width = initialWidth > 0 ? initialWidth + 35 : 0;

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(width);
  type DragHandle = "left" | "right";
  const [draggingHandle, setDraggingHandle] = useState<DragHandle | null>(null);
  // State to hold the dynamic rotation angle
  const [dynamicRotation, setDynamicRotation] = useState(ROTATION_DEG);

  const leftRef = useRef(left);
  const rightRef = useRef(right);
  type DragState = {
    handle: DragHandle;
    startX: number;
    startY: number;
    initialLeft: number;
    initialRight: number;
  };
  const dragRef = useRef<DragState | null>(null);

  useEffect(() => {
    leftRef.current = left;
    rightRef.current = right;
    onChange?.({ left, right, range: right - left });
  }, [left, right, onChange]);
  
  // Effect to calculate and set the dynamic rotation
  useEffect(() => {
    if (width > 0) {
      const handleMidpoint = (left + right) / 2;
      const sliderCenter = width / 2;
      // Calculate deviation of the handle midpoint from the slider's absolute center
      const deviationFactor = (handleMidpoint - sliderCenter) / sliderCenter;
      // Define the maximum amount of additional tilt
      const maxAdditionalTilt = 3; 
      // Calculate the new rotation based on the deviation
      const newRotation = ROTATION_DEG + (deviationFactor * maxAdditionalTilt);
      setDynamicRotation(newRotation);
    }
  }, [left, right, width]);

  useEffect(() => setRight(width), [width]);

  const startDrag = (handle: DragHandle, e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (e.pointerId !== undefined && e.currentTarget.setPointerCapture) {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    dragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: leftRef.current,
      initialRight: rightRef.current,
    };
    setDraggingHandle(handle);
  };

  const moveDrag = useCallback(
    (e: PointerEvent) => {
      if (!dragRef.current) return;
      const { handle, startX, startY, initialLeft, initialRight } = dragRef.current;
      const dX = e.clientX - startX;
      const dY = e.clientY - startY;
      // We still project onto the *original* angle for consistent drag feel
      const projected = dX * COS_THETA + dY * SIN_THETA;
      if (handle === "left") {
        const newLeft = clamp(initialLeft + projected, 0, rightRef.current - MIN_RANGE);
        setLeft(newLeft);
      } else {
        const newRight = clamp(initialRight + projected, leftRef.current + MIN_RANGE, width);
        setRight(newRight);
      }
    },
    [width]
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDraggingHandle(null);
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", moveDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [moveDrag, endDrag]);

  const nudgeHandle = (handle: DragHandle) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowLeft" ? -10 : 10;
    if (handle === "left") {
      setLeft((prev) => clamp(prev + delta, 0, rightRef.current - MIN_RANGE));
    } else {
      setRight((prev) => clamp(prev + delta, leftRef.current + MIN_RANGE, width));
    }
  };

  return (
    <div
      className="relative select-none transition-transform duration-300 ease-out"
      style={{ width, height, transform: `rotate(${dynamicRotation}deg)` }}
    >
      <div className="absolute inset-0 rounded-2xl border border-yellow-500 pointer-events-none" />
      {(["left", "right"] as DragHandle[]).map((handle) => {
        const x = handle === "left" ? left : right - handleSize;
        const scaleClass = draggingHandle === handle ? "scale-125" : "hover:scale-110";

        return (
          <button
            key={handle}
            type="button"
            aria-label={handle === "left" ? "Adjust start" : "Adjust end"}
            onPointerDown={(e) => startDrag(handle, e)}
            onKeyDown={nudgeHandle(handle)}
            className={`z-20 absolute top-0 h-full w-7 rounded-full bg-[#262626] border border-yellow-500 flex items-center justify-center cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-transform duration-150 ease-in-out opacity-100 ${scaleClass}`}
            style={{ left: x, touchAction: "none" }}
          >
            <span className="w-1 h-8 rounded-full bg-yellow-500" />
          </button>
        );
      })}
      {/* Decreased font size for "Video Editor" text to be smaller than the main title */}
      <div
        className="flex z-10 items-center justify-center w-full h-full px-4 overflow-hidden pointer-events-none font-bold tracking-tighter text-5xl text-black dark:text-white md:text-7xl"
        style={{ clipPath: `inset(0 ${width - right}px 0 ${left}px round 1rem)` }}
      >
        AI Builder
      </div>
    </div>
  );
}

export default TitleComponent;
