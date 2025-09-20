import InteractiveScatterDiagram from "views/correlation/simulator/components/InteractiveScatter";


const Correlation = () => {
  return (
    <div>
      {/* chart */}
      <div className="mt-5 grid grid-cols-1 min-h-[500px] max-w-[2500px]">
        <InteractiveScatterDiagram />
      </div>
    </div>
  );
};

export default Correlation;
