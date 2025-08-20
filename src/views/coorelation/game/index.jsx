import GameChart from "views/coorelation/game/components/GameChart";

const Game = () => {
  return (
    <div>
        <div className="mt-1 text-center text-sm text-gray-500">
          Credit to <a href="https://i-am.cool/maths/game.html" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">i-am.cool/maths</a>
        </div>

        {/* Game */}
        <div className="mt-0 grid grid-cols-1 min-h-[500px] max-w-[2500px]">
          <GameChart />
        </div>
    </div>
  );
};

export default Game;
