"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

export default function EditarMusicaPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const musicaId = params.id;

  const tipo_clasica: { [key: string]: string[] } = {
    "Medieval o Antigua": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Renacentista": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Clasicista o Neoclásica": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Romántica": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Nacionalista": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Contemporánea Politonista": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Contemporánea Dodecafónica": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
    "Contemporánea Atonalista": [
      "Óperas",
      "Música de cámara",
      "Sinfonías",
      "Oratorios",
      "Misas",
      "Sonatas",
      "Poemas Sinfónicos",
      "Compositores",
    ],
  };

  const idiomas = [
    "Instrumental",
    "Español",
    "Inglés",
    "Alemán",
    "Árabe",
    "Catalán",
    "Checo",
    "Chino",
    "Coreano",
    "Danés",
    "Euskera",
    "Francés",
    "Finlandés",
    "Filipino",
    "Gallego",
    "Griego",
    "Hebreo",
    "Hindi",
    "Holandés",
    "Húngaro",
    "Italiano",
    "Japonés",
    "Noruego",
    "Persa",
    "Polaco",
    "Portugués",
    "Ruso",
    "Sueco",
    "Turco",
    "Otros idiomas",
  ];

  const formatos = [
    "Blue-ray",
    "Cassette",
    "LP (Vinilo)",
    "Single (Vinilo)",
    "CD",
    "DVD",
    "CD ROM",
    "SACD",
  ];

  const conciertos = [
    "Voz",
    "Arpa",
    "Acordeón",
    "Bajo",
    "Batería",
    "Banda completa",
    "Banjo",
    "Clarinete",
    "Chelo",
    "Contrabajo",
    "Fagot",
    "Flauta",
    "Guitarra",
    "Guitarra eléctrica",
    "Harmónica",
    "Mandolina",
    "Oboe",
    "Órgano",
    "Orquesta completa",
    "Marimba",
    "Pandereta",
    "Percusión",
    "Piano",
    "Trompeta",
    "Trombón",
    "Trompa",
    "Tuba",
    "Saxofón",
    "Ukelele",
    "Violín",
    "Viola",
    "Xilófono",
    "Otros instrumentos",
  ];

  const [formData, setFormData] = useState({
    id: "",
    titulo: "",
    artista: "",
    tipoArtista: "",
    tipoMusica: "",
    tipoMusicaClasica: "",
    idioma: "",
    discografica: "",
    anoGrab: "",
    formato: "",
    colecciones: "",
    album: "",
    numPista: "",
    conciertos: "",
    fotoPortada: "",
    fotoContraportada: "",
    memo: "",
    resenaBio: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingMusica, setLoadingMusica] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  //Cargar los datos del disco al montar el componente
  useEffect(()=> {
    const fetchMusica = async()  => {
      if(!musicaId) return;
      
      try{
        const res = await fetch(`http://localhost:8000/musica/${musicaId}`);
        if(!res.ok){
          throw new Error("Error al obtener los datos del disco");
        }
        const musicaData = await res.json();
        
        //Rellenar el formulario con los datos del disco
        setFormData({
          id: musicaData.id || "",
          titulo: musicaData.titulo || "",
          artista: musicaData.artista || "",
          tipoArtista: musicaData.tipoArtista || "",
          tipoMusica: musicaData.tipoMusica || "",
          tipoMusicaClasica: musicaData.tipoMusicaClasica || "",
          idioma: musicaData.idioma || "",
          discografica: musicaData.discografica || "",
          anoGrab: musicaData.anoGrab?.toString() || "",
          formato: musicaData.formato || "",
          colecciones: musicaData.colecciones || "",
          album: musicaData.album || "",
          numPista: musicaData.numPista?.toString() || "",
          conciertos: musicaData.conciertos || "",
          fotoPortada: musicaData.fotoPortada || "",
          fotoContraportada: musicaData.fotoContraportada || "",
          memo: musicaData.memo || "",
          resenaBio: musicaData.resenaBio || "",
        });
      }catch (error) {
        console.error("Error al cargar los datos del disco:", error);
        setError("Error al cargar los datos del disco");
      } finally {
        setLoadingMusica(false);
      }
    }
    fetchMusica();
  }, [musicaId]);
  
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  // Función para validar el año de grabación
  const validateAnoGrab = () => {
    const errors: string[] = [];
    
    if (formData.anoGrab.trim()) {
      const year = parseInt(formData.anoGrab);
      const currentYear = new Date().getFullYear();
      if (
        isNaN(year) ||
        year < 1850 ||
        year > currentYear ||
        !Number.isInteger(year)
      ) {
        errors.push(
          `El año de grabación debe ser un número entero entre 1850 y ${currentYear}`
        );
      }
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
      !formData.artista ||
      !formData.tipoArtista ||
      !formData.tipoMusica ||
      !formData.idioma ||
      !formData.discografica ||
      !formData.formato
    ) {
      setError("Todos los campos marcados con * son obligatorios");
      setLoading(false);
      return;
    }

    // Validación específica del año
    const yearErrors = validateAnoGrab();
    if (yearErrors.length > 0) {
      setError(yearErrors.join(". "));
      setLoading(false);
      return;
    }

    console.log("Creando disco:", formData);
    try {
      const dataToSend = {
        ...formData,
        anoGrab: formData.anoGrab ? parseInt(formData.anoGrab) : null,
        numPista: formData.numPista ? parseInt(formData.numPista) : null,
      };

      const res = await fetch("http://localhost:8000/musica/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al crear el disco");
      }

      router.push("/musica");
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
    if (name === "anoGrab" || name === "numPista") {
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

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/musica"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        Volver a Discos
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Editar Nuevo Disco
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título y Artista */}
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
                htmlFor="artista"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Artista *
              </label>
              <input
                type="text"
                id="artista"
                name="artista"
                value={formData.artista}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Tipo de Artista y Tipo de Música */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tipoArtista"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de Artista *
              </label>
              <select
                id="tipoArtista"
                name="tipoArtista"
                value={formData.tipoArtista}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione un tipo de artista</option>

                <optgroup label="Solistas Femeninos">
                  <option value="Solista Femenino Blanco">
                    Solista Femenino Blanco
                  </option>
                  <option value="Solista Femenino Negro">
                    Solista Femenino Negro
                  </option>
                </optgroup>
                <optgroup label="Solistas Masculinos">
                  <option value="Solista Masculino Blanco">
                    Solista Masculino Blanco
                  </option>
                  <option value="Solista Masculino Negro">
                    Solista Masculino Negro
                  </option>
                </optgroup>
                <optgroup label="Dúos">
                  <option value="Dúos Blanco">Dúos Blanco</option>
                  <option value="Dúos Negro">Dúos Negro</option>
                </optgroup>
                <option value="Grupos">Grupos</option>
                <option value="Orquesta de cámara">Orquesta de cámara</option>
                <option value="Orquesta Sinfónica">Orquesta Sinfónica</option>
                <optgroup label="Instrumentistas">
                  <option value="Bajista">Bajista</option>
                  <option value="Baterista">Baterista</option>
                  <option value="Chelista">Chelista</option>
                  <option value="Guitarrista">Guitarrista</option>
                  <option value="Pianista">Pianista</option>
                  <option value="Saxofonista">Saxofonista</option>
                  <option value="Trompetista">Trompetista</option>
                  <option value="Violinista">Violinista</option>
                  <option value="Otros">Otros</option>
                </optgroup>
                <option value="Duetos">Duetos</option>
                <option value="Tríos">Tríos</option>
                <option value="Cuartetos">Cuartetos</option>
                <option value="Más de 5 integrantes">
                  Más de 5 integrantes
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="tipoMusica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de Música *
              </label>
              <select
                id="tipoMusica"
                name="tipoMusica"
                value={formData.tipoMusica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto"
                required
              >
                <option value="">Seleccione un tipo de música</option>
                <option value="Festival de Eurovisión">
                  Festival de Eurovisión
                </option>
                <option value="Festival de Sanremo">Festival de Sanremo</option>
                <option value="Operación Triunfo">Operación Triunfo</option>
                <option value="Música ambiental">Música ambiental</option>
                <option value="Balada">Balada</option>
                <option value="BSO">BSO</option>
                <option value="Blues">Blues</option>
                <option value="Bolero">Bolero</option>
                <option value="Bossa Nova">Bossa Nova</option>
                <option value="Calipso">Calipso</option>
                <option value="Chill out">Chill out</option>
                <option value="Céltica">Céltica</option>
                <optgroup label="Clásica">
                  <option value="Medieval o Antigua">Medieval o Antigua</option>
                  <option value="Renacentista">Renacentista</option>
                  <option value="Clasicista o Neoclásica">
                    Clasicista o Neoclásica
                  </option>
                  <option value="Romántica">Romántica</option>
                  <option value="Nacionalista">Nacionalista</option>
                  <option value="Contemporánea Politonista">
                    Contemporánea Politonista
                  </option>
                  <option value="Contemporánea Dodecafónica">
                    Contemporánea Dodecafónica
                  </option>
                  <option value="Contemporánea Atonalista">
                    Contemporánea Atonalista
                  </option>
                </optgroup>
                <option value="Copla">Copla</option>
                <option value="Country">Country</option>
                <option value="Cumbia">Cumbia</option>
                <option value="Del mundo">Del mundo</option>
                <option value="Disco">Disco</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Erótica">Erótica</option>
                <option value="Flamenco">Flamenco</option>
                <option value="Folk">Folk</option>
                <option value="Funk">Funk</option>
                <option value="Indie">Indie</option>
                <option value="Infantil">Infantil</option>
                <option value="Jazz">Jazz</option>
                <option value="Latina">Latina</option>
                <option value="Nórdica">Nórdica</option>
                <option value="New Age">New Age</option>
                <option value="Pop">Pop</option>
                <option value="Punk">Punk</option>
                <option value="Ranchera">Ranchera</option>
                <option value="Reggaetón">Reggaetón</option>
                <option value="Reggae">Reggae</option>
                <option value="Rock'n'Roll">Rock&apos;n&apos;Roll</option>
                <option value="Romántica">Romántica</option>
                <option value="Salsa">Salsa</option>
                <option value="Samba">Samba</option>
                <option value="Soul">Soul</option>
                <option value="Tango">Tango</option>
              </select>
            </div>
          </div>

          {/* Idioma y Discográfica */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tipo_clasica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de música clásica
              </label>
              <select
                id="tipoMusicaClasica"
                name="tipoMusicaClasica"
                value={formData.tipoMusicaClasica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto"
                disabled={!tipo_clasica[formData.tipoMusica]?.length}
              >
                <option value="">
                  {tipo_clasica[formData.tipoMusica]?.length
                    ? "Seleccione el tipo de música clásica"
                    : "No hay opciones disponibles"}
                </option>
                {tipo_clasica[formData.tipoMusica]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="idioma"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Idioma *
              </label>
              <select
                id="idioma"
                name="idioma"
                value={formData.idioma}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto"
                required
              >
                <option value="">Seleccione un idioma</option>
                {idiomas.map((idioma) => (
                  <option key={idioma} value={idioma}>
                    {idioma}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Año de Grabación y Formato */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="discografica"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discográfica *
              </label>
              <input
                type="text"
                id="discografica"
                name="discografica"
                value={formData.discografica}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="anoGrab"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Año de Grabación
              </label>
              <input
                type="number"
                step={1}
                min={1902}
                id="anoGrab"
                name="anoGrab"
                value={formData.anoGrab}
                onChange={handleChange}
                placeholder="Ej: 1902"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Álbum y Número de Pista */}
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
                htmlFor="album"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Álbum
              </label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conciertos */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="numPista"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Número de Pista
              </label>
              <input
                type="number"
                step={1}
                min={1}
                id="numPista"
                name="numPista"
                value={formData.numPista}
                onChange={handleChange}
                placeholder="Ej: 3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="conciertos"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instrumentos/Conciertos
              </label>
              <select
                id="conciertos"
                name="conciertos"
                value={formData.conciertos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-60 overflow-y-auto"
              >
                <option value="">
                  Seleccione instrumentos o tipo de concierto
                </option>
                {conciertos.map((concierto) => (
                  <option key={concierto} value={concierto}>
                    {concierto}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Colecciones - TextArea grande */}
          <div>
            <label
              htmlFor="colecciones"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Colecciones
            </label>
            <textarea
              id="colecciones"
              name="colecciones"
              value={formData.colecciones}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Describa las colecciones, series o compilaciones a las que pertenece este disco..."
            />
          </div>

          {/* Memo - TextArea mediano */}
          <div>
            <label
              htmlFor="memo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Memo/Notas
            </label>
            <textarea
              id="memo"
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Notas personales, observaciones o comentarios sobre el disco..."
            />
          </div>

          {/* Reseña Bio - TextArea mediano */}
          <div>
            <label
              htmlFor="resenaBio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reseña/Biografía
            </label>
            <textarea
              id="resenaBio"
              name="resenaBio"
              value={formData.resenaBio}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              placeholder="Reseña del disco o biografía del artista..."
            />
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
                  <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
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
                  <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
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
              {loading ? "Guardando..." : "Guardar Disco"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
