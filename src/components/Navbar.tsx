
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Building, Users } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white";
  };

  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white text-xl font-bold">
                IndustrialCRM
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${isActive(
                    "/"
                  )}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/clients"
                  className={`rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1 ${isActive(
                    "/clients"
                  )}`}
                >
                  <Building size={16} />
                  Clients
                </Link>
                <Link
                  to="/contacts"
                  className={`rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1 ${isActive(
                    "/contacts"
                  )}`}
                >
                  <Users size={16} />
                  Contacts
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className="md:hidden py-2 flex justify-center">
          <div className="flex space-x-2">
            <Link
              to="/"
              className={`rounded-md px-3 py-2 text-sm font-medium ${isActive("/")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/clients"
              className={`rounded-md px-3 py-2 text-sm font-medium ${isActive("/clients")}`}
            >
              Clients
            </Link>
            <Link
              to="/contacts"
              className={`rounded-md px-3 py-2 text-sm font-medium ${isActive("/contacts")}`}
            >
              Contacts
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
