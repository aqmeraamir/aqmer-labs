import React from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Bar } from '@visx/shape';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { bin } from 'd3-array';

const margin = { top: 20, right: 20, bottom: 30, left: 40 };

const DistributionChart = ({
  data,         
  width = 600,
  height = 200,
  binCount = 20,
}) => {
  if (!data || data.length === 0) return <p className="p-4">No data yet</p>;

  // bin them over [-1,1]
  const xScale = scaleLinear({
    domain: [-1, 1],
    range: [margin.left, width - margin.right],
  });

  const bins = bin()
    .domain(xScale.domain())
    .thresholds(binCount)(data);

  const yMax = Math.max(...bins.map(b => b.length)) || 1;
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [height - margin.bottom, margin.top],
  });

  return (
    <svg width={width} height={height} className="block mx-auto">
      <Group>
        {bins.map((binData, i) => {
          const x = xScale(binData.x0);
          const barWidth = Math.max(0, xScale(binData.x1) - xScale(binData.x0) - 1);
          const barHeight = height - margin.bottom - yScale(binData.length);
          return (
            <Bar
              key={`bar-${i}`}
              x={x}
              y={yScale(binData.length)}
              width={barWidth}
              height={barHeight}
            />
          );
        })}
      </Group>

      <AxisBottom
        top={height - margin.bottom}
        scale={xScale}
        stroke="#333"
        tickStroke="#333"
      />
      <AxisLeft
        left={margin.left}
        scale={yScale}
        stroke="#333"
        tickStroke="#333"
      />
    </svg>
  );
};

export default DistributionChart;
