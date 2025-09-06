'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Hash, 
  Disc3, 
  Clock, 
  BookOpen,
  User,
  Play
} from 'lucide-react'
import { CD } from '@/app/type/cd'

interface Props {
  params: Promise<{ id: string }>
}

export default function CDROMDetailPage({ params }: Props) {
  const resolvedParams = use(params)
  const [cdrom, setCdrom] = useState<CD | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCDROM = async () => {
      try {
        const res = await fetch(`http://localhost:8000/cdrom/${resolvedParams.id}`, { cache: 'no-store' })
        
        if (!res.ok) {
          setError(true)
          return
        }
        
        const cdromData = await res.json()
        setCdrom(cdromData)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCDROM()
  }, [resolvedParams.id])

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'No especificada'
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes} minutos`
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

  if (error || !cdrom) {
    notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/cds"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a CD-ROMs
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header con título */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 border-b">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Icono de CDROM */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center shadow-md border">
                <Disc3 size={64} className="text-purple-600" />
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{cdrom.titulo}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Tag size={20} className="text-gray-500" />
                <h2 className="text-2xl text-gray-600">{cdrom.tematica}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Información técnica */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Play size={20} />
                Información Técnica
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-gray-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Duración:</span>
                    <span className="ml-2 text-gray-600">{formatDuration(cdrom.duracion)}</span>
                  </div>
                </div>
                
                {cdrom.yearGrab && (
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Año de grabación:</span>
                      <span className="ml-2 text-gray-600">{cdrom.yearGrab}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clasificación */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Clasificación
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Tag size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">Temática:</span>
                    <span className="ml-2 text-gray-600">{cdrom.tematica}</span>
                  </div>
                </div>

                {cdrom.coleccion && (
                  <div className="flex items-start gap-3">
                    <BookOpen size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Colección:</span>
                      <span className="ml-2 text-gray-600">{cdrom.coleccion}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Información adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Disc3 size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información del CDROM</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Este CDROM contiene contenido relacionado con <strong>{cdrom.tematica}</strong>
                    {cdrom.duracion && ` con una duración de ${formatDuration(cdrom.duracion)}`}
                    {cdrom.yearGrab && `, grabado en el año ${cdrom.yearGrab}`}
                    {cdrom.coleccion && ` como parte de la colección "${cdrom.coleccion}"`}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}