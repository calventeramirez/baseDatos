"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plus, Info, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import { Video } from '@/app/type/videos';

export default function VideotecaPage() {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const videosPerPage = 10;
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API_BASE}/videos/`);
        const data = await res.json();
        setVideos(data);
        setFilteredVideos(data);
      } catch (error) {
        console.error("Error al cargar los videos:", error);
      }
    };
    fetchVideos();
  }, []);

  // Aplicar filtros cuando cambien los criterios de búsqueda
    useEffect(() => {
      let filtered = videos;
  
      // Filtro por búsqueda
      if (searchTerm.trim()) {
        filtered = filtered.filter(
          (video: Video) =>
            video.tituloEsp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.tituloOrg?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            video.director?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      setFilteredVideos(filtered);
      setCurrentPage(1); // Resetear a la primera página cuando se aplican filtros
    }, [videos, searchTerm]);

  // Calcular videos para la página actual
  const indexOfLastVideos = currentPage * videosPerPage;
  const indexOfFirstVideos = indexOfLastVideos - videosPerPage;
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideos,
    indexOfLastVideos
  );

  // Calcular número total de páginas
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Navegación anterior/siguiente
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (videoId: string) => {
    // Confirmar antes de eliminar
    if (!confirm("¿Estás seguro de que quieres eliminar este video?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/videos/${videoId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Actualizar el estado local removiendo el video eliminado
        setVideos(videos.filter((video: Video) => video.id !== videoId));
        console.log("Video eliminado exitosamente");
      } else {
        throw new Error("Error al eliminar el video");
      }
    } catch (error) {
      console.error("Error al eliminar el video:", error);
      alert("Error al eliminar el video. Por favor, intenta de nuevo.");
    }
  };

    const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Videos</h1>
        {isAuthenticated && (
          <Link
            href="/videoteca/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar Video
          </Link>
        )}
      </div>

      {/* Barra de búsqueda - ocupando todo el ancho */}
      <div className="mb-6">
        <SearchBox
          onSearch={handleSearch}
          placeholder="Buscar por título  en español, original o director."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentVideos.map((video) => (
          <div
            key={video["id"]}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            {/* Imagen de portada */}
            <div className="relative h-64 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden mb-4 rounded-lg">
              {video["portada"] ? (
                <img
                  src={video["portada"]}
                  alt={`Portada de ${video["tituloEsp"]}`}
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
              <h3 className="text-lg font-bold mb-1 text-gray-800 line-clamp-2">
                {video["tituloEsp"]}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Director: <span className="font-medium">{video["director"]}</span>
              </p>
            </div>

            {/* Botones siempre en la parte inferior */}
            <div className="space-y-2 mt-auto">
              <Link
                href={`/videoteca/${video["id"]}`}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              >
                <Info size={16} />
                Más información
              </Link>

              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/videoteca/editar/${video["id"]}`}
                    className="flex-1 bg-amber-500 text-white px-3 py-2 rounded-md hover:bg-amber-600 text-center text-sm font-medium transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(video["id"])}
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

      {/* Mensaje cuando no hay videos */}
      {currentVideos.length === 0 && filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm
              ? "No se encontraron videos"
              : "No hay videos disponibles"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando algunos videos a tu biblioteca"}
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
      {filteredVideos.length > 0 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Mostrando {indexOfFirstVideos + 1}-
          {Math.min(indexOfLastVideos, filteredVideos.length)} de{" "}
          {filteredVideos.length} videos
          {filteredVideos.length !== videos.length && ` (${videos.length} total)`}
        </div>
      )}
    </div>
  );
}
