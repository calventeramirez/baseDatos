'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Plus, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import SearchBox from '@/components/SearchBox'
import { Libro } from '@/app/type/libro'

export default function LibrosPage() {
  const { isAuthenticated } = useAuth()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const booksPerPage = 10

  useEffect(() => {
    const fetchBooks = async() => {
      try {
        const res = await fetch('http://localhost:8000/libros/')
        const data = await res.json()
        setBooks(data)
        setFilteredBooks(data)
      }catch(error){
        console.error('Error al cargar los libros:', error)
      }
    }
    fetchBooks()
  }, [])

  // Aplicar filtros cuando cambien los criterios de búsqueda
  useEffect(() => {
    let filtered = books

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter((book: Libro) => 
        book.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }


    setFilteredBooks(filtered)
    setCurrentPage(1) // Resetear a la primera página cuando se aplican filtros
  }, [books, searchTerm])

  // Calcular libros para la página actual
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook)

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)

  // Cambiar página
  const paginate = (pageNumber:any) => setCurrentPage(pageNumber)

  // Navegación anterior/siguiente
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }
  
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
        setBooks(books.filter((book: Libro) => book.id !== bookId))
        console.log('Libro eliminado exitosamente')
      } else {
        throw new Error('Error al eliminar el libro')
      }
    } catch (error) {
      console.error('Error al eliminar el libro:', error)
      alert('Error al eliminar el libro. Por favor, intenta de nuevo.')
    }
  }

  const handleSearch = (term:any) => {
    setSearchTerm(term)
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

      {/* Barra de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchBox 
          onSearch={handleSearch}
          placeholder="Buscar por título o autor..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentBooks.map((book) => (
          <div key={book["id"]} className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full">
            
            {/* Imagen de portada */}
            <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
              {book["fotoPortada"] ? (
                <img
                  src={book["fotoPortada"]}
                  alt={`Portada de ${book["titulo"]}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <div className="w-16 h-20 mx-auto mb-2 border-2 border-gray-300 rounded flex items-center justify-center">
                    <span className="text-2xl">📖</span>
                  </div>
                  <p className="text-sm">Sin portada</p>
                </div>
              )}
            </div>
            
            {/* Contenido que puede variar en altura */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">{book["titulo"]}</h3>
              <p className="text-sm text-gray-600 mb-4">por <span className="font-medium">{book["autor"]}</span></p>
            </div>
            
            {/* Botones siempre en la parte inferior */}
            <div className="space-y-2 mt-auto">
              <Link
                href={`/libros/${book["id"]}`}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Info size={16} />
                Más información
              </Link>
              
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/libros/editar/${book["id"]}`}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(book["id"])}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm font-medium transition-colors cursor-pointer"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay libros */}
      {currentBooks.length === 0 && filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm? 'No se encontraron libros' : 'No hay libros disponibles'}
          </h3>
          <p className="text-gray-500">
            {searchTerm? 'Intenta con otros términos de búsqueda o filtros'
              : 'Comienza agregando algunos libros a tu biblioteca'
            }
          </p>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          {/* Botón Anterior */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {/* Números de página */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            )
          })}

          {/* Botón Siguiente */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Información de paginación */}
      {filteredBooks.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, filteredBooks.length)} de {filteredBooks.length} libros
          {filteredBooks.length !== books.length && ` (${books.length} total)`}
        </div>
      )}
    </div>
  )
}