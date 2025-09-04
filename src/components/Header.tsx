import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/signup", label: "Sign Up" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/disease-detection", label: "Disease Detection" },
    { path: "/ai-assistant", label: "AI Assistant" },
  ];

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="TuberShield Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-green-700">TuberShield</span>
          </Link>

          
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;