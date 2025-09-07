
import { Home, Route } from "lucide-react";
import Routing from "./Routing";
import LandingPage from "./Landing";
import { BrowserRouter as Router, Routes, Route as RouterRoute, Link } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"

export default function App() {
    return <>
      <Router>
        <nav className="fixed top-20 right-2 z-[100] border-1px bg-black rounded-lg px-2 py-3 shadow-xl">
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
              <Home size={18} className="text-white" />
            </Link>
            <Link to="/routing" className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
              <Route size={18} className="text-white" />
            </Link>
          </div>
        </nav>

        <div>
          <Routes>
            <RouterRoute path="/" element={<LandingPage />} />
            <RouterRoute path="/routing" element={<Routing />} />
          </Routes>
        </div>
      </Router>
      <Analytics />
  </>
}