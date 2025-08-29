'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { mockBooks } from '@/fakeData/mockData'
import { Plus, Info } from 'lucide-react'


export default function LibrosPage() {
  const { isAuthenticated } = useAuth()
  // const [books] = useState(mockBooks)
  const [books, setBooks] = useState([])

  useEffect(() => {
    const fetchBooks = async() => {
      try {
        const res = await fetch('http://localhost:8000/libros/')
        const data = await res.json()
        setBooks(data)
      }catch(error){
        console.error('Error al cargar los libros:', error)
      }
    }
    fetchBooks()
  } , [])
  
  const handleDelete = async (bookId:any) => {
    // Confirmar antes de eliminar
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      return
    }

    try {
      const res = await fetch(`http://localhost:8000/libros/${bookId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Actualizar el estado local removiendo el libro eliminado
        setBooks(books.filter(book => book.id !== bookId))
        console.log('Libro eliminado exitosamente')
      } else {
        throw new Error('Error al eliminar el libro')
      }
    } catch (error) {
      console.error('Error al eliminar el libro:', error)
      alert('Error al eliminar el libro. Por favor, intenta de nuevo.')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Libros</h1>
        {isAuthenticated && (
          <Link
            href="/libros/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Libro
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          console.log(book),
          <div key={book["id"]} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{book["titulo"]}</h3>
            <p className="text-gray-600 mb-4">por {book["autor"]}</p>
            
            <div className="flex justify-between items-center">
              <Link
                href={`/libros/${book["id"]}`}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 flex items-center gap-2"
              >
                <Info size={16} />
                Más información
              </Link>
              
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/libros/editar/${book["id"]}`}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(book["id"])}
                    className="text-red-600 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}