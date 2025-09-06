import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        ¡Bienvenido a la Biblioteca Digital!
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Explora tu extensa colección de libros, música, videos, revistas y arte.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto px-4">
        <Link href="./libros" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">📚 Libros</h3>
            <p className="text-gray-600">
              Navega por tu colección de libros de todos los géneros
            </p>
          </div>
        </Link>
        <Link href="./musica" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">🎵 Música</h3>
            <p className="text-gray-600">
              Navega por toda tu música de todos los estilos y épocas
            </p>
          </div>
        </Link>
        <Link href="./videoteca" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">🎬 Videoteca</h3>
            <p className="text-gray-600">
              Descubre tu colección de películas, documentales y series
            </p>
          </div>
        </Link>
        <Link href="./cds" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">💿 CD-ROM</h3>
            <p className="text-gray-600">
              Explora software, juegos y contenido multimedia interactivo
            </p>
          </div>
        </Link>
        <Link href="./revistas" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">📰 Revistas</h3>
            <p className="text-gray-600">
              Consulta tu archivo de publicaciones periódicas y especializadas
            </p>
          </div>
        </Link>
        <Link href="./arte" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">🎨 Cuadros y Esculturas</h3>
            <p className="text-gray-600">
              Admira tu colección de obras de arte y piezas escultóricas
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}