import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "gsap";

function PremiumLiquidTransition({
  firstImageSrc,
  secondImageSrc,
  numPoints = 5,
  duration = 1.5,
  className = "",
  imgClassName = ""
}) {

  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const [direction] = useState(() => {
    const modes = [
      "TOP_TO_BOTTOM",
      "BOTTOM_TO_TOP",
      "LEFT_TO_RIGHT",
      "RIGHT_TO_LEFT"
    ];
    return modes[Math.floor(Math.random() * modes.length)];
  });

  // preload image
  useEffect(() => {

    const img = new Image();
    img.src = secondImageSrc;

    img.onload = () => setIsReady(true);

  }, [secondImageSrc]);

  useLayoutEffect(() => {

    if (!isReady) return;

    const points = [];

    for (let i = 0; i < numPoints; i++) {
      points.push(100);
    }

    const ctx = gsap.context(() => {

      const tl = gsap.timeline({
        onUpdate: () => render(points),
        defaults: { ease: "power3.inOut" }
      });

      points.forEach((_, i) => {

        tl.to(
          points,
          {
            [i]: 0,
            duration: duration + Math.random() * 0.4
          },
          i * 0.05
        );

      });

    }, containerRef);

    function render(p) {

      if (!pathRef.current) return;

      let d = "";

      if (direction === "BOTTOM_TO_TOP") {

        d = `M 0 100 V ${p[0]} C`;

        for (let i = 0; i < numPoints - 1; i++) {

          const x = ((i + 1) / (numPoints - 1)) * 100;
          const cp = x - 100 / (numPoints - 1) / 2;

          d += ` ${cp} ${p[i]} ${cp} ${p[i + 1]} ${x} ${p[i + 1]}`;

        }

        d += ` V 100 H 0 Z`;

      }

      else if (direction === "TOP_TO_BOTTOM") {

        d = `M 0 0 V ${100 - p[0]} C`;

        for (let i = 0; i < numPoints - 1; i++) {

          const x = ((i + 1) / (numPoints - 1)) * 100;
          const cp = x - 100 / (numPoints - 1) / 2;

          d += ` ${cp} ${100 - p[i]} ${cp} ${100 - p[i + 1]} ${x} ${100 - p[i + 1]}`;

        }

        d += ` V 0 H 0 Z`;

      }

      else if (direction === "LEFT_TO_RIGHT") {

        d = `M 0 0 H ${100 - p[0]} C`;

        for (let i = 0; i < numPoints - 1; i++) {

          const y = ((i + 1) / (numPoints - 1)) * 100;
          const cp = y - 100 / (numPoints - 1) / 2;

          d += ` ${100 - p[i]} ${cp} ${100 - p[i + 1]} ${cp} ${100 - p[i + 1]} ${y}`;

        }

        d += ` H 0 V 0 Z`;

      }

      else {

        d = `M 100 0 H ${p[0]} C`;

        for (let i = 0; i < numPoints - 1; i++) {

          const y = ((i + 1) / (numPoints - 1)) * 100;
          const cp = y - 100 / (numPoints - 1) / 2;

          d += ` ${p[i]} ${cp} ${p[i + 1]} ${cp} ${p[i + 1]} ${y}`;

        }

        d += ` H 100 V 0 Z`;

      }

      pathRef.current.setAttribute("d", d);

    }

    return () => ctx.revert();

  }, [isReady, numPoints, duration, direction]);

  const clipId = React.useId().replace(/:/g, "");

  return (

    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >

      {/* background image */}
      {firstImageSrc && (
        <div
          className={`absolute inset-0 bg-cover bg-center ${imgClassName}`}
          style={{ backgroundImage: `url(${firstImageSrc})` }}
        />
      )}

      {/* foreground image */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${imgClassName}`}
        style={{
          backgroundImage: `url(${secondImageSrc})`,
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`
        }}
      />

      <svg className="absolute w-0 h-0">

        <defs>

          <clipPath id={clipId} clipPathUnits="objectBoundingBox">

            <path
              ref={pathRef}
              transform="scale(0.01,0.01)"
            />

          </clipPath>

        </defs>

      </svg>

    </div>

  );

}

export default PremiumLiquidTransition;