import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">
        ¡Bienvenido a la Biblioteca Digital!
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Explora tu extensa colección de libros y CDs.
      </p>
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Link href="./libros" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">📚 Libros</h3>
            <p className="text-gray-600">
              Navega por tu colección de libros de todos los géneros
            </p>
          </div>
        </Link>
        <Link href="./cds" className="block">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">🎵 CDs</h3>
            <p className="text-gray-600">
              Navega por toda tu música de todos los estilos y épocas
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
