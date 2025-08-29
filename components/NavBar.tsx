'use client'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LogOut, User, Home, BookOpen, Music } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Home size={24} />
            Biblioteca Digital
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/libros" className="flex items-center gap-2 hover:text-blue-200">
              <BookOpen size={20} />
              Libros
            </Link>
            
            <Link href="/cds" className="flex items-center gap-2 hover:text-blue-200">
              <Music size={20} />
              CDs
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-2">
                  <User size={20} />
                  {user?.name}
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
        </div>
      </div>
    </nav>
  )
}