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

        {/* Simulators/Tools */}
        <br></br>
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Simulators / Tools
          </h4>
        </div>

        
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

        {/* Other Projects */}
        <br></br>
        <br></br>


        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Other Projects
          </h4>
        </div>

   
      <div className="px-4">
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { name: "Regent Galaxy", link: "https://galaxy.regentuniverse.com" },
            { name: "U-Net for MRI Image Segmentation", link: "https://github.com/aqmeraamir/UNet" },
            { name: "Chess Engine (C++)", link: "https://github.com/aqmeraamir/chess-bot" },
            { name: "MLP Neural Network for Digit Recognition", link: "https://github.com/aqmeraamir/digit-recogniser" },
            { name: "Astroventure - Unity 2D Platformer", link: "https://github.com/aqmeraamir/Astroventure" },
          ].map((project) => (
            <li key={project.name}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group flex items-center
                  px-3 py-3 rounded-md
                  text-lg font-medium
                  text-navy-800 

                  hover:bg-slate-100 hover:text-slate-900

                  transition-all duration-200
                "
              >
                {/* Left dot */}
                <span
                  className="
                    mr-3 h-1.5 w-1.5 rounded-full
                    bg-slate-400
                    group-hover:bg-slate-900
                    dark:group-hover:bg-white
                    transition-colors
                  "
                />

                {/* Project name */}
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {project.name}
                </span>

                {/* External link icon */}
                <span
                  className="
                    ml-8
                    opacity-0
                    translate-x-1
                    group-hover:opacity-100
                    group-hover:translate-x-0
                    transition-all
                  "
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 3h7m0 0v7m0-7L10 14"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5v14h14v-5"
                    />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>


      


      </div>
    
  );
};

export default Home;
