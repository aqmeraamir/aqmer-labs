import Banner from "./components/Banner";
import Img1 from "assets/img/cards/collisions.png";
import Img2 from "assets/img/cards/correlation.png";

import Card from "components/card/Card";

const Home = () => {
  return (
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        {/* Banner */}
        <br></br>
        <Banner />

        {/* Home Page Header */}
        <br></br>
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Simulators / Tools
          </h4>
        </div>

        {/* Cards */}
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Card
            title="Collisions"
            author="Simulator"
            image={Img1}
            link="/collision-simulator"
          />

          <Card
            title="Correlation"
            author="Distribution Simulator & Game"
            image={Img2}
            link="/correlation"
          />
        </div>

      </div>
    
  );
};

export default Home;
