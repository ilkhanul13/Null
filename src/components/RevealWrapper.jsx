import { useScrollAnimation } from "../hooks/useScrollAnimation";

const RevealWrapper = ({ children, className }) => {
  // Kita gunakan animasi hanya untuk children di dalam wrapper ini
  const { containerRef } = useScrollAnimation(".reveal-child"); 

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default RevealWrapper;