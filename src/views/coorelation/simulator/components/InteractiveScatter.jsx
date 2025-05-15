

import React, { useState } from 'react';
import { MdBarChart, MdPlayArrow } from 'react-icons/md';

import Card from 'components/card';
import InteractiveScatterChart, {
  calculateRegression,
} from 'components/charts/InteractiveScatterChart';
import DistributionChart from 'components/charts/DistributionChart';

const InteractiveScatterDiagram = () => {
  const [resetKey, setResetKey] = useState(0);
  const [parentPoints, setParentPoints] = useState([]);
  const [sampledPoints, setSampledPoints] = useState([]);
  const [rValues, setRValues] = useState([]);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    setParentPoints([]);
    setSampledPoints([]);
    setRValues([]);
  };

  const [sampleSize, setSampleSize] = useState(1);



  return (
    <>
      {/* Parent Population */}
      <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
        <div className="mb-auto flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-navy-700 dark:text-white">
            Parent Population
          </h2>
          <button
            onClick={handleReset}
            className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10"
          >
            <MdBarChart className="h-6 w-6" />
          </button>
        </div>
        <div className="w-full" style={{ height: 400 }}>
          <InteractiveScatterChart
            resetTrigger={resetKey}
            points={parentPoints}
            setPoints={setParentPoints}
            isInteractive={true}
          />
        </div>
      </Card>

      {/* Sample Data + Distribution */}
      <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center mt-5">
        <div className="mb-auto flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-navy-700 dark:text-white">
            Sample Data
          </h2>
          <div className="flex items-center">

          {[1, 10, 100, 1000, 100000].map((size) => (
            <button
              key={size}
              onClick={() => setSampleSize(size)}
              className={`flex items-center justify-center rounded-lg px-3 py-2 ml-3 ${
                sampleSize === size
                  ? 'bg-brand-500 text-white'
                  : 'bg-lightPrimary text-brand-500 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10'
              }`}
            >
              {size}
            </button>
          ))}

<button
  onClick={async () => {
    if (parentPoints.length === 0) return;

    let newSample = [...sampledPoints];
    let newRValues = [...rValues];

    for (let i = 0; i < sampleSize; i++) {
      const randomPoint =
        parentPoints[Math.floor(Math.random() * parentPoints.length)];

      newSample.push(randomPoint);

      const reg = calculateRegression(newSample);
      if (reg) {
        newRValues.push(reg.r);
      }

      // Update state after each step
      setSampledPoints([...newSample]);
      setRValues([...newRValues]);

      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  }}
  className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10 ml-3"
>
  <MdPlayArrow className="h-7 w-7" />
</button>


          </div>
          
        </div>
        <div className="w-full" style={{ height: 400 }}>
          <InteractiveScatterChart
            resetTrigger={resetKey}
            points={sampledPoints}
            setPoints={setSampledPoints}
            isInteractive={false}
            sampleSize={sampledPoints.length}
          />
        </div>

        {/* distribution of r's */}
        <div className="mt-12">
          <h3 className="text-md font-medium text-navy-700 dark:text-white mb-2">
            Distribution of r (correlation coefficients)
          </h3>
          <DistributionChart data={rValues} />
        </div>
      </Card>
    </>
  );
};

export default InteractiveScatterDiagram;
