import { Home, Route } from "lucide-react";
import Routing from "./Routing";
import LandingPage from "./Landing";
import { BrowserRouter as Router, Routes, Route as RouterRoute, Link, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

const NavLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 group
        ${isActive ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'hover:bg-white/10 text-gray-400 hover:text-white'}
      `}
    >
      <Icon size={20} />
      {isActive && (
        <span className="absolute -bottom-1 w-1 h-1 bg-white rounded-full animate-pulse" />
      )}
      
      <span className="absolute top-full mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700 pointer-events-none z-50">
        {label}
      </span>
    </Link>
  );
};

const Navigation = () => {
  return (
    <nav className="fixed z-[1000] 
      /* DESKTOP CONFIG: Top Right Corner, Horizontal */
      md:top-6 md:right-6 md:left-auto md:bottom-auto md:translate-x-0 md:translate-y-0 md:w-auto md:h-auto md:flex-row md:px-4 md:py-2
      
      /* MOBILE CONFIG: Bottom Center, Horizontal */
      bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm flex-row h-16
      
      /* Shared Styles */
      bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl flex items-center justify-around gap-2"
    >
      <NavLink to="/" icon={Home} label="Home" />
      
      <div className="w-px h-8 bg-gray-800 mx-2" />
      
      <NavLink to="/routing" icon={Route} label="Quantum Router" />
    </nav>
  );
};

export default function App() {
  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <RouterRoute path="/" element={<LandingPage />} />
          <RouterRoute path="/routing" element={<Routing />} />
        </Routes>
      </Router>
      <Analytics />
    </>
  );
}