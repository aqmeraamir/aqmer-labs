import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

export function SidebarLinks({ routes }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const activeRoute = (routeName) => location.pathname.includes(routeName);
  const toggleDropdown = (name) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  const handleClick = (route) => {


    if (route.children?.length > 0) {
      if (route.defaultChild) {
        navigate(`/${route.defaultChild}`);
      }
      toggleDropdown(route.name);

    } else {
      navigate(`/${route.path}`);
    }
  };

  const renderLinks = (routes) =>
    routes.map((route, index) => {
      const hasChildren = route.children?.length > 0;
      const isOpen = openDropdown === route.name;

      return (
        <div key={index} className="mb-1">
          <div className="relative flex flex-col">
            <li
              className="flex items-center px-8 py-2 hover:cursor-pointer"
              onClick={() => handleClick(route)}
            >
              <span
                className={`flex items-center ${
                  activeRoute(route.path)
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.icon || <DashIcon />}
              </span>
              <p
                className={`ml-4 flex-1 ${
                  activeRoute(route.path)
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.name}
              </p>
              {hasChildren &&
                (isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />)}
            </li>

            {isOpen && hasChildren && (
              <ul className="ml-12 mt-2 space-y-1">
                {route.children.map((child, cIndex) => (
                  <Link key={cIndex} to={`${route.path}/${child.path}`}>
                    <li
                      className={`px-2 py-1 ${
                        activeRoute(child.path)
                          ? "font-bold text-brand-200 dark:text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {child.name}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    });

  return <>{renderLinks(routes)}</>;
}

export default SidebarLinks;
