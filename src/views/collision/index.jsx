// src/views/collision/index.jsx
import React from "react";
import Card from "components/card";
import CollisionSimulator from "./components/CollisionSimulator";

const Collision = () => {
  return (
    <div>
      <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
        <div className="mb-auto flex items-center justify-between px-6">
          <h2 className="text-lg font-bold text-navy-700 dark:text-white">
            
          </h2>
          <p className="text-sm text-navy-400 dark:text-white/60">
            2D circle collision demo — click to add particles
          </p>
        </div>

        <div className="w-full" style={{ height: "640px" }}>
          <CollisionSimulator />
        </div>
      </Card>
    </div>
  );
};

export default Collision;
