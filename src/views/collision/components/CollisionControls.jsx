// src/components/collision/CollisionControls.jsx
import React from "react";

const ControlButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={
      "rounded-md px-3 py-1 text-sm border hover:shadow-sm active:scale-95 transition " +
      className
    }
  >
    {children}
  </button>
);

const CollisionControls = ({
  paused,
  onPauseToggle,
  onStep,
  onClear,
  onSpawnRandom,
  particleCount,
  setParticleCount,
  elasticity,
  setElasticity,
  gravity,
  setGravity,
  showVectors,
  setShowVectors,
  showTrails,
  setShowTrails,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <ControlButton
          onClick={onPauseToggle}
          className={paused ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"}
        >
          {paused ? "Resume" : "Pause"}
        </ControlButton>
        <ControlButton onClick={onStep}>Step</ControlButton>
        <ControlButton onClick={onClear} className="bg-red-100 text-red-600">
          Clear
        </ControlButton>
        <ControlButton onClick={() => onSpawnRandom(particleCount)}>
          Spawn {particleCount}
        </ControlButton>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2">
          <label className="text-sm">Count</label>
          <input
            type="range"
            min="1"
            max="200"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-36"
          />
          <span className="text-sm w-8 text-right">{particleCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Elasticity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={elasticity}
            onChange={(e) => setElasticity(Number(e.target.value))}
            className="w-36"
          />
          <span className="text-sm w-8 text-right">{elasticity.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Gravity</label>
          <input
            type="checkbox"
            checked={gravity}
            onChange={(e) => setGravity(e.target.checked)}
            className="accent-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Vectors</label>
          <input
            type="checkbox"
            checked={showVectors}
            onChange={(e) => setShowVectors(e.target.checked)}
            className="accent-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Trails</label>
          <input
            type="checkbox"
            checked={showTrails}
            onChange={(e) => setShowTrails(e.target.checked)}
            className="accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CollisionControls;
