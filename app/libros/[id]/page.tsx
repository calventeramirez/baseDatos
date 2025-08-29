import { mockBooks } from '@/fakeData/mockData'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Hash } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function LibroDetailPage({ params }: Props) {
  // const book = mockBooks.find(b => b.id === params.id)
  const res = await fetch(`http://localhost:8000/libros/${params.id}`, { cache: 'no-store' })

  if (!res.ok) {
    notFound()
  }

  const book = await res.json()

  console.log(book)

  return (
    <div>
      <Link
        href="/libros"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Libros
      </Link>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{book["titulo"]}</h1>
        <h2 className="text-2xl text-gray-600 mb-6">por {book["autor"]}</h2>
        
        {book["idioma"] && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{book["idioma"]}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {book["yearPub"] && (
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-500" />
                <span>Año de publicación: {book["yearPub"]}</span>
              </div>
            )}
            
            {book["categoria"] && (
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-gray-500" />
                <span>Género: {book["categoriaid"]}</span>
              </div>
            )}
            
            {book["isbn"] && (
              <div className="flex items-center gap-2">
                <Hash size={20} className="text-gray-500" />
                <span>ISBN: {book["isbn"]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}