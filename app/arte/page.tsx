"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plus, Info, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import { Arte } from "@/app/type/arte";

export default function ArtePage() {
  const { isAuthenticated } = useAuth();
  const [obras, setObras] = useState<Arte[]>([]);
  const [filteredObras, setFilteredObras] = useState<Arte[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const obrasPerPage = 10;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_BASE}/arte/`);
        const data = await res.json();
        setObras(data);
        setFilteredObras(data);
      } catch (error) {
        console.error("Error al cargar las obras de arte:", error);
      }
    };
    fetchObras();
  }, []);

  // Aplicar filtros cuando cambien los criterios de búsqueda
  useEffect(() => {
    let filtered = obras;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (obra: Arte) =>
          obra.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          obra.autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          obra.tematica?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredObras(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando se aplican filtros
  }, [obras, searchTerm]);

  // Calcular obras para la página actual
  const indexOfLastObra = currentPage * obrasPerPage;
  const indexOfFirstObra = indexOfLastObra - obrasPerPage;
  const currentObras = filteredObras.slice(indexOfFirstObra, indexOfLastObra);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredObras.length / obrasPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Navegación anterior/siguiente
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (obraId: string | number) => {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que quieres eliminar esta obra de arte?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/arte/${obraId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Actualizar el estado local removiendo la obra eliminada
        setObras(obras.filter((obra: Arte) => obra.id !== obraId));
        console.log("Obra de arte eliminada exitosamente");
      } else {
        throw new Error("Error al eliminar la obra de arte");
      }
    } catch (error) {
      console.error("Error al eliminar la obra de arte:", error);
      alert("Error al eliminar la obra de arte. Por favor, intenta de nuevo.");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Función para determinar si es escultura o cuadro
  const getTipoObra = (obra: Arte) => {
    return obra.tecnicaEscultorica ? 'escultura' : 'cuadro';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Obras de Arte</h1>
        {isAuthenticated && (
          <Link
            href="/arte/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Obra
          </Link>
        )}
      </div>

      {/* Barra de búsqueda - ocupando todo el ancho */}
      <div className="mb-6">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Buscar por título, autor o temática..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentObras.map((obra) => (
          <div
            key={obra.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            {/* Imagen de la obra */}
            <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
              {obra.foto ? (
                <img
                  src={obra.foto}
                  alt={`${obra.titulo} - ${obra.autor}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <div className="w-16 h-16 mx-auto mb-2 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white">
                    {getTipoObra(obra) === 'escultura' ? (
                      <span className="text-2xl">🗿</span>
                    ) : (
                      <Palette size={32} className="text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm">Sin imagen</p>
                </div>
              )}
            </div>

            {/* Contenido que puede variar en altura */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                {obra.titulo}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                por <span className="font-medium">{obra.autor || "Desconocido"}</span>
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getTipoObra(obra) === 'escultura' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {getTipoObra(obra) === 'escultura' ? 'Escultura' : 'Cuadro'}
                </span>
                {obra.certificado && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Certificado
                  </span>
                )}
              </div>
            </div>

            {/* Botones siempre en la parte inferior */}
            <div className="space-y-2 mt-auto">
              <Link
                href={`/arte/${obra.id}`}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Info size={16} />
                Más información
              </Link>

              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/arte/editar/${obra.id}`}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => obra.id !== undefined && handleDelete(obra.id)}
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

      {/* Mensaje cuando no hay obras */}
      {currentObras.length === 0 && filteredObras.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm
              ? "No se encontraron obras de arte"
              : "No hay obras disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando algunas obras a tu colección"}
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
      {filteredObras.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {indexOfFirstObra + 1}-
          {Math.min(indexOfLastObra, filteredObras.length)} de{" "}
          {filteredObras.length} obras
          {filteredObras.length !== obras.length && ` (${obras.length} total)`}
        </div>
      )}
    </div>
  );
}