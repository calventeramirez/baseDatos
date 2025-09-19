"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function CrearCDROMPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

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
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Función para validar números
  const validateNumericFields = () => {
    const errors: string[] = [];

    // Validar duración
    const duracion = parseInt(formData.duracion);
    if (isNaN(duracion) || duracion <= 0 || !Number.isInteger(duracion)) {
      errors.push("La duración debe ser un número entero positivo (en minutos)");
    }

    // Validar año de grabación
    const yearGrabacion = parseInt(formData.yearGrab);
    const currentYear = new Date().getFullYear();
    if (
      isNaN(yearGrabacion) ||
      yearGrabacion < 1980 ||
      yearGrabacion > currentYear ||
      !Number.isInteger(yearGrabacion)
    ) {
      errors.push(
        `El año de grabación debe ser un número entero entre 1980 (año de creación del CD-ROM) y ${currentYear}`
      );
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación de los campos obligatorios
    if (
      !formData.titulo ||
      !formData.tematica
    ) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    // Validación específica de campos numéricos
    const numericErrors = validateNumericFields();
    if (numericErrors.length > 0) {
      setError(numericErrors.join(". "));
      setLoading(false);
      return;
    }

    console.log("Creando CDROM:", formData);
    try {
      const res = await fetch(`${API_BASE}/cdrom/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          duracion: parseFloat(formData.duracion),
          yearGrabacion: parseInt(formData.yearGrab),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al crear el CDROM");
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
    const { name, value } = e.target;

    // Para campos numéricos, permitir solo números
    if (name === "duracion" || name === "yearGrabacion") {
      // Permitir solo números y eliminar caracteres no numéricos
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/cds"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a CD-ROMs
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Agregar Nuevo CD-ROM
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
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

          {/* Temática */}
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

          {/* Duración y Año de Grabación */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="duracion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duración (minutos) *
              </label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                placeholder="Ej: 120 (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="yearGrabacion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Año de Grabación *
              </label>
              <input
                type="number"
                id="yearGrabacion"
                name="yearGrab"
                value={formData.yearGrab}
                onChange={handleChange}
                placeholder="Ej: 1995 (opcional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              placeholder="Opcional: nombre de la colección"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              {loading ? "Guardando..." : "Guardar CDROM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}