"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  User,
  Home,
  BookOpen,
  Music,
  Menu,
  X,
  Clapperboard,
  Disc,
  SquareChartGantt,
  Brush,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold flex items-center gap-2"
            onClick={closeMenu}
          >
            <Home size={24} />
            <span className="hidden sm:inline">Biblioteca Digital</span>
            <span className="sm:hidden">Biblioteca</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/libros"
              className="flex items-center gap-2 hover:text-blue-200"
            >
              <BookOpen size={20} />
              Libros
            </Link>

            <Link
              href="/cds"
              className="flex items-center gap-2 hover:text-blue-200"
            >
              <Music size={20} />
              CDs
            </Link>

            <Link
              href="/videoteca"
              className="flex items-center gap-2 hover:text-blue-200"
            >
              <Clapperboard size={20} />
              Videoteca
            </Link>

            <Link
              href="/cd-rom"
              className="flex items-center gap-2 hover:text-blue-200"
            >
              <Disc size={20} />
              CD-ROM
            </Link>

            <Link
              href="/revistas"
              className="flex items-center gap-2 hover:text-blue-200"
            >
              <SquareChartGantt size={20} />
              Revistas
            </Link>

            <Link
              href="/arte"
              className="flex items-center gap-2 hover:text-blue-200"
            >
              <Brush size={20} />
              Cuadros y Esculturas
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-2">
                  <User size={20} />
                  {user?.username}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile Auth/User Info */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated ? (
              <span className="flex items-center gap-1 text-sm">
                <User size={16} />
                {user?.username}
              </span>
            ) : null}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 hover:bg-blue-700 rounded"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700 border-t border-blue-500">
            <div className="px-4 py-2 space-y-2">
              <Link
                href="/libros"
                className="flex items-center gap-2 py-2 hover:text-blue-200"
                onClick={closeMenu}
              >
                <BookOpen size={20} />
                Libros
              </Link>

              <Link
                href="/cds"
                className="flex items-center gap-2 py-2 hover:text-blue-200"
                onClick={closeMenu}
              >
                <Music size={20} />
                CDs
              </Link>

              <Link
                href="/videoteca"
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <Clapperboard size={20} />
                Videoteca
              </Link>

              <Link
                href="/cd-rom"
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <Disc size={20} />
                CD-ROM
              </Link>

              <Link
                href="/revistas"
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <SquareChartGantt size={20} />
                Revistas
              </Link>

              <Link
                href="/arte"
                className="flex items-center gap-2 hover:text-blue-200"
              >
                <Brush size={20} />
                Cuadros y Esculturas
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-2 py-2 text-left w-full hover:text-blue-200"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 py-2 hover:text-blue-200"
                  onClick={closeMenu}
                >
                  <User size={20} />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
