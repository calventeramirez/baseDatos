"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  Tag,
  Play,
  Users,
  Globe,
  FileText,
  Clock,
  Film,
  Image as ImageIcon,
  X,
  Camera,
  Volume2,
  Subtitles,
  MapPin,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

interface Video {
  id?: string;
  tituloEsp: string;
  tituloOrg?: string;
  tematica: string;
  director: string;
  protagonistas: string;
  companiaCinematografica: string;
  duracion: number;
  idiomasAudios: string;
  idiomasSubtitulos: string;
  formato: string;
  pais: string;
  nacionalidad: string;
  portada?: string;
  argumento: string;
}

export default function VideoDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/videos/${resolvedParams.id}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          setError(true);
          return;
        }

        const videoData = await res.json();
        setVideo(videoData);
      } catch (err) {
        console.log("Error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [resolvedParams.id]);

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins} minutos`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Cargando...</div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    notFound();
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <Link
          href="/videoteca"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a Videos
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header con título y director */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 border-b">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Imagen de portada */}
              <div className="flex gap-4 flex-shrink-0">
                {video.portada && (
                  <div className="text-center">
                    <img
                      src={video.portada}
                      alt="Portada"
                      className="w-40 h-56 object-cover rounded-lg shadow-md border cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() =>
                        handleImageClick(video.portada!, "Portada")
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">Portada</p>
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {video.tituloEsp}
                </h1>
                {video.tituloOrg && video.tituloOrg !== video.tituloEsp && (
                  <h2 className="text-2xl text-gray-500 mb-3 italic">
                    &quot;{video.tituloOrg}&quot;
                  </h2>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Camera size={20} className="text-gray-500" />
                  <span className="text-xl text-gray-600">
                    Dirigida por {video.director}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={18} className="text-gray-500" />
                  <span className="text-lg text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
                    {video.tematica}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Argumento */}
          <div className="p-8 border-b bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} />
              Argumento
            </h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              {video.argumento}
            </p>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Información de producción */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Film size={20} />
                  Información de Producción
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">
                        Protagonistas:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {video.protagonistas}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Play size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">
                        Compañía Cinematográfica:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {video.companiaCinematografica}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">
                        Duración:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {formatDuration(video.duracion)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FileText
                      size={18}
                      className="text-gray-500 flex-shrink-0"
                    />
                    <div>
                      <span className="font-medium text-gray-700">
                        Formato:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {video.formato}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información técnica y regional */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Globe size={20} />
                  Información Regional y Técnica
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-gray-500 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-700">País:</span>
                      <span className="ml-2 text-gray-600">{video.pais}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe
                      size={18}
                      className="text-gray-500 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-700">
                        Nacionalidad:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {video.nacionalidad}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Volume2
                      size={18}
                      className="text-gray-500 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-700">
                        Idiomas de Audio:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {video.idiomasAudios}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Subtitles
                      size={18}
                      className="text-gray-500 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-700">
                        Idiomas de Subtítulos:
                      </span>
                      <span className="ml-2 text-gray-600">
                        {video.idiomasSubtitulos}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje si no hay imagen de portada */}
            {!video.portada && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No hay imagen de portada disponible para este video</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all rounded-full p-2 z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-2 text-lg">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
