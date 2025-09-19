"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import { Disco } from "@/app/type/musica";

export default function DiscosPage() {
  const { isAuthenticated } = useAuth();
  const [discos, setDiscos] = useState([]);
  const [filteredDiscos, setFilteredDiscos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const discosPerPage = 10;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchDiscos = async () => {
      try {
        const res = await fetch(`${API_BASE}/musica/`);
        const data = await res.json();
        setDiscos(data);
        setFilteredDiscos(data);
      } catch (error) {
        console.error("Error al cargar los discos:", error);
      }
    };
    fetchDiscos();
  }, []);

  // Aplicar filtros cuando cambien los criterios de búsqueda
  useEffect(() => {
    let filtered = discos;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (disco: Disco) =>
          disco.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          disco.artista?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          disco.album?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          disco.tipoMusica?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDiscos(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando se aplican filtros
  }, [discos, searchTerm]);

  // Calcular discos para la página actual
  const indexOfLastDisco = currentPage * discosPerPage;
  const indexOfFirstDisco = indexOfLastDisco - discosPerPage;
  const currentDiscos = filteredDiscos.slice(indexOfFirstDisco, indexOfLastDisco);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredDiscos.length / discosPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Navegación anterior/siguiente
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (discoId: string) => {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que quieres eliminar este disco?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/musica/${discoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Actualizar el estado local removiendo el disco eliminado
        setDiscos(discos.filter((disco: Disco) => disco.id !== discoId));
        console.log("Disco eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el disco");
      }
    } catch (error) {
      console.error("Error al eliminar el disco:", error);
      alert("Error al eliminar el disco. Por favor, intenta de nuevo.");
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Discos</h1>
        {isAuthenticated && (
          <Link
            href="/musica/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Disco
          </Link>
        )}
      </div>

      {/* Barra de búsqueda - ocupando todo el ancho */}
      <div className="mb-6">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Buscar por título, artista, álbum o género..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentDiscos.map((disco) => (
          <div
            key={disco["id"]}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            {/* Imagen de portada */}
            <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
              {disco["fotoPortada"] ? (
                <img
                  src={disco["fotoPortada"]}
                  alt={`Portada de ${disco["titulo"]}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center p-4">
                  <div className="w-16 h-20 mx-auto mb-2 border-2 border-gray-300 rounded flex items-center justify-center">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <p className="text-sm">Sin portada</p>
                </div>
              )}
            </div>

            {/* Contenido que puede variar en altura */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                {disco["titulo"]}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                por <span className="font-medium">{disco["artista"]}</span>
              </p>
              {disco["album"] && disco["album"] !== disco["titulo"] && (
                <p className="text-xs text-gray-500 mb-1">
                  Álbum: {disco["album"]}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Año: {disco["anoGrab"]}</span>
                {disco["tipoMusica"] && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {disco["tipoMusica"]}
                  </span>
                )}
              </div>
              {disco["formato"] && (
                <p className="text-xs text-gray-500">
                  Formato: {disco["formato"]}
                </p>
              )}
            </div>

            {/* Botones siempre en la parte inferior */}
            <div className="space-y-2 mt-auto">
              <Link
                href={`/musica/${disco["id"]}`}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Info size={16} />
                Más información
              </Link>

              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/musica/editar/${disco["id"]}`}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(disco["id"])}
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

      {/* Mensaje cuando no hay discos */}
      {currentDiscos.length === 0 && filteredDiscos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm
              ? "No se encontraron discos"
              : "No hay discos disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando algunos discos a tu colección"}
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
      {filteredDiscos.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {indexOfFirstDisco + 1}-
          {Math.min(indexOfLastDisco, filteredDiscos.length)} de{" "}
          {filteredDiscos.length} discos
          {filteredDiscos.length !== discos.length && ` (${discos.length} total)`}
        </div>
      )}
    </div>
  );
}