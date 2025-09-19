"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function EditarCDROMPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const cdromId = params.id;

  const tematicas = [
    "Arte",
    "Historia",
    "Informática",
    "Juegos",
    "Programas",
    "Tecnología",
    "Viajes"
  ];

  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    tematica: "",
    duracion: "",
    yearGrab: "",
    coleccion: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingCDROM, setLoadingCDROM] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  
  // Cargar los datos del CDROM al montar el componente
  useEffect(() => {
    const fetchCDROM = async () => {
      if (!cdromId) return;
      
      try {
        const res = await fetch(`${API_BASE}/cdrom/${cdromId}`);
        if (!res.ok) {
          throw new Error('Error al cargar el CDROM');
        }
        const cdromData = await res.json();
        
        // Rellenar el formulario con los datos del CDROM
        setFormData({
          id: cdromData.id || "",
          titulo: cdromData.titulo || "",
          tematica: cdromData.tematica || "",
          duracion: cdromData.duracion?.toString() || "",
          yearGrab: cdromData.yearGrab?.toString() || "",
          coleccion: cdromData.coleccion || "",
        });
      } catch (error) {
        console.error('Error al cargar el CDROM:', error);
        setError('Error al cargar los datos del CDROM');
      } finally {
        setLoadingCDROM(false);
      }
    };
    
    fetchCDROM();
  }, [cdromId]);
  
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación de los campos obligatorios
    if (!formData.titulo || !formData.tematica) {
      setError("Los campos Título y Temática son obligatorios");
      setLoading(false);
      return;
    }

    // Validar duración si se proporciona
    if (formData.duracion && (isNaN(Number(formData.duracion)) || Number(formData.duracion) < 0)) {
      setError("La duración debe ser un número válido mayor o igual a 0");
      setLoading(false);
      return;
    }

    // Validar año de grabación si se proporciona
    if (formData.yearGrab && (isNaN(Number(formData.yearGrab)) || Number(formData.yearGrab) < 1900 || Number(formData.yearGrab) > new Date().getFullYear())) {
      setError("El año de grabación debe ser un número válido entre 1900 y el año actual");
      setLoading(false);
      return;
    }

    // Preparar datos para el envío
    const submitData = {
      ...formData,
      duracion: formData.duracion ? Number(formData.duracion) : undefined,
      yearGrab: formData.yearGrab ? Number(formData.yearGrab) : undefined,
    };

    console.log("Actualizando CDROM:", submitData);
    try {
      const res = await fetch(`${API_BASE}/cdrom/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al actualizar el CDROM");
      }

      router.push("/cds");
    } catch (error) {
      console.error("Error:", error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Mostrar loading mientras se cargan los datos
  if (loadingCDROM) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Cargando datos del CDROM...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/cds"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a CDROMs
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Editar CDROM
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título y Temática */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="titulo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título *
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="tematica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Temática *
              </label>
              <select
                id="tematica"
                name="tematica"
                value={formData.tematica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una temática</option>
                {tematicas.map((tematica) => (
                  <option key={tematica} value={tematica}>
                    {tematica}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duración y Año de Grabación */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="duracion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duración (minutos)
              </label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 120"
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional: Duración en minutos del contenido del CDROM
              </p>
            </div>

            <div>
              <label
                htmlFor="yearGrab"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Año de Grabación
              </label>
              <input
                type="number"
                id="yearGrab"
                name="yearGrab"
                value={formData.yearGrab}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Ej: ${new Date().getFullYear()}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Opcional: Año en que se grabó el contenido
              </p>
            </div>
          </div>

          {/* Colección */}
          <div>
            <label
              htmlFor="coleccion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Colección
            </label>
            <input
              type="text"
              id="coleccion"
              name="coleccion"
              value={formData.coleccion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Enciclopedia Multimedia Larousse"
            />
            <p className="text-xs text-gray-500 mt-1">
              Opcional: Nombre de la colección a la que pertenece este CDROM
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Información de ayuda:
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Los campos marcados con * son obligatorios</li>
              <li>• La duración se especifica en minutos (ej: 120 minutos = 2 horas)</li>
              <li>• El año de grabación debe estar entre 1900 y el año actual</li>
              <li>• La colección es opcional y se refiere a series o conjuntos de CDROMs relacionados</li>
            </ul>
          </div>

          {/* Botón de envío */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-md flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <Save size={20} />
              {loading ? "Actualizando..." : "Actualizar CDROM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}