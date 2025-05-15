import InteractiveScatterDiagram from "views/coorelation/simulator/components/InteractiveScatter";


const Coorelation = () => {
  return (
    <div>
     
      {/* Charts */}
  
      <div className="mt-5 grid grid-cols-1 min-h-[500px] max-w-[2500px]">
        <InteractiveScatterDiagram />
      </div>

      
   
    </div>
  );
};

export default Coorelation;
