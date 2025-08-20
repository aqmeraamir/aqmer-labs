import React from "react";

// Page Imports
import Home from "views/home";
import Coorelation from "views/coorelation/simulator";
import Game from "views/coorelation/game";


// import
import {
  MdHome,
} from "react-icons/md";

import {
  VscGraphScatter
} from "react-icons/vsc"

const routes = [
  {
    name: "Home",
    layout: "/",
    path: "home",
    icon: <MdHome className="h-6 w-6" />,
    component: <Home />,

  },

  {
  name: "Coorelation",
  layout: "/",
  path: "coorelation",
  icon: <VscGraphScatter className="h-6 w-6" />,
  component: <Coorelation/>,
  defaultChild: "coorelation/simulator",

  children: [
      {
        name: "Simulator",
        layout: "/",
        path: "simulator",
        component: <Coorelation/>,
      },
      {
        name: "Game",
        layout: "/",
        path: "game",
        component: <Game/>,
      },
    ],
  },  

 
];
export default routes;
