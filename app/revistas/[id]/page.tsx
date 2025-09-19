'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Hash, 
  BookOpen, 
  Building2, 
  FileText, 
  Image as ImageIcon,
  X
} from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

interface Revista {
  id?: string
  titulo: string
  tematica: string
  editorial: string
  fechaEdicion?: number
  numPag?: number
  numRevista?: number
  fotoPortada?: string
}

export default function RevistaDetailPage({ params }: Props) {
  const resolvedParams = use(params)
  const [revista, setRevista] = useState<Revista | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchRevista = async () => {
      try {
        const res = await fetch(`${API_BASE}/revista/${resolvedParams.id}`, { cache: 'no-store' })
        
        if (!res.ok) {
          setError(true)
          return
        }
        
        const revistaData = await res.json()
        setRevista(revistaData)
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRevista()
  }, [resolvedParams.id])

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt })
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Cargando...</div>
        </div>
      </div>
    )
  }

  if (error || !revista) {
    notFound()
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <Link
          href="/revistas"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a Revistas
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header con título y editorial */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 border-b">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Imagen de portada */}
              <div className="flex gap-4 flex-shrink-0">
                {revista.fotoPortada && (
                  <div className="text-center">
                    <img 
                      src={revista.fotoPortada} 
                      alt="Portada de la revista"
                      className="w-32 h-44 object-cover rounded-lg shadow-md border cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleImageClick(revista.fotoPortada!, 'Portada de la revista')}
                    />
                    <p className="text-xs text-gray-500 mt-1">Portada</p>
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{revista.titulo}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={20} className="text-gray-500" />
                  <h2 className="text-2xl text-gray-600">por {revista.editorial}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={20} className="text-gray-500" />
                  <span className="text-lg text-gray-600">{revista.tematica}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Información de publicación */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen size={20} />
                  Información de Publicación
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Editorial:</span>
                      <span className="ml-2 text-gray-600">{revista.editorial}</span>
                    </div>
                  </div>
                  
                  {revista.fechaEdicion && (
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Fecha de edición:</span>
                        <span className="ml-2 text-gray-600">{revista.fechaEdicion}</span>
                      </div>
                    </div>
                  )}
                  
                  {revista.numPag && (
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Páginas:</span>
                        <span className="ml-2 text-gray-600">{revista.numPag}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clasificación y detalles */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Tag size={20} />
                  Detalles de la Revista
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Tag size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Temática:</span>
                      <span className="ml-2 text-gray-600">{revista.tematica}</span>
                    </div>
                  </div>
                  
                  {revista.numRevista && (
                    <div className="flex items-start gap-3">
                      <Hash size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Número de revista:</span>
                        <span className="ml-2 text-gray-600">{revista.numRevista}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mensaje si no hay imagen */}
            {!revista.fotoPortada && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No hay imagen de portada disponible para esta revista</p>
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
            <p className="text-white text-center mt-2 text-lg">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </>
  )
}