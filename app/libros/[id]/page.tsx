import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Hash, 
  BookOpen, 
  Building2, 
  Globe, 
  FileText, 
  Library, 
  Bookmark,
  User,
  Image as ImageIcon
} from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function LibroDetailPage({ params }: Props) {
  const res = await fetch(`http://localhost:8000/libros/${params.id}`, { cache: 'no-store' })

  if (!res.ok) {
    notFound()
  }

  const book = await res.json()

  console.log(book)

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/libros"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Libros
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header con título y autor */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Imágenes de portada y contraportada */}
            <div className="flex gap-4 flex-shrink-0">
              {book.fotoPortada && (
                <div className="text-center">
                  <img 
                    src={book.fotoPortada} 
                    alt="Portada"
                    className="w-32 h-44 object-cover rounded-lg shadow-md border"
                  />
                  <p className="text-xs text-gray-500 mt-1">Portada</p>
                </div>
              )}
              {book.fotoContraportada && (
                <div className="text-center">
                  <img 
                    src={book.fotoContraportada} 
                    alt="Contraportada"
                    className="w-32 h-44 object-cover rounded-lg shadow-md border"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contraportada</p>
                </div>
              )}
            </div>

            {/* Información principal */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{book.titulo}</h1>
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-gray-500" />
                <h2 className="text-2xl text-gray-600">por {book.autor}</h2>
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
                {book.editorial && (
                  <div className="flex items-center gap-3">
                    <Building2 size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Editorial:</span>
                      <span className="ml-2 text-gray-600">{book.editorial}</span>
                    </div>
                  </div>
                )}
                
                {book.yearPub && (
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Año de publicación:</span>
                      <span className="ml-2 text-gray-600">{book.yearPub}</span>
                    </div>
                  </div>
                )}
                
                {book.idioma && (
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Idioma:</span>
                      <span className="ml-2 text-gray-600">{book.idioma}</span>
                    </div>
                  </div>
                )}
                
                {book.numPag && (
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Páginas:</span>
                      <span className="ml-2 text-gray-600">{book.numPag}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clasificación y identificación */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Tag size={20} />
                Clasificación
              </h3>
              <div className="space-y-3">
                {book.categoria && (
                  <div className="flex items-start gap-3">
                    <Bookmark size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Categoría:</span>
                      <span className="ml-2 text-gray-600">{book.categoria}</span>
                    </div>
                  </div>
                )}
                
                {book.subcategoria && (
                  <div className="flex items-start gap-3">
                    <Tag size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Subcategoría:</span>
                      <span className="ml-2 text-gray-600">{book.subcategoria}</span>
                    </div>
                  </div>
                )}

                {book.enciclopedia && (
                  <div className="flex items-start gap-3">
                    <Library size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Enciclopedia:</span>
                      <span className="ml-2 text-gray-600">{book.enciclopedia}</span>
                    </div>
                  </div>
                )}

                {book.colecciones && (
                  <div className="flex items-start gap-3">
                    <BookOpen size={18} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-gray-700">Colección:</span>
                      <span className="ml-2 text-gray-600">{book.colecciones}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identificadores técnicos */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Hash size={20} />
              Identificadores
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {book.isbn && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">ISBN</span>
                  </div>
                  <p className="text-gray-600 font-mono text-sm">{book.isbn}</p>
                </div>
              )}
              
              {book.depositoLegal && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Depósito Legal</span>
                  </div>
                  <p className="text-gray-600 font-mono text-sm">{book.depositoLegal}</p>
                </div>
              )}
            </div>
          </div>

          {/* Mensaje si no hay imágenes */}
          {!book.fotoPortada && !book.fotoContraportada && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center py-8 text-gray-500">
                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                <p>No hay imágenes disponibles para este libro</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}