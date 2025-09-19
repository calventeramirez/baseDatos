'use client'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { 
  ArrowLeft, 
  Tag, 
  Palette, 
  User,
  Ruler,
  Weight,
  CheckCircle,
  XCircle,
  Hammer,
  Paintbrush
} from 'lucide-react'

// Modelo principal de Arte
interface Arte {
  id?: string;
  titulo: string;
  autor: string;
  tematica: string;
  tecnicaPictorica?: string;
  tecnicaEscultorica?: string;
  certificado: boolean;
  altura?: number;
  anchura?: number;
  peso?: number;
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ArteDetailPage({ params }: Props) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const resolvedParams = use(params)
  const [obra, setObra] = useState<Arte | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchArte = async () => {
      try {
        const res = await fetch(`${API_BASE}/arte/${resolvedParams.id}`, { cache: 'no-store' })
        
        if (!res.ok) {
          setError(true)
          return
        }
        
        const arteData = await res.json()
        setObra(arteData)
      } catch (err) {
        console.log(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchArte()
  }, [resolvedParams.id])

  // Función para determinar si es escultura o cuadro
  const getTipoObra = (obra: Arte) => {
    return obra.tecnicaEscultorica ? 'escultura' : 'cuadro';
  };

  // Función para obtener la técnica correspondiente
  const getTecnica = (obra: Arte) => {
    return obra.tecnicaEscultorica || obra.tecnicaPictorica || 'No especificada';
  };

  // Función para formatear medidas
  const formatMedidas = (altura?: number, anchura?: number) => {
    if (!altura && !anchura) return 'No especificadas';
    
    const alturaStr = altura ? `${altura} cm (alto)` : '';
    const anchuraStr = anchura ? `${anchura} cm (ancho)` : '';
    
    if (altura && anchura) {
      return `${altura} x ${anchura} cm`;
    }
    
    return alturaStr || anchuraStr;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Cargando...</div>
        </div>
      </div>
    )
  }

  if (error || !obra) {
    notFound()
  }

  const tipoObra = getTipoObra(obra);
  const tecnica = getTecnica(obra);

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/arte"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Obras de Arte
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header con título */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 border-b">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Icono de la obra */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center shadow-md border">
                {tipoObra === 'escultura' ? (
                  <Hammer size={64} className="text-purple-600" />
                ) : (
                  <Palette size={64} className="text-purple-600" />
                )}
              </div>
            </div>

            {/* Información principal */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{obra.titulo}</h1>
              <div className="flex items-center gap-2 mb-2">
                <User size={20} className="text-gray-500" />
                <h2 className="text-2xl text-gray-600">{obra.autor}</h2>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tipoObra === 'escultura' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {tipoObra === 'escultura' ? 'Escultura' : 'Cuadro'}
                </span>
                {obra.certificado && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle size={16} />
                    Certificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Información artística */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {tipoObra === 'escultura' ? <Hammer size={20} /> : <Paintbrush size={20} />}
                Información Artística
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-gray-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Autor:</span>
                    <span className="ml-2 text-gray-600">{obra.autor}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Tag size={18} className="text-gray-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-gray-700">Temática:</span>
                    <span className="ml-2 text-gray-600">{obra.tematica}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {tipoObra === 'escultura' ? (
                    <Hammer size={18} className="text-gray-500 flex-shrink-0" />
                  ) : (
                    <Paintbrush size={18} className="text-gray-500 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium text-gray-700">
                      {tipoObra === 'escultura' ? 'Técnica Escultórica:' : 'Técnica Pictórica:'}
                    </span>
                    <span className="ml-2 text-gray-600">{tecnica}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {obra.certificado ? (
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-500 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Certificación:</span>
                    <span className={`ml-2 ${obra.certificado ? 'text-green-600' : 'text-red-600'}`}>
                      {obra.certificado ? 'Obra certificada' : 'Sin certificación'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Especificaciones físicas */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Ruler size={20} />
                Especificaciones Físicas
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Ruler size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-700">Medidas:</span>
                    <span className="ml-2 text-gray-600">{formatMedidas(obra.altura, obra.anchura)}</span>
                  </div>
                </div>

                {obra.peso && (
                  <div className="flex items-start gap-3">
                    <Weight size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Peso:</span>
                      <span className="ml-2 text-gray-600">{obra.peso} kg</span>
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
                <Palette size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Información de la Obra</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Esta {tipoObra} titulada <strong>&quot;{obra.titulo}&quot;</strong> fue creada por <strong>{obra.autor}</strong>.
                    {` La obra pertenece a la temática ${obra.tematica.toLowerCase()}`}
                    {` y utiliza la técnica ${tipoObra === 'escultura' ? 'escultórica' : 'pictórica'} de ${tecnica.toLowerCase()}`}.
                    {obra.altura || obra.anchura ? ` Sus medidas son ${formatMedidas(obra.altura, obra.anchura).toLowerCase()}.` : ''}
                    {obra.peso ? ` Tiene un peso de ${obra.peso} kg.` : ''}
                    {obra.certificado ? ' Esta obra cuenta con certificación oficial.' : ' Esta obra no cuenta con certificación oficial.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles técnicos adicionales */}
          {(obra.altura || obra.anchura || obra.peso) && (
            <div className="mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {obra.altura && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Ruler size={24} className="text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{obra.altura}</div>
                    <div className="text-sm text-gray-600">cm de altura</div>
                  </div>
                )}
                
                {obra.anchura && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Ruler size={24} className="text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{obra.anchura}</div>
                    <div className="text-sm text-gray-600">cm de anchura</div>
                  </div>
                )}
                
                {obra.peso && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Weight size={24} className="text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{obra.peso}</div>
                    <div className="text-sm text-gray-600">kg de peso</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}