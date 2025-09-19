'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, 
  Calendar, 
  Hash, 
  Music, 
  Building2, 
  Globe, 
  FileText, 
  Library, 
  Bookmark,
  User,
  Image as ImageIcon,
  X,
  Disc,
  Headphones,
  Users,
  Volume2,
  Archive
} from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

interface Disco {
  id?: string,
  titulo: string,
  artista: string,
  tipoArtista: string,
  tipoMusica: string,
  tipoMusicaClasica?: string,
  idioma: string,
  discografica: string,
  anoGrab: number,
  formato: string,
  colecciones: string,
  album: string,
  numPista: number,
  conciertos: string,
  fotoPortada?: string,
  fotoContraportada?: string,
  memo?: string,
  resenaBio?: string
}

export default function MusicDetailPage({ params }: Props) {
  const resolvedParams = use(params)
  const [disc, setDisc] = useState<Disco | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    const fetchDisc = async () => {
      try {
        const res = await fetch(`http://localhost:8000/musica/${resolvedParams.id}`, { cache: 'no-store' })
        
        if (!res.ok) {
          setError(true)
          return
        }
        
        const discData = await res.json()
        setDisc(discData)
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchDisc()
  }, [resolvedParams.id])

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt })
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const getMusicTypeDisplay = (tipoMusica: string, tipoMusicaClasica?: string) => {
    // Lista de periodos de música clásica
    const classicalPeriods = [
      'Medieval o Antigua',
      'Renacentista',
      'Clasicista o Neoclásica',
      'Romántica',
      'Nacionalista',
      'Contemporánea Politonista',
      'Contemporánea Dodecafónica',
      'Contemporánea Atonalista'
    ]
    
    // Si es un periodo clásico y tiene subtipo, mostrar ambos
    if (classicalPeriods.includes(tipoMusica) && tipoMusicaClasica) {
      return `${tipoMusica} - ${tipoMusicaClasica}`
    }
    
    // Si es un periodo clásico sin subtipo, solo mostrar el periodo
    if (classicalPeriods.includes(tipoMusica)) {
      return tipoMusica
    }
    
    // Para otros géneros musicales
    return tipoMusica
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

  if (error || !disc) {
    notFound()
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <Link
          href="/musica"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver a Música
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header con título y artista */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 border-b">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Imágenes de portada y contraportada */}
              <div className="flex gap-4 flex-shrink-0">
                {disc.fotoPortada && (
                  <div className="text-center">
                    <img 
                      src={disc.fotoPortada} 
                      alt="Portada"
                      className="w-32 h-32 object-cover rounded-lg shadow-md border cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleImageClick(disc.fotoPortada!, 'Portada')}
                    />
                    <p className="text-xs text-gray-500 mt-1">Portada</p>
                  </div>
                )}
                {disc.fotoContraportada && (
                  <div className="text-center">
                    <img 
                      src={disc.fotoContraportada} 
                      alt="Contraportada"
                      className="w-32 h-32 object-cover rounded-lg shadow-md border cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleImageClick(disc.fotoContraportada!, 'Contraportada')}
                    />
                    <p className="text-xs text-gray-500 mt-1">Contraportada</p>
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{disc.titulo}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <User size={20} className="text-gray-500" />
                  <h2 className="text-2xl text-gray-600">por {disc.artista}</h2>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-gray-600">{disc.tipoArtista}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Información del álbum */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Disc size={20} />
                  Información del Álbum
                </h3>
                <div className="space-y-3">
                  {disc.album && (
                    <div className="flex items-center gap-3">
                      <Archive size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Álbum:</span>
                        <span className="ml-2 text-gray-600">{disc.album}</span>
                      </div>
                    </div>
                  )}
                  
                  {disc.discografica && (
                    <div className="flex items-center gap-3">
                      <Building2 size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Discográfica:</span>
                        <span className="ml-2 text-gray-600">{disc.discografica}</span>
                      </div>
                    </div>
                  )}
                  
                  {disc.anoGrab && (
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Año de grabación:</span>
                        <span className="ml-2 text-gray-600">{disc.anoGrab}</span>
                      </div>
                    </div>
                  )}
                  
                  {disc.idioma && (
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Idioma:</span>
                        <span className="ml-2 text-gray-600">{disc.idioma}</span>
                      </div>
                    </div>
                  )}
                  
                  {disc.formato && (
                    <div className="flex items-center gap-3">
                      <Headphones size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Formato:</span>
                        <span className="ml-2 text-gray-600">{disc.formato}</span>
                      </div>
                    </div>
                  )}

                  {disc.numPista && (
                    <div className="flex items-center gap-3">
                      <Hash size={18} className="text-gray-500 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-gray-700">Número de pista:</span>
                        <span className="ml-2 text-gray-600">{disc.numPista}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clasificación musical */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Volume2 size={20} />
                  Clasificación Musical
                </h3>
                <div className="space-y-3">
                  {disc.tipoMusica && (
                    <div className="flex items-start gap-3">
                      <Music size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Género:</span>
                        <span className="ml-2 text-gray-600">
                          {getMusicTypeDisplay(disc.tipoMusica, disc.tipoMusicaClasica)}
                        </span>
                      </div>
                    </div>
                  )}

                  {disc.colecciones && (
                    <div className="flex items-start gap-3">
                      <Library size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Colección:</span>
                        <span className="ml-2 text-gray-600">{disc.colecciones}</span>
                      </div>
                    </div>
                  )}

                  {disc.conciertos && (
                    <div className="flex items-start gap-3">
                      <Bookmark size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-gray-700">Conciertos:</span>
                        <span className="ml-2 text-gray-600">{disc.conciertos}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Memo y Reseña Biográfica */}
            {(disc.memo || disc.resenaBio) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid lg:grid-cols-1 gap-8">
                  {disc.memo && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FileText size={20} />
                        Notas
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{disc.memo}</p>
                      </div>
                    </div>
                  )}

                  {disc.resenaBio && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User size={20} />
                        Reseña Biográfica
                      </h3>
                      <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{disc.resenaBio}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje si no hay imágenes */}
            {!disc.fotoPortada && !disc.fotoContraportada && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No hay imágenes disponibles para este disco</p>
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