"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function CrearVideoPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Manejar la redirección en useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const tematicas = [
    "Acción",
    "Animación",
    "Aventura",
    "Basadas en novelas",
    "Bélicas",
    "Biografía",
    "Ciencia ficción",
    "Cine español",
    "Comedia",
    "Crimen",
    "Deportes",
    "Dibujos animados",
    "Documental",
    "Drama",
    "Eróticas",
    "Espionaje",
    "Familia",
    "Fantasía",
    "Guerra",
    "Histórica",
    "Musical",
    "Misterio",
    "Romance",
    "Terror",
    "Thriller",
    "Western",
  ];

  const formatos = [
    "DVD",
    "Blu-ray",
    "VHS",
  ];

  const [formData, setFormData] = useState({
    id: "",
    tituloEsp: "",
    tituloOrg: "",
    tematica: "",
    director: "",
    protagonistas: "",
    companiaCinematografica: "",
    duracion: "",
    idiomasAudios: "",
    idiomasSubtitulos: "",
    formato: "",
    pais: "",
    nacionalidad: "",
    portada: "",
    argumento: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  // Mostrar loading mientras se verifica la autenticación
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Verificando autenticación...</div>
        </div>
      </div>
    );
  }

  // Resto del código permanece igual...
  const validateNumericFields = () => {
    const errors: string[] = [];

    const duracion = parseInt(formData.duracion);
    if (isNaN(duracion) || duracion <= 0 || !Number.isInteger(duracion)) {
      errors.push("La duración debe ser un número entero positivo (en minutos)");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.tituloEsp ||
      !formData.tematica ||
      !formData.director ||
      !formData.protagonistas ||
      !formData.companiaCinematografica ||
      !formData.duracion ||
      !formData.idiomasAudios ||
      !formData.idiomasSubtitulos ||
      !formData.formato ||
      !formData.pais ||
      !formData.nacionalidad ||
      !formData.argumento
    ) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    const numericErrors = validateNumericFields();
    if (numericErrors.length > 0) {
      setError(numericErrors.join(". "));
      setLoading(false);
      return;
    }

    console.log("Creando video:", formData);
    try {
      const res = await fetch(`${API_BASE}/videos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          duracion: parseInt(formData.duracion),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Error al crear el video");
      }

      router.push("/videoteca");
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

    if (name === "duracion") {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [name]: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      portada: "",
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/videoteca"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Videos
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Agregar Nuevo Video
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título Español y Título Original */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tituloEsp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título en Español *
              </label>
              <input
                type="text"
                id="tituloEsp"
                name="tituloEsp"
                value={formData.tituloEsp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="tituloOrg"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Título Original
              </label>
              <input
                type="text"
                id="tituloOrg"
                name="tituloOrg"
                value={formData.tituloOrg}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Temática y Director */}
          <div className="grid md:grid-cols-2 gap-6">
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

            <div>
              <label
                htmlFor="director"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Director *
              </label>
              <input
                type="text"
                id="director"
                name="director"
                value={formData.director}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Protagonistas */}
          <div>
            <label
              htmlFor="protagonistas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Protagonistas *
            </label>
            <input
              type="text"
              id="protagonistas"
              name="protagonistas"
              value={formData.protagonistas}
              onChange={handleChange}
              placeholder="Ej: Actor 1, Actriz 2, Actor 3..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Compañía Cinematográfica y Duración */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="companiaCinematografica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Compañía Cinematográfica *
              </label>
              <input
                type="text"
                id="companiaCinematografica"
                name="companiaCinematografica"
                value={formData.companiaCinematografica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Idiomas de Audio y Subtítulos */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="idiomasAudios"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Idiomas de Audio *
              </label>
              <input
                type="text"
                id="idiomasAudios"
                name="idiomasAudios"
                value={formData.idiomasAudios}
                onChange={handleChange}
                placeholder="Ej: Español, Inglés, Francés..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="idiomasSubtitulos"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Idiomas de Subtítulos *
              </label>
              <input
                type="text"
                id="idiomasSubtitulos"
                name="idiomasSubtitulos"
                value={formData.idiomasSubtitulos}
                onChange={handleChange}
                placeholder="Ej: Español, Inglés, Francés..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Formato y País */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="formato"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Formato *
              </label>
              <select
                id="formato"
                name="formato"
                value={formData.formato}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un formato</option>
                {formatos.map((formato) => (
                  <option key={formato} value={formato}>
                    {formato}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="pais"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                País *
              </label>
              <input
                type="text"
                id="pais"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Nacionalidad */}
          <div>
            <label
              htmlFor="nacionalidad"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nacionalidad *
            </label>
            <input
              type="text"
              id="nacionalidad"
              name="nacionalidad"
              value={formData.nacionalidad}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Argumento */}
          <div>
            <label
              htmlFor="argumento"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Argumento *
            </label>
            <textarea
              id="argumento"
              name="argumento"
              value={formData.argumento}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el argumento o sinopsis del video..."
              required
            />
          </div>

          {/* Imagen de portada */}
          <div>
            <label
              htmlFor="portada"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Imagen de Portada
            </label>
            <input
              type="file"
              id="portada"
              name="portada"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                      file:rounded-md file:border-0 file:text-sm file:font-semibold 
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.portada && (
              <div className="mt-3 relative inline-block">
                <div className="w-32 h-44 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={formData.portada}
                    alt="Vista previa portada"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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
              {loading ? "Guardando..." : "Guardar Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}