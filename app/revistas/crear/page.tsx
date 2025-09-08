"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save, BookOpen, X } from "lucide-react";

export default function CrearRevistasPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const tematicas = [
    "Arquitectura",
    "Arte", 
    "Ciencias",
    "Decoración",
    "Divulgación",
    "Geografía",
    "Historia",
    "Inglés",
    "Literatura y libros",
    "Náutica",
    "Viajes"
  ];

  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    tematica: "",
    editorial: "",
    fechaEdicion: 0,
    numPag: 0,
    numRevista: 0,
    fotoPortada: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Función para validar campos numéricos
  const validateNumericFields = () => {
    const errors: string[] = [];

    // Validar fecha de edición (año)
    if (formData.fechaEdicion) {
      const fecha = Number(formData.fechaEdicion);
      console.log("Validando fechaEdicion:", fecha);
      const currentYear = new Date().getFullYear();
      console.log("Año actual:", currentYear);
      if (isNaN(fecha) || fecha < 1500 || fecha > currentYear + 1 || !Number.isInteger(fecha)) {
        errors.push(`La fecha de edición debe ser un año válido entre 1500 y ${currentYear + 1}`);
      }
    }

    // Validar número de páginas
    if (formData.numPag) {
      const paginas = Number(formData.numPag);
      if (isNaN(paginas) || paginas <= 0 || !Number.isInteger(paginas)) {
        errors.push("El número de páginas debe ser un número entero positivo");
      }
    }

    // Validar número de revista
    if (formData.numRevista) {
      const numero = Number(formData.numRevista);
      if (isNaN(numero) || numero <= 0 || !Number.isInteger(numero)) {
        errors.push("El número de revista debe ser un número entero positivo");
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación de los campos obligatorios
    if (!formData.titulo || !formData.tematica || !formData.editorial) {
      setError("Los campos título, temática y editorial son obligatorios");
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

    console.log("Creando revista:", formData);
    
    try {
      // Preparar los datos para enviar
      const dataToSend = {
        id: "",
        titulo: formData.titulo,
        tematica: formData.tematica,
        editorial: formData.editorial,
        // Convertir valores numéricos opcionales
        fechaEdicion: formData.fechaEdicion ? formData.fechaEdicion : 0,
        numPag: formData.numPag ? formData.numPag : 0,
        numRevista: formData.numRevista ? formData.numRevista : 0,
        fotoPortada: formData.fotoPortada || "",
      };

      console.log("Datos a enviar:", dataToSend);

      const res = await fetch("http://localhost:8000/revista/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error al crear la revista:", errorData);
        throw new Error(errorData.detail || "Error al crear la revista");
      }

      router.push("/revistas");
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
    
    if (name === "fechaEdicion" || name === "numPag" || name === "numRevista") {
      // Permitir solo números enteros para estos campos
      const numericValue = value.replace(/[^0-9]/g, '');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      // Validar tipo de archivo
      if (!files[0].type.startsWith('image/')) {
        setError("Por favor seleccione un archivo de imagen válido");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (files[0].size > 5 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 5MB permitido");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          fotoPortada: reader.result as string,
        }));
        setError(null);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      fotoPortada: "",
    }));
    // Limpiar el input file
    const fileInput = document.getElementById('fotoPortada') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/revistas"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Revistas
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <BookOpen className="text-blue-600" />
          Agregar Nueva Revista
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título y Editorial */}
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
                placeholder="Ej: National Geographic"
                required
              />
            </div>

            <div>
              <label
                htmlFor="editorial"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Editorial *
              </label>
              <input
                type="text"
                id="editorial"
                name="editorial"
                value={formData.editorial}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Editorial Planeta"
                required
              />
            </div>
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

          {/* Información Adicional */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="fechaEdicion"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Año de Edición *
              </label>
              <input
                type="number"
                id="fechaEdicion"
                name="fechaEdicion"
                value={formData.fechaEdicion}
                onChange={handleChange}
                min="1800"
                max="2099"
                placeholder="Ej: 2024"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="numPag"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Páginas * 
              </label>
              <input
                type="number"
                id="numPag"
                name="numPag"
                value={formData.numPag}
                onChange={handleChange}
                min="1"
                placeholder="Ej: 120"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="numRevista"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Revista * 
              </label>
              <input
                type="number"
                id="numRevista"
                name="numRevista"
                value={formData.numRevista}
                onChange={handleChange}
                min="1"
                placeholder="Ej: 245"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Imagen de portada con vista previa */}
          <div>
            <label
              htmlFor="fotoPortada"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Imagen de Portada
            </label>
            <input
              type="file"
              id="fotoPortada"
              name="fotoPortada"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                        file:rounded-md file:border-0 file:text-sm file:font-semibold 
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Opcional. Seleccione una imagen para la portada de la revista (máximo 5MB)
            </p>
            
            {formData.fotoPortada && (
              <div className="mt-3 relative inline-block">
                <div className="w-32 h-48 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={formData.fotoPortada}
                    alt="Vista previa de portada"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Eliminar imagen"
                >
                  <X size={12} />
                </button>
              </div>
            )}
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
              {loading ? "Guardando..." : "Guardar Revista"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}