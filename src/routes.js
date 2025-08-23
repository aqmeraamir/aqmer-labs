import React from "react";

// Page Imports
import Home from "views/home";
import Coorelation from "views/coorelation/simulator";
import Game from "views/coorelation/game";
import Collision from "views/collision";


// import
import {
  MdHome,
} from "react-icons/md";

import {
  VscGraphScatter
} from "react-icons/vsc"

import { 
  PiMeteorFill
 } from "react-icons/pi";

const routes = [
  {
    name: "Home",
    layout: "/",
    path: "home",
    icon: <MdHome className="h-6 w-6" />,
    component: <Home />,

  },

  {
    name: "Collision Simulator",
    layout: "/",
    path: "collision-simulator",
    icon: <PiMeteorFill className="h-6 w-6" />,
    component: <Collision/>,
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
