"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import { CD } from "@/app/type/cd";

export default function CDROMsPage() {
  const { isAuthenticated } = useAuth();
  const [cdroms, setCDROMs] = useState<CD[]>([]);
  const [filteredCDROMs, setFilteredCDROMs] = useState<CD[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const cdromsPerPage = 10;

  useEffect(() => {
    const fetchCDROMs = async () => {
      try {
        const res = await fetch("http://localhost:8000/cdrom/");
        const data = await res.json();
        setCDROMs(data);
        setFilteredCDROMs(data);
      } catch (error) {
        console.error("Error al cargar los CD-ROMs:", error);
      }
    };
    fetchCDROMs();
  }, []);

  // Aplicar filtros cuando cambien los criterios de búsqueda
  useEffect(() => {
    let filtered = cdroms;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (cdrom: CD) =>
          cdrom.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cdrom.coleccion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCDROMs(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando se aplican filtros
  }, [cdroms, searchTerm]);

  // Calcular CD-ROMs para la página actual
  const indexOfLastCDROM = currentPage * cdromsPerPage;
  const indexOfFirstCDROM = indexOfLastCDROM - cdromsPerPage;
  const currentCDROMs = filteredCDROMs.slice(indexOfFirstCDROM, indexOfLastCDROM);

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredCDROMs.length / cdromsPerPage);

  // Cambiar página
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  // Navegación anterior/siguiente
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (cdromId: any) => {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que quieres eliminar este CD-ROM?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/cdrom/${cdromId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Actualizar el estado local removiendo el CD-ROM eliminado
        setCDROMs(cdroms.filter((cdrom: CD) => cdrom.id !== cdromId));
        console.log("CD-ROM eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el CD-ROM");
      }
    } catch (error) {
      console.error("Error al eliminar el CD-ROM:", error);
      alert("Error al eliminar el CD-ROM. Por favor, intenta de nuevo.");
    }
  };

  const handleSearch = (term: any) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">CD-ROMs</h1>
        {isAuthenticated && (
          <Link
            href="/cds/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar CD-ROM
          </Link>
        )}
      </div>

      {/* Barra de búsqueda - ocupando todo el ancho */}
      <div className="mb-6">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Buscar por título o colección..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentCDROMs.map((cdrom) => (
          <div
            key={cdrom["id"]}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            {/* Imagen representativa del CD-ROM */}
            <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
              <div className="text-gray-400 text-center p-4">
                <div className="w-16 h-16 mx-auto mb-2 border-2 border-gray-300 rounded-full flex items-center justify-center bg-white">
                  <span className="text-2xl">💽</span>
                </div>
                <p className="text-sm">CD-ROM</p>
              </div>
            </div>

            {/* Contenido que puede variar en altura */}
            <div className="flex-grow">
              <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                {cdrom["titulo"]}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Colección:</span> {cdrom["coleccion"] || "Sin especificar"}
              </p>
            </div>

            {/* Botones siempre en la parte inferior */}
            <div className="space-y-2 mt-auto">
              <Link
                href={`/cds/${cdrom["id"]}`}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Info size={16} />
                Más información
              </Link>

              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/cds/editar/${cdrom["id"]}`}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(cdrom["id"])}
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

      {/* Mensaje cuando no hay CD-ROMs */}
      {currentCDROMs.length === 0 && filteredCDROMs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💽</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm
              ? "No se encontraron CD-ROMs"
              : "No hay CD-ROMs disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando algunos CD-ROMs a tu colección"}
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
      {filteredCDROMs.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {indexOfFirstCDROM + 1}-
          {Math.min(indexOfLastCDROM, filteredCDROMs.length)} de{" "}
          {filteredCDROMs.length} CD-ROMs
          {filteredCDROMs.length !== cdroms.length && ` (${cdroms.length} total)`}
        </div>
      )}
    </div>
  );
}