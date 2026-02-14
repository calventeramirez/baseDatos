"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import { Libro } from "@/app/type/libro";

interface PaginatedResponse {
  results: Libro[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function LibrosPage() {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Libro[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const booksPerPage = 10;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

  // 👇 DEBUG: Ver cuándo cambia currentPage
  console.log("🔵 Render - currentPage:", currentPage);

  useEffect(() => {
    // 👇 DEBUG: Ver cuándo se ejecuta el useEffect
    console.log("🟢 useEffect ejecutado - currentPage:", currentPage, "searchTerm:", searchTerm);
    
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: booksPerPage.toString(),
        });

        if (searchTerm.trim()) {
          params.append("search", searchTerm);
        }

        const url = `${API_BASE}/libros/?${params}`;
        console.log("🌐 Fetching:", url);

        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data: PaginatedResponse = await res.json();
        
        console.log("📦 Data recibida:", data);

        setBooks(data.results);
        setTotalPages(data.total_pages);
        setTotalItems(data.total);
      } catch (error) {
        console.error("❌ Error al cargar los libros:", error);
        setBooks([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, searchTerm]);

  const handleDelete = async (bookId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/libros/${bookId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
        setTotalItems((prev) => prev - 1);
        
        if (books.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: booksPerPage.toString(),
          });
          if (searchTerm.trim()) params.append("search", searchTerm);
          
          const reloadRes = await fetch(`${API_BASE}/libros/?${params}`);
          const data: PaginatedResponse = await reloadRes.json();
          setBooks(data.results);
          setTotalPages(data.total_pages);
        }
        
        console.log("Libro eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el libro");
      }
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      alert("Error al eliminar el libro. Por favor, intenta de nuevo.");
    }
  };

  const handleSearch = (term: string) => {
    console.log("🔍 handleSearch llamado con:", term);
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    console.log("⬅️ goToPreviousPage - currentPage antes:", currentPage);
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      console.log("⬅️ Nueva página:", newPage);
      return newPage;
    });
  };

  const goToNextPage = () => {
    console.log("➡️ goToNextPage - currentPage antes:", currentPage);
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, totalPages);
      console.log("➡️ Nueva página:", newPage);
      return newPage;
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => {
            console.log("🔢 Click en página 1");
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNum = i;
      pages.push(
        <button
          key={i}
          onClick={() => {
            console.log(`🔢 Click en página ${pageNum}`);
            setCurrentPage(pageNum);
          }}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => {
            console.log(`🔢 Click en última página ${totalPages}`);
            setCurrentPage(totalPages);
          }}
          className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

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

      <div className="mb-6">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Buscar por título o autor..."
        />
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando libros...</p>
        </div>
      )}

      {!loading && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
            >
              <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
                {book.fotoPortada ? (
                  <img
                    src={book.fotoPortada}
                    alt={`Portada de ${book.titulo}`}
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

              <div className="flex-grow">
                <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                  {book.titulo}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  por <span className="font-medium">{book.autor}</span>
                </p>
              </div>

              <div className="space-y-2 mt-auto">
                <Link
                  href={`/libros/${book.id}`}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <Info size={16} />
                  Más información
                </Link>

                {isAuthenticated && (
                  <div className="flex gap-2">
                    <Link
                      href={`/libros/editar/${book.id}`}
                      className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => book.id !== undefined && handleDelete(book.id)}
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
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm
              ? "No se encontraron libros"
              : "No hay libros disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando algunos libros a tu biblioteca"}
          </p>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {renderPageNumbers()}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Siguiente
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!loading && totalItems > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {(currentPage - 1) * booksPerPage + 1}-
          {Math.min(currentPage * booksPerPage, totalItems)} de {totalItems}{" "}
          libros
        </div>
      )}
    </div>
  );
}