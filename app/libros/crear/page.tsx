"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function CrearLibroPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const subcategoria: { [key: string]: string[] } = {
    Arquitectura: [
      "Arquitectura Clásica",
      "Diseño de interios y Decoración",
      "Guías de museos, palacios y monumentos",
    ],
    Escultura: ["Catálogos", "Escultores"],
    Pintura: ["Artistas", "Colecciones", "Dibujos", "Museos de Pinturas"],
    Música: [
      "Cancioneros y letras",
      "Estilos musicales",
      "Instrumentos musicales",
      "Libros con música en CD",
      "Manuales",
      "Métodos",
      "Óperas",
      "Partituras",
    ],
    Cine: ["Grandes películaas", "Historia del cine"],
    Fotografía: ["Álbumes", "Fotografía artística", "Técnicas fotográficas"],
    Tauromaquia: ["Toreros famosos", "Tratados del toreo"],
    Enología: [
      "Guías de vinos españoles e internacionales",
      "Regiones y países productores",
    ],
    Cocina: [
      "Bebidas con y sin alcohol",
      "Cócteles",
      "Cocina española y recetas",
      "Carnes y nutrición",
      "Ensaladas",
      "Especialidades internacionales y recetas",
      "Grandes cocineros",
      "Grandes restaurantes",
      "Sopas",
      "Postres y repostería",
    ],
    "Adagios y Pensamientos": [],
    Refranes: [],
    "Datos e información": [],
    Acuariofilia: [],
    Jardinería: [
      "Árboles",
      "Guías específicas",
      "Jardines",
      "Paisajismo",
      "Plantas de interior",
      "Plantas de exterior",
    ],
    Deportes: ["Diversos deportes", "Manuales", "Motos y coches"],
    "Guiness Books of Records": [],
    Juegos: [],
    Manualidades: ["Trabajos con papel y madera"],
    "Moda y Estilo de vida": ["Ropa y vestidos en la historia"],
    "Mascotas y animales de compañía": [
      "Descripción de razas de perros y gatos",
    ],
    "Preguntas y Respuestas": [],
    "Tradiciones y Fiestas": [],
    Varios: [],
    "Lengua Española": [
      "Diccionarios",
      "Ejercicios",
      "Fonética y pronunciación",
      "Gramática",
      "Vocabulario y Expresiones Especiales",
    ],
    Literatura: [
      "Antologías",
      "Biografías y memorias",
      "Ciencia ficción",
      "Cómics",
      "Cuentos",
      "Divulgación",
      "Ensayos",
      "Epopeyas y romances clásicos",
      "Fábulas y relatos",
      "Historia de la literatura",
      "Libros de autoayuda",
      "Libros de canciones",
      "Libros de viajes",
      "Literatura clásica",
      "Literatura en otras lenguas",
      "Literatura internacional",
      "Literatura oriental",
      "Novela histórica",
      "Novela negra y policíaca",
      "Novela de suspense y terror",
      "Novela romántica",
      "Obras de poesía clásica",
      "Obras de poesía contemporánea",
      "Obras de teatro clásicas",
      "Obras de teatro contemporáneas",
      "Poesía",
    ],
    Idiomas: [
      "Aprendizaje de idiomas",
      "Cursos",
      "Diccionarios",
      "Ejercicios",
      "Gramática",
      "Guías de conversación",
      "Lecturas",
      "Métodos",
      "Vocabulario y expresiones especiales",
    ],
    "Libros de texto": [
      "Enseñanza infantil",
      "Enseñanza primaria",
      "Enseñanza secundaria",
      "Bachillerato",
      "Universidad",
      "Cuadernos de ejercicios y de vacaciones",
      "Preparación de reválidas y selectividad",
    ],
    "Didáctica y pedagogía": ["Métodos y normas"],
    Filosofía: ["Grandes filósofos"],
    "Lógica y metafísica": ["Tratados y desarrollos"],
    "Ética y moral": ["Tratados y ensayos"],
    "Religiones y Espiritualidad": [
      "Biblias y evangelios",
      "Fe y creencias",
      "Grandes religiones",
      "Historia de las religiones",
      "Mitología",
    ],
    Política: [
      "Biografías",
      "Obras de políticos",
      "Pensamientos y memorias",
      "Geopolítica",
    ],
    Derecho: ["Español", "Internacional"],
    Psicología: [
      "Alteraciones y psicopatías",
      "Estudios Especificos",
      "Sexualidad",
      "Tratados médicos y de divulgación",
    ],
    Sociología: ["Estudios y ensayos"],
    Antropología: ["Etapas de la evolución"],
    Parapsicología: [
      "Fenómenos inexplicables",
      "Lugarés extraños",
      "Misterio y ocultismo",
    ],
    Geografía: [
      "Atlas y mapas",
      "Demografía",
      "Geografía de España",
      "Geografía mundial de países",
      "Guías de países, regiones y ciudades",
      "Libros de viaje en tren, en barco, en avión y excursiones",
      "Parques naturales y reservas",
      "Viajes y exploración",
    ],
    Historia: [
      "Arqueología",
      "Civilizaciones antiguas e Imperios",
      "Continentes, países y lugares históricos",
      "Historia del arte",
      "Historia de España",
      "Historia Universal",
    ],
    "Cultura general": ["Datos e información diversas"],
    Astronomía: [
      "Atros celestes",
      "Constelaciones y galaxias",
      "Sistemas solar",
    ],
    Biología: [
      "Biología molecular",
      "Botánica",
      "Citología",
      "Ecología",
      "Etología",
      "Evolución",
      "Genética",
      "Zoología",
    ],
    "Economía y empresa": ["Principios de economía"],
    Física: [
      "Acústica",
      "Cinemática",
      "Electricidad y magnetismo",
      "Experimentos de Física",
      "Libros de texto de Física",
      "Mecánica",
      "Mecánica de fluidos",
      "Mecánica cuántica",
      "Óptica",
      "Problemas de Física",
      "Termodinámica",
    ],
    Geología: [
      "Critalografía",
      "Geomorfología y geodinámica",
      "Meteorología",
      "Mineralogía",
      "Paleontología",
    ],
    Informática: [
      "Aplicaciones",
      "Hardware y software",
      "Programación y enseñanza",
    ],
    Ingeniería: [
      "Ingeniería civil",
      "Ingeniería eléctronica",
      "Ingeniería industrial",
      "Ingeniería mecánica",
    ],
    Matemáticas: [
      "Álgebra",
      "Análisis matemático",
      "Aritmética",
      "Cálculo diferencial e integral",
      "Estadística",
      "Geometría",
      "Probabilidad y combinatoria",
      "Problemas",
      "Tablas y manuales",
      "Trigonometría",
    ],
    Medicina: [
      "Anatomía",
      "Farmacología",
      "Fisiología",
      "Patología",
      "Pediatría",
      "Psicología",
      "Psiquiatría",
      "Terapias",
      "Traumatología",
      "Varios",
    ],
    Náutica: [
      "Almanaques naúticos",
      "Anuarios de mareas",
      "Astronomía náutica",
      "Atlas de náutica",
      "Barcos y veleros",
      "Construcción naval",
      "Cusos de naútica",
      "Derroteros y portulanos",
      "Diccionarios náuticos",
      "Ejercicios de náutica",
      "Exámenes",
      "Guías",
      "Lecturas náutica",
      "Manuales",
      "Navegación",
      "Preparación a titulaciones",
      "Problemas de exámenes",
      "Relatos y Novelas sobre viajes en barco",
      "Tablas",
      "Teoría del buque",
      "Tratados",
    ],
    Química: [
      "Bioquímica",
      "Experimentos de Química",
      "Formulación química",
      "Química analítica",
      "Química física",
      "Química general",
      "Química industrial",
      "Química inorgánica",
      "Química orgánica",
    ],
    Tecnología: ["Aplicaciones y Evolución"],
    "Adivinanzas y Acertijos": [],
    Curiosidades: [],
    "Frases Célebres": [],
    Humor: [],
    Manuales: [
      "Manuales de autoayuda",
      "Manuales de excursiones",
      "Manuales de Gimnasia y fitness",
      "Manuales de supervivencia",
    ],
  };

  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    autor: "",
    categoria: "",
    subcategoria: "",
    enciclopedia: "",
    colecciones: "",
    editorial: "",
    idioma: "",
    numPag: "",
    yearPub: "",
    isbn: "",
    depositoLegal: "",
    fotoPortada: "",
    fotoContraportada: "",
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

    // Validar número de páginas
    const numPag = parseInt(formData.numPag);
    if (isNaN(numPag) || numPag <= 0 || !Number.isInteger(numPag)) {
      errors.push("El número de páginas debe ser un número entero positivo");
    }

    // Validar año de publicación
    const yearPub = parseInt(formData.yearPub);
    const currentYear = new Date().getFullYear();
    if (
      isNaN(yearPub) ||
      yearPub < 1000 ||
      yearPub > currentYear ||
      !Number.isInteger(yearPub)
    ) {
      errors.push(
        `El año de publicación debe ser un número entero entre 1000 y ${currentYear}`
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
      !formData.autor ||
      !formData.categoria ||
      !formData.editorial ||
      !formData.idioma ||
      !formData.numPag ||
      !formData.yearPub ||
      !formData.isbn ||
      !formData.depositoLegal
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

    console.log("Creando libro:", formData);
    try {
      const res = await fetch(`${API_BASE}/libros/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          numPag: parseInt(formData.numPag),
          yearPub: parseInt(formData.yearPub),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al crear el libro");
      }

      router.push("/libros");
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
    if (name === "numPag" || name === "yearPub") {
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

  const removeImage = (imageType: "fotoPortada" | "fotoContraportada") => {
    setFormData((prev) => ({
      ...prev,
      [imageType]: "",
    }));
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoria: selected,
      subcategoria: "", // Reiniciar subcategoría al cambiar categoría
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/libros"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Libros
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Agregar Nuevo Libro
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título y Autor */}
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
          </div>

          {/* Categoría y Subcategoría */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="categoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleCategoriaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto"
                required
              >
                <option value="">Seleccione una categoría</option>

                <optgroup label="Arte">
                  <option value="Arquitectura">Arquitectura</option>
                  <option value="Escultura">Escultura</option>
                  <option value="Pintura">Pintura</option>
                  <option value="Música">Música</option>
                  <option value="Cine">Cine</option>
                  <option value="Fotografía">Fotografía</option>
                  <option value="Tauromaquia">Tauromaquia</option>
                </optgroup>

                <optgroup label="Cultura General">
                  <option value="Adagios y Pensamientos">
                    Adagios y Pensamientos
                  </option>
                  <option value="Refranes">Refranes</option>
                  <option value="Datos e información">
                    Datos e información
                  </option>
                  <option value="Acuariofilia">Acuariofilia</option>
                  <option value="Jardinería">Jardinería</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Guiness Books of Records">
                    Guiness Books of Records
                  </option>
                  <option value="Juegos">Juegos</option>
                  <option value="Manualidades">Manualidades</option>
                  <option value="Moda y Estilo de vida">
                    Moda y Estilo de vida
                  </option>
                  <option value="Mascotas y animales de compañía">
                    Mascotas y animales de compañía
                  </option>
                  <option value="Preguntas y Respuestas">
                    Preguntas y Respuestas
                  </option>
                  <option value="Tradiciones y Fiestas">
                    Tradiciones y Fiestas
                  </option>
                  <option value="Varios">Varios</option>
                </optgroup>

                <optgroup label="Letras">
                  <option value="Lengua Española">Lengua Española</option>
                  <option value="Literatura">Literatura</option>
                  <option value="Idiomas">Idiomas</option>
                  <option value="Libros de texto">Libros de texto</option>
                  <option value="Didáctica y pedagogía">
                    Didáctica y pedagogía
                  </option>
                  <option value="Filosofía">Filosofía</option>
                  <option value="Lógica y metafísica">
                    Lógica y metafísica
                  </option>
                  <option value="Ética y moral">Ética y moral</option>
                  <option value="Religiones y Espiritualidad">
                    Religiones y Espiritualidad
                  </option>
                  <option value="Política">Política</option>
                  <option value="Derecho">Derecho</option>
                  <option value="Psicología">Psicología</option>
                  <option value="Sociología">Sociología</option>
                  <option value="Antropología">Antropología</option>
                  <option value="Parapsicología">Parapsicología</option>
                  <option value="Geografía">Geografía</option>
                  <option value="Historia">Historia</option>
                  <option value="Cultura general">Cultura general</option>
                </optgroup>

                <optgroup label="Ciencias">
                  <option value="Astronomía">Astronomía</option>
                  <option value="Biología">Biología</option>
                  <option value="Economía y empresa">Economía y empresa</option>
                  <option value="Física">Física</option>
                  <option value="Geología">Geología</option>
                  <option value="Informática">Informática</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Medicina">Medicina</option>
                  <option value="Náutica">Náutica</option>
                  <option value="Química">Química</option>
                  <option value="Tecnología">Tecnología</option>
                </optgroup>

                <optgroup label="Varios">
                  <option value="Enología">Enología</option>
                  <option value="Cocina">Cocina</option>
                  <option value="Adivinanzas y Acertijos">
                    Adivinanzas y Acertijos
                  </option>
                  <option value="Curiosidades">Curiosidades</option>
                  <option value="Frases Célebres">Frases Célebres</option>
                  <option value="Humor">Humor</option>
                  <option value="Manuales">Manuales</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label
                htmlFor="subcategoria"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subcategoría
              </label>
              <select
                id="subcategoria"
                name="subcategoria"
                value={formData.subcategoria}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto"
                disabled={!subcategoria[formData.categoria]?.length}
              >
                <option value="">
                  {subcategoria[formData.categoria]?.length
                    ? "Seleccione una subcategoría"
                    : "No hay subcategorías"}
                </option>
                {subcategoria[formData.categoria]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Enciclopedia y Colecciones */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="enciclopedia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enciclopedia
              </label>
              <input
                type="text"
                id="enciclopedia"
                name="enciclopedia"
                value={formData.enciclopedia}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="colecciones"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Colecciones
              </label>
              <input
                type="text"
                id="colecciones"
                name="colecciones"
                value={formData.colecciones}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Editorial e Idioma */}
          <div className="grid md:grid-cols-2 gap-6">
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
                required
              />
            </div>

            <div>
              <label
                htmlFor="idioma"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Idioma *
              </label>
              <input
                type="text"
                id="idioma"
                name="idioma"
                value={formData.idioma}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Número de páginas y Año de publicación */}
          <div className="grid md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="yearPub"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Año de Publicación *
              </label>
              <input
                type="number"
                id="yearPub"
                name="yearPub"
                value={formData.yearPub}
                onChange={handleChange}
                min="1000"
                max="2099"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* ISBN y Depósito Legal */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="isbn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="depositoLegal"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Depósito Legal *
              </label>
              <input
                type="text"
                id="depositoLegal"
                name="depositoLegal"
                value={formData.depositoLegal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Imágenes con vista previa */}
          <div className="grid md:grid-cols-2 gap-6">
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
              {formData.fotoPortada && (
                <div className="mt-3 relative inline-block">
                  <div className="w-24 h-32 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={formData.fotoPortada}
                      alt="Vista previa portada"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage("fotoPortada")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="fotoContraportada"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Imagen de Contraportada
              </label>
              <input
                type="file"
                id="fotoContraportada"
                name="fotoContraportada"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                        file:rounded-md file:border-0 file:text-sm file:font-semibold 
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.fotoContraportada && (
                <div className="mt-3 relative inline-block">
                  <div className="w-24 h-32 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={formData.fotoContraportada}
                      alt="Vista previa contraportada"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage("fotoContraportada")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
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
              {loading ? "Guardando..." : "Guardar Libro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
