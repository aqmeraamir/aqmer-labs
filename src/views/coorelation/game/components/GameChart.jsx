import React, { useState, useEffect } from 'react';
import ScatterChartGame, { calculateRegression } from 'components/charts/ScatterChartGame';
import Card from 'components/card';

// PMCC critical values table [n]: [1-tail 5%, 2.5%, 1%, 0.5%]
const criticalTable = {
  3: [0.9877, 0.9969, 0.9995, 0.9999],
  4: [0.9000, 0.9500, 0.9800, 0.9900],
  5: [0.8054, 0.8783, 0.9343, 0.9587],
  6: [0.7293, 0.8114, 0.8822, 0.9172],
  7: [0.6694, 0.7545, 0.8329, 0.8745],
  8: [0.6215, 0.7067, 0.7887, 0.8343],
  9: [0.5822, 0.6664, 0.7498, 0.7977],
  10: [0.5494, 0.6319, 0.7155, 0.7646],
  11: [0.5214, 0.6021, 0.6851, 0.7348],
  12: [0.4973, 0.5760, 0.6581, 0.7079],
  13: [0.4762, 0.5529, 0.6339, 0.6835],
  14: [0.4575, 0.5324, 0.6120, 0.6614],
  15: [0.4409, 0.5140, 0.5923, 0.6411],
  16: [0.4259, 0.4973, 0.5742, 0.6226],
  17: [0.4124, 0.4821, 0.5577, 0.6055],
  18: [0.4000, 0.4683, 0.5425, 0.5897],
  19: [0.3887, 0.4555, 0.5285, 0.5751],
  20: [0.3783, 0.4438, 0.5155, 0.5614],
  21: [0.3687, 0.4329, 0.5034, 0.5487],
  22: [0.3598, 0.4227, 0.4921, 0.5368],
  23: [0.3515, 0.4132, 0.4815, 0.5256],
  24: [0.3438, 0.4044, 0.4716, 0.5151],
  25: [0.3365, 0.3961, 0.4622, 0.5052],
  26: [0.3297, 0.3882, 0.4534, 0.4958],
  27: [0.3233, 0.3809, 0.4451, 0.4869],
  28: [0.3172, 0.3739, 0.4372, 0.4785],
  29: [0.3115, 0.3673, 0.4297, 0.4705],
  30: [0.3061, 0.3610, 0.4226, 0.4629],
};

// possible significance value levels
const alphaOptions = [
  { value: 0.05, index: 0 },
  { value: 0.025, index: 1 },
  { value: 0.01, index: 2 },
  { value: 0.005, index: 3 },
];

// alternate hypothesis choices
const h1Options = ['< 0', '> 0', '≠ 0'];

// generate random scatter points
const getRandomPoints = (n) =>
  Array.from({ length: n }, () => ({
    x: Math.random() * 10,
    y: Math.random() * 10,
  }));


const GameChart = () => {
  const [points, setPoints] = useState([]);
  const [rValue, setRValue] = useState(0);  // coorelation coefficient
  const [alpha, setAlpha] = useState(0.05); // chosen significance value
  const [crit, setCrit] = useState(0);      // critical r value
  const [h1, setH1] = useState('< 0');      // chosen alternate hypothesis

  const [attempts, setAttempts] = useState(0);      // total answers
  const [correct, setCorrect] = useState(0);        // correct answers
  const [answered, setAnswered] = useState(false);  // lock button after answering
  const [wasCorrect, setWasCorrect] = useState(null);
  const [highlightCell, setHighlightCell] = useState(null);
  const [alphaIndex, setAlphaIndex] = useState(0);

  const resetGame = () => {
    const randomN = Math.floor(Math.random() * (30 - 3 + 1)) + 3;
    const pts = getRandomPoints(randomN);
    const reg = calculateRegression(pts);

    const alphaChoice = alphaOptions[Math.floor(Math.random() * alphaOptions.length)];
    const h1Choice = h1Options[Math.floor(Math.random() * h1Options.length)];

    setPoints(pts);
    setRValue(reg ? reg.r : 0);
    setAlpha(alphaChoice.value);
    setCrit(criticalTable[randomN][alphaChoice.index]);
    setH1(h1Choice);
    setAnswered(false);
    setHighlightCell({ n: randomN, col: alphaChoice.index });


    
    setAlphaIndex(alphaChoice.index);
    // setHighlightCell(null);
  };

  // initialise first test
  useEffect(() => {
    resetGame();
  }, []);

  // evaluate users answer
  const handleAnswer = (rejectH0) => {
    const r = rValue;
    let shouldReject = false;

    if (h1 === '< 0') shouldReject = r <= -crit;
    else if (h1 === '> 0') shouldReject = r >= crit;
    else if (h1 === '≠ 0') shouldReject = Math.abs(r) >= crit;

    const isCorrect = (rejectH0 && shouldReject) || (!rejectH0 && !shouldReject);

    setWasCorrect(isCorrect);
    setAttempts((prev) => prev + 1);
    if (isCorrect) setCorrect((prev) => prev + 1);
    setAnswered(true);

    const colIndex = (h1 === '≠ 0' ? 4 : 0) + alphaIndex;
    setHighlightCell({ n: points.length, col: colIndex });
  };

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-6 text-center mt-5">
      <h2 className="text-lg font-bold mb-4">Correlation Hypothesis Test</h2>

      {/* scatter plot */}
      <div className="w-full h-96">
        <ScatterChartGame points={points} setPoints={setPoints} isInteractive={false} sampleSize={points.length} />
      </div>

      {/* hypothesis and α info */}
      <div className="mt-4 text-left space-y-1">
        <div><strong>H0:</strong> ρ = 0</div>
        <div><strong>H1:</strong> ρ {h1}</div>
        <div><strong>α:</strong> {alpha * 100}%</div>
      </div>

      {/* answer buttons */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => handleAnswer(false)}
          disabled={answered}
          className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
        >
          Accept H0
        </button>
        <button
          onClick={() => handleAnswer(true)}
          disabled={answered}
          className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
        >
          Reject H0
        </button>

        <div className="ml-6 text-sm">
          Score: {correct} / {attempts}
        </div>
      </div>

      {/* feedback */}
      {answered && (
        <div className="mt-4 text-md font-medium">
          {wasCorrect ? 'Correct!' : 'Incorrect.'}
        </div>
      )}

      {/* reset button */}
      <button
        onClick={resetGame}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        New Test
      </button>

      {/* critical value table */}
      <div className="mt-10 max-h-96 overflow-auto border rounded-lg p-4">
        <h3 className="text-md font-bold mb-2">PMCC Critical Value Table</h3>
        <table className="w-full table-auto border-collapse text-sm text-left">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th rowSpan={2} className="border px-2 py-1 align-bottom">n</th>
              <th colSpan={4} className="border px-2 py-1 text-center">1-tail test</th>
              <th colSpan={4} className="border px-2 py-1 text-center">2-tail test</th>
            </tr>
            <tr>
              <th className="border px-2 py-1">5%</th>
              <th className="border px-2 py-1">2.5%</th>
              <th className="border px-2 py-1">1%</th>
              <th className="border px-2 py-1">0.5%</th>
              <th className="border px-2 py-1">10%</th>
              <th className="border px-2 py-1">5%</th>
              <th className="border px-2 py-1">2%</th>
              <th className="border px-2 py-1">1%</th>
            </tr>
          </thead>
          <tbody>
            {[
              [3, 0.9877, 0.9969, 0.9995, 0.9999],
              [4, 0.9000, 0.9500, 0.9800, 0.9900],
              // ...
              [30, 0.3061, 0.3610, 0.4226, 0.4629],
            ].map(([n, a, b, c, d], i) => {
              const rowHighlight = highlightCell?.n === n;

              return (
                <tr key={i} className={rowHighlight ? 'bg-gray-200' : 'odd:bg-white even:bg-gray-50'}>
                  <td className="border px-2 py-1 font-medium">{n}</td>

                  {/* 1-tail columns */}
                  {[a, b, c, d].map((val, colIdx) => {
                    const isHighlightedCell = highlightCell?.n === n && highlightCell?.col === colIdx;
                    const isColHighlight = highlightCell?.col === colIdx;

                    return (
                      <td
                        key={colIdx}
                        className={`border px-2 py-1 ${
                          isHighlightedCell
                            ? 'bg-blue-400 font-bold'
                            : isColHighlight
                            ? 'bg-gray-200'
                            : ''
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}

                  {/* 2-tail columns (derived from 1-tail) */}
                  {[(a - 0.0123), (b - 0.0219), (c - 0.0193), (d - 0.0370)].map((val, idx) => {
                    const colIdx = 4 + idx;
                    const isHighlightedCell = highlightCell?.n === n && highlightCell?.col === colIdx;
                    const isColHighlight = highlightCell?.col === colIdx;

                    return (
                      <td
                        key={idx}
                          className={`border px-2 py-1 ${
                            highlightCell?.n === n && highlightCell?.col === colIdx
                              ? answered
                                ? 'bg-blue-400 font-bold' // after answering → blue
                                : 'bg-gray-200'           // before answering → gray
                              : ''
                          }`}
                      >
                        {val.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default GameChart;
