'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { mockCDs } from '@/fakeData/mockData'
import { Plus, Info } from 'lucide-react'

export default function CDsPage() {
  const { isAuthenticated } = useAuth()
  const [cds] = useState(mockCDs)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">CDs</h1>
        {isAuthenticated && (
          <Link
            href="/cds/crear"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar CD
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cds.map((cd) => (
          <div key={cd.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{cd.title}</h3>
            <p className="text-gray-600 mb-4">por {cd.artist}</p>
            
            <div className="flex justify-between items-center">
              <Link
                href={`/cds/${cd.id}`}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 flex items-center gap-2"
              >
                <Info size={16} />
                Más información
              </Link>
              
              {isAuthenticated && (
                <div className="flex gap-2">
                  <Link
                    href={`/cds/editar/${cd.id}`}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    Editar
                  </Link>
                  <button className="text-red-600 hover:text-red-700">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}