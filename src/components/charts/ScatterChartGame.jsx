import React, { useRef, useState, useEffect } from 'react';
import { scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Line } from '@visx/shape';
import useMeasure from 'react-use-measure';
import { motion, AnimatePresence } from 'framer-motion';

const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const xDomain = [0, 10];
const yDomain = [0, 10];

export function calculateRegression(points) {
  const n = points.length;
  if (n < 2) return null;

  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;

  let numerator = 0;
  let denominator = 0;
  let corrNumerator = 0;
  let xVar = 0;
  let yVar = 0;

  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    numerator += dx * dy;
    denominator += dx * dx;

    corrNumerator += dx * dy;
    xVar += dx ** 2;
    yVar += dy ** 2;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = meanY - slope * meanX;
  const r =
    xVar === 0 || yVar === 0 ? 0 : corrNumerator / Math.sqrt(xVar * yVar);

  return { slope, intercept, r };
}

const ScatterChartGame = ({
  resetTrigger,
  points,
  setPoints,
  isInteractive = true,
  sampleSize = null, 
}) => {
  const [prevResetTrigger, setPrevResetTrigger] = useState(null);

  useEffect(() => {
    if (resetTrigger !== prevResetTrigger) {
      setPoints([]);
      setPrevResetTrigger(resetTrigger);
    }
  }, [resetTrigger, prevResetTrigger, setPoints]);

  const svgRef = useRef(null);
  const [ref, bounds] = useMeasure();
  const width = bounds.width || 500;
  const height = bounds.height || 500;

  const isDarkMode = document.documentElement.classList.contains('dark');
  const axisColor = isDarkMode ? 'white' : 'black';
  const backgroundColor = isDarkMode ? '#1e293b' : '#fff';

  const xScale = scaleLinear({
    domain: xDomain,
    range: [margin.left, width - margin.right],
  });

  const yScale = scaleLinear({
    domain: yDomain,
    range: [height - margin.bottom, margin.top],
  });

  const handleClick = (event) => {
    if (!isInteractive) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const dataX = xScale.invert(x);
    const dataY = yScale.invert(y);
    setPoints([...points, { x: dataX, y: dataY }]);
  };

  const regression = calculateRegression(points);

  return (
    <div ref={ref} className="w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onClick={handleClick}
        style={{
          background: backgroundColor,
          borderRadius: '8px',
        }}
      >
        <AxisBottom
          top={height - margin.bottom}
          scale={xScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 12,
            textAnchor: 'middle',
          })}
        />
        <AxisLeft
          left={margin.left}
          scale={yScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 12,
            textAnchor: 'end',
            dx: '-0.25em',
          })}
        />

        <AnimatePresence>
          {points.map((p, i) => (
            <motion.circle
              key={i}
              initial={{
                cx: xScale(p.x),
                cy: 0,
                r: 0,
                opacity: 0,
              }}
              animate={{
                cy: yScale(p.y),
                r: 5,
                opacity: 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              fill="dodgerblue"
            />
          ))}
        </AnimatePresence>

        {regression && (
          <Line
            from={{
              x: xScale(xDomain[0]),
              y: yScale(regression.slope * xDomain[0] + regression.intercept),
            }}
            to={{
              x: xScale(xDomain[1]),
              y: yScale(regression.slope * xDomain[1] + regression.intercept),
            }}
            stroke="red"
            strokeWidth={2}
            strokeDasharray="6,4"
          />
        )}
      </svg>

      {regression && (
      <div className="text-sm -mt-1 text-navy-700 dark:text-white">
        r = {regression.r.toFixed(4)}
        {sampleSize !== null && `, n = ${sampleSize}`}
      </div>
      )}
    </div>
  );
};

export default ScatterChartGame;
