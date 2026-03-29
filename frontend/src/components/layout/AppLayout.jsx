import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import useTheme from "../../hooks/useTheme.js";

const LogoMark = () => (
  <span className="brand-logo" aria-hidden="true">
    AV
  </span>
);

const SunIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon">
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 2.8v2.3M12 18.9v2.3M21.2 12h-2.3M5.1 12H2.8M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6M18.5 18.5l-1.6-1.6M7.1 7.1L5.5 5.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
);

const MoonIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon">
    <path
      d="M20 14.1A8.4 8.4 0 0 1 9.9 4a8.9 8.9 0 1 0 10.1 10.1Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const MenuIcon = ({ open }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={`menu-icon ${open ? "menu-icon-open" : ""}`}
  >
    <path
      d="M4 7h16M4 12h16M4 17h16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.9"
    />
  </svg>
);

const AppLayout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate(user?.role === "admin" ? "/admin/login" : "/login");
  };

  return (
    <div className="app-shell">
      <div className="topbar-wrap">
        <header className="topbar">
          <div className="brand-shell">
            <Link className="brand" to="/dashboard">
              <span className="brand-mark">
                <LogoMark />
              </span>
              <span className="brand-copy">
                <span className="brand-name">AcadVault</span>
                <span className="topbar-subtitle">
                  Student Community &amp; Notes Sharing Platform
                </span>
              </span>
            </Link>

            <div className="mobile-header-actions">
              <button
                type="button"
                className="theme-toggle mobile-theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>

              <button
                type="button"
                className="menu-toggle"
                onClick={() => setIsNavOpen((current) => !current)}
                aria-label={isNavOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isNavOpen}
              >
                <MenuIcon open={isNavOpen} />
              </button>
            </div>
          </div>

          <div className="topbar-actions">
            <nav className="nav-links nav-links-desktop">
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </button>

              {isAuthenticated ? (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/notes/upload">Upload</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                  {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                  <button type="button" className="nav-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/admin/login">Admin Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </nav>

            <div className={`mobile-nav-shell ${isNavOpen ? "mobile-nav-shell-open" : ""}`}>
              <nav className="nav-links nav-links-mobile">
                {isAuthenticated ? (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/notes/upload">Upload</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                    {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                    <button type="button" className="nav-logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/admin/login">Admin Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>
      </div>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
