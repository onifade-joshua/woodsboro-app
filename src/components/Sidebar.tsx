import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiTrendingUp,
  FiUser,
  FiCreditCard,
  FiPieChart,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Logo from "./Logo";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean, setIsMobileOpen: (open: boolean) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname, setIsMobileOpen]);

  // Store collapsed state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };

  const navItems = [
    { path: "/", icon: <FiHome />, label: "Dashboard", exact: true },
    { path: "/transactions", icon: <FiCreditCard />, label: "Transactions" },
    { path: "/investments", icon: <FiTrendingUp />, label: "Investments" },
    { path: "/savings", icon: <FiPieChart />, label: "Savings" },
    { path: "/profile", icon: <FiUser />, label: "Profile" }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-gray-50 dark:bg-gray-900 opacity-70 z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-30 flex flex-col h-full w-64 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        {/* Logo */}
        <div className={`px-4 py-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <h1 className="text-2xl font-bold flex items-center">
              <Logo />
              <span className="ml-2">Woodsboro</span>
            </h1>
          )}
          {/* {isCollapsed && <Logo />} */}

          {/* Collapse toggle button - visible only on md+ screens */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-700 focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors
                ${isCollapsed ? 'justify-center' : ''}
                ${isActive
                  ? 'bg-gray-900 dark:bg-gray-700 text-white '
                  : 'text-gray-900 dark:text-white hover:bg-gray-700 hover:text-white'
                }`
              }
              end={item.exact}
            >
              <span className={`${isCollapsed ? 'text-xl' : 'mr-3'}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
} 