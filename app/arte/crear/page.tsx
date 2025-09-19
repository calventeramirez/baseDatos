"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save, Palette } from "lucide-react";

export default function CrearArtePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const tematicas = [
    "Abstracto",
    "Bodegón", 
    "Composición",
    "Costumbrista",
    "Detalles",
    "Fantasías",
    "Geométrico",
    "Escenas",
    "Marina",
    "Paisaje",
    "Retrato"
  ];

  const tecnicasPictoricas = [
    "Acuarela",
    "Acrílico", 
    "Dibujo",
    "Pastel",
    "Óleo",
    "Litografía",
    "Fotografía",
    "Lámina"
  ];

  const tecnicasEscultoricas = [
    "Madera",
    "Mármol",
    "Metal",
    "Polímero"
  ];

  const [tipoObra, setTipoObra] = useState<'cuadro' | 'escultura' | ''>('');
  
  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    autor: "",
    tematica: "",
    tecnicaPictorica: "",
    tecnicaEscultorica: "",
    certificado: false,
    altura: "",
    anchura: "", 
    peso: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //Manejar redireccion en useEffect
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

  // Función para validar números
  const validateNumericFields = () => {
    const errors: string[] = [];

    // Validar altura
    if (formData.altura) {
      const altura = parseFloat(formData.altura);
      if (isNaN(altura) || altura <= 0) {
        errors.push("La altura debe ser un número positivo (en cm)");
      }
    }

    // Validar anchura
    if (formData.anchura) {
      const anchura = parseFloat(formData.anchura);
      if (isNaN(anchura) || anchura <= 0) {
        errors.push("La anchura debe ser un número positivo (en cm)");
      }
    }

    // Validar peso
    if (formData.peso) {
      const peso = parseFloat(formData.peso);
      if (isNaN(peso) || peso <= 0) {
        errors.push("El peso debe ser un número positivo (en kg)");
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validación de los campos obligatorios
    if (!formData.titulo || !formData.autor || !formData.tematica || !tipoObra) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    // Validar que se seleccione la técnica correspondiente
    if (tipoObra === 'cuadro' && !formData.tecnicaPictorica) {
      setError("Debe seleccionar una técnica pictórica para los cuadros");
      setLoading(false);
      return;
    }

    if (tipoObra === 'escultura' && !formData.tecnicaEscultorica) {
      setError("Debe seleccionar una técnica escultórica para las esculturas");
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

    console.log("Creando obra de arte:", formData);
    
    try {
      // Preparar los datos para enviar
      const dataToSend = {
        id: "",
        titulo: formData.titulo,
        autor: formData.autor,
        tematica: formData.tematica,
        certificado: formData.certificado ? true : false,
        // Solo incluir la técnica correspondiente al tipo de obra
        ...(tipoObra === 'cuadro' 
          ? { tecnicaPictorica: formData.tecnicaPictorica, tecnicaEscultorica: "", }
          : { tecnicaEscultorica: formData.tecnicaEscultorica, tecnicaPictorica: "", }
        ),
        // Convertir valores numéricos opcionales
        altura: formData ? formData.altura : "",
        anchura: formData ? formData.anchura : "",
        peso: formData ? formData.peso : "",
      };

      console.log("Datos a enviar:", dataToSend);

      const res = await fetch(`${API_BASE}/arte/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error al crear la obra de arte:", errorData);
        throw new Error("Error al crear la obra de arte");
      }

      router.push("/arte");
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
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "altura" || name === "anchura" || name === "peso") {
      // Permitir números decimales para medidas y peso
      const numericValue = value.replace(/[^0-9.]/g, '');
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

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tipo = e.target.value as 'cuadro' | 'escultura' | '';
    setTipoObra(tipo);
    
    // Limpiar técnicas cuando cambie el tipo
    setFormData(prev => ({
      ...prev,
      tecnicaPictorica: "",
      tecnicaEscultorica: ""
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/arte"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Obras de Arte
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Palette className="text-blue-600" />
          Agregar Nueva Obra de Arte
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

          {/* Autor */}
          <div>
            <label
              htmlFor="autor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Autor *
            </label>
            <input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tipo de Obra */}
          <div>
            <label
              htmlFor="tipoObra"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de Obra *
            </label>
            <select
              id="tipoObra"
              value={tipoObra}
              onChange={handleTipoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione el tipo de obra</option>
              <option value="cuadro">Cuadro</option>
              <option value="escultura">Escultura</option>
            </select>
          </div>

          {/* Técnica (condicional según el tipo) */}
          {tipoObra === 'cuadro' && (
            <div>
              <label
                htmlFor="tecnicaPictorica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Técnica Pictórica *
              </label>
              <select
                id="tecnicaPictorica"
                name="tecnicaPictorica"
                value={formData.tecnicaPictorica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una técnica pictórica</option>
                {tecnicasPictoricas.map((tecnica) => (
                  <option key={tecnica} value={tecnica}>
                    {tecnica}
                  </option>
                ))}
              </select>
            </div>
          )}

          {tipoObra === 'escultura' && (
            <div>
              <label
                htmlFor="tecnicaEscultorica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Técnica Escultórica *
              </label>
              <select
                id="tecnicaEscultorica"
                name="tecnicaEscultorica"
                value={formData.tecnicaEscultorica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una técnica escultórica</option>
                {tecnicasEscultoricas.map((tecnica) => (
                  <option key={tecnica} value={tecnica}>
                    {tecnica}
                  </option>
                ))}
              </select>
            </div>
          )}

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

          {/* Certificado */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="certificado"
                checked={formData.certificado}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Obra certificada
              </span>
            </label>
          </div>

          {/* Medidas y Peso */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="altura"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Altura (cm)
              </label>
              <input
                type="number"
                step={0.1}
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                placeholder="Ej: 30.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="anchura"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Anchura (cm)
              </label>
              <input
                type="number"
                step={0.1}
                id="anchura"
                name="anchura"
                value={formData.anchura}
                onChange={handleChange}
                placeholder="Ej: 40.2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="peso"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Peso (kg)
              </label>
              <input
                type="number"
                step={0.1}
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                placeholder="Ej: 2.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
              {loading ? "Guardando..." : "Guardar Obra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}