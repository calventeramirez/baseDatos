"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plus, Info, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import { Revista } from "@/app/type/revista";

export default function RevistasPage() {
  const { isAuthenticated } = useAuth();
  const [revistas, setRevistas] = useState<Revista[]>([]);
  const [filteredRevistas, setFilteredRevistas] = useState<Revista[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const revistasPerPage = 10;

  useEffect(() => {
    const fetchRevistas = async () => {
      try {
        const res = await fetch("http://localhost:8000/revista/");
        const data = await res.json();
        setRevistas(data);
        setFilteredRevistas(data);
      } catch (error) {
        console.error("Error al cargar las revistas:", error);
      }
    };
    fetchRevistas();
  }, []);

  // Aplicar filtros cuando cambien los criterios de búsqueda
  useEffect(() => {
    let filtered = revistas;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (revista: Revista) =>
          revista.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          revista.tematica?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          revista.editorial?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRevistas(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando se aplican filtros
  }, [revistas, searchTerm]);

  // Calcular revistas para la página actual
  const indexOfLastRevista = currentPage * revistasPerPage;
  const indexOfFirstRevista = indexOfLastRevista - revistasPerPage;
  const currentRevistas = filteredRevistas.slice(indexOfFirstRevista, indexOfLastRevista);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredRevistas.length / revistasPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Navegación anterior/siguiente
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (revistaId: string | number) => {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que quieres eliminar esta revista?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/revista/${revistaId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Actualizar el estado local removiendo la revista eliminada
        setRevistas(revistas.filter((revista: Revista) => revista.id !== revistaId));
        console.log("Revista eliminada exitosamente");
      } else {
        throw new Error("Error al eliminar la revista");
      }
    } catch (error) {
      console.error("Error al eliminar la revista:", error);
      alert("Error al eliminar la revista. Por favor, intenta de nuevo.");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Revistas</h1>
        {isAuthenticated && (
          <Link
            href="/revistas/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Revista
          </Link>
        )}
      </div>

      {/* Barra de búsqueda - ocupando todo el ancho */}
      <div className="mb-6">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Buscar por título, temática o editorial..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentRevistas.map((revista) => (
          <div
            key={revista.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            {/* Imagen de portada */}
            <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
              {revista.fotoPortada ? (
                <img
                  src={revista.fotoPortada}
                  alt={`Portada de ${revista.titulo}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-2 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white">
                    <BookOpen size={32} className="text-gray-400" />
                  </div>
                  <p className="text-sm">Sin portada</p>
                </div>
              )}
            </div>

            {/* Contenido que puede variar en altura */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                {revista.titulo}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Temática:</span> {revista.tematica || "No especificada"}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Editorial:</span> {revista.editorial || "Desconocida"}
              </p>
            </div>

            {/* Botones siempre en la parte inferior */}
            <div className="space-y-2 mt-auto">
              <Link
                href={`/revistas/${revista.id}`}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Info size={16} />
                Más información
              </Link>

              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/revistas/editar/${revista.id}`}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => revista.id !== undefined && handleDelete(revista.id)}
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

      {/* Mensaje cuando no hay revistas */}
      {currentRevistas.length === 0 && filteredRevistas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm
              ? "No se encontraron revistas"
              : "No hay revistas disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando algunas revistas a tu colección"}
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
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {/* Números de página */}
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          {/* Botón Siguiente */}
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

      {/* Información de paginación */}
      {filteredRevistas.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {indexOfFirstRevista + 1}-
          {Math.min(indexOfLastRevista, filteredRevistas.length)} de{" "}
          {filteredRevistas.length} revistas
          {filteredRevistas.length !== revistas.length && ` (${revistas.length} total)`}
        </div>
      )}
    </div>
  );
}