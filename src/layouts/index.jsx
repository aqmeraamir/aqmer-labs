import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Admin(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentParentRoute, setCurrentParentRoute] = React.useState("Home");
  const [currentChildRoute, setCurrentChildRoute] = React.useState("");

  

  React.useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true)
    );
  }, []);


const getActiveRoute = React.useCallback((routes, pathname = location.pathname) => {
  let parentName = "Home";
  let childName = "";

  const findRoute = (routesList, parent = null) => {
    for (let i = 0; i < routesList.length; i++) {
      const route = routesList[i];
      
      const fullPath = `/${route.path}`.replace(/\/+/g, "/");
      if (pathname.includes(fullPath)) {
        if (route.children) {
          const childMatch = findRoute(route.children, route.name);
          if (childMatch) return childMatch;
        }

        return { parent: parent || route.name, child: parent ? route.name : "" };
      }
    }
    return null;
  };

  const match = findRoute(routes);
  if (match) {
    parentName = match.parent;
    childName = match.child;
  }

  setCurrentParentRoute(parentName);
  setCurrentChildRoute(childName);
}, [location.pathname]);


  React.useEffect(() => {
    getActiveRoute(routes);
  }, [getActiveRoute]);


  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].secondary;
      }
    }
    return activeNavbar;
  };

const getRoutes = (routes, basePath = "") => {
  return routes.flatMap((route, key) => {
    const fullPath = `${basePath}/${route.path}`.replace(/\/+/g, "/");

    const thisRoute = route.component ? (
      <Route path={fullPath} element={route.component} key={fullPath} />
    ) : null;

    const childRoutes = route.children
      ? getRoutes(route.children, fullPath)
      : [];

    return [thisRoute, ...childRoutes].filter(Boolean);
  });
};

  document.documentElement.dir = "ltr";
  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {/* Navbar & Main Content */}
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        {/* Main Content */}
        <main
          className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          {/* Routes */}
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText={"Horizon UI Tailwind React"}
              parent={currentParentRoute}
              child = {currentChildRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}

                <Route
                  path="/"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
