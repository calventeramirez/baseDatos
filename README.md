# 📚 Biblioteca Digital

Una plataforma integral de gestión de biblioteca digital desarrollada con Next.js, diseñada para catalogar y organizar múltiples tipos de contenido cultural y educativo.

El repositorio del Backend está disponible en: [baseDatos_Backend](https://github.com/calventeramirez/baseDatos_Backend)

## 🌟 Características

### Colecciones Disponibles
- **📖 Libros** - Gestión completa de biblioteca literaria
- **🎵 Música** - Catálogo de discos y álbumes musicales  
- **🎬 Videoteca** - Archivo de contenido audiovisual
- **💿 CD-Rom** - Colección de software y multimedia
- **📰 Revistas** - Hemeroteca digital
- **🎨 Cuadros y Esculturas** - Galería de arte

### Funcionalidades Principales
- ✅ **Interfaz intuitiva** con navegación fluida
- ✅ **Búsqueda avanzada** por múltiples criterios
- ✅ **Visualización detallada** de cada elemento
- ✅ **Gestión de imágenes** con modal de visualización
- ✅ **Categorización especializada** para cada tipo de contenido
- ✅ **Diseño responsive** adaptado a todos los dispositivos
- ✅ **API REST** para gestión de datos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía moderna
- **React Hooks** - Gestión de estado

### Backend
- **API REST** - Endpoints especializados para cada colección
- **JSON** - Formato de intercambio de datos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18.0 o superior
- npm o yarn
- Servidor backend ejecutándose en puerto 8000

## 📂 Repositorios Relacionados

- **Frontend:** [biblioteca-digital-frontend](enlace-del-frontend)
- **Backend:** [baseDatos_Backend](https://github.com/calventeramirez/baseDatos_Backend)
  

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/biblioteca-digital.git
cd biblioteca-digital
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
biblioteca-digital/
├── app/                          # App Router de Next.js
│   ├── libros/                  # Sección de libros
│   │   ├── [id]/               # Página de detalle de libro
│   │   └── page.tsx            # Lista de libros
│   ├── musica/                 # Sección de música
│   │   ├── [id]/               # Página de detalle de disco
│   │   └── page.tsx            # Lista de música
│   ├── videoteca/              # Sección de videos
│   ├── cdrom/                  # Sección de CD-Rom
│   ├── revistas/               # Sección de revistas
│   ├── arte/                   # Cuadros y esculturas
│   ├── globals.css             # Estilos globales
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Página de inicio
├── components/                  # Componentes reutilizables
│   ├── ui/                     # Componentes de interfaz
│   ├── Navigation.tsx          # Navegación principal
│   └── SearchBar.tsx           # Barra de búsqueda
├── lib/                        # Utilidades y configuraciones
├── types/                      # Definiciones de TypeScript
│   ├── Book.ts                # Interfaz de libros
│   ├── Disco.ts               # Interfaz de música
│   └── index.ts               # Exportaciones
├── public/                     # Archivos estáticos
└── README.md
```

## 🎯 Modelos de Datos

### Libros
```typescript
interface Libro {
  id?: string;
  titulo: string;
  autor: string;
  categoria: string;
  subcategoria?: string;
  enciclopedia?: string;
  colecciones?: string;
  editorial: string;
  idioma: string;
  numPag: number;
  yearPub: number;
  isbn: string;
  depositoLegal: string;
  fotoPortada?: string;
  fotoContraportada?: string;
}

```

### Música
```typescript
interface Disco {
  id?: string,
  titulo: string,
  artista: string,
  tipoArtista: string,
  tipoMusica: string,
  tipoMusicaClasica?: string,
  idioma: string,
  discografica: string,
  anoGrab: number,
  formato: string,
  colecciones: string,
  album: string,
  numPista: number,
  conciertos: string,
  fotoPortada?: string,
  fotoContraportada?: string,
  memo?: string,
  resenaBio?: string
}
```

### Videos
```typescript
interface Video {
  id?: string;
  tituloEsp: string;
  tituloOrg?: string;
  tematica: string;
  director: string;
  protagonistas: string;
  companiaCinematografica: string;
  duracion: number;
  idiomasAudios: string;
  idiomasSubtitulos: string;
  formato: string;
  pais: string;
  nacionalidad: string;
  portada?: string;
  argumento: string;
}
```

### CD-Roms
```typescript
interface CD {
  id?: string,
  titulo: string,
  tematica: string,
  duracion?: number,
  yearGrab?: number,
  coleccion?: string
}
```

### Revistas
```typescript
interface Revista {
  id?: string,
  titulo: string,
  tematica: string,
  editorial: string,
  fechaEdicion?: number,
  numPag?: number,
  numRevista?: number,
  fotoPortada?: string
}
```

### Cuadros y Esculturas
```typescript
interface Arte {
  id?: string,
  titulo: string,
  autor: string,
  tematica: string,
  tecnicaPictorica?: string,
  tecnicaEscultorica?: string,
  certificado: boolean,
  altura?: number,
  anchura?: number,
  peso?: number
}
```

## 🎨 Características de Diseño

### Componentes UI
- Cards responsivas con hover effects
- Modales para visualización de imágenes
- Formularios de búsqueda inteligentes
- Navegación breadcrumb
- Loading states y error handling

## 🔍 Funcionalidades Especiales

### Música Clásica
Sistema especializado para categorizar música clásica por períodos:
- Medieval o Antigua
- Renacentista
- Clasicista o Neoclásica
- Romántica
- Nacionalista
- Contemporánea (Politonista, Dodecafónica, Atonalista)

### Gestión de Imágenes
- Visualización de portadas y contraportadas
- Modal de imagen ampliada
- Fallback para contenido sin imágenes
- Optimización de carga

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+) 
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🚦 API Endpoints

```
GET /libros              # Lista todos los libros
GET /libros/{id}         # Detalle de un libro específico
GET /musica              # Lista toda la música
GET /musica/{id}         # Detalle de un disco específico
GET /videoteca           # Lista videos
GET /videoteca/{id}      # Detalle de video
GET /cdrom               # Lista CD-Roms
GET /cdrom/{id}          # Detalle de CD-Rom
GET /revistas            # Lista revistas
GET /revistas/{id}       # Detalle de revista
GET /arte                # Lista obras de arte
GET /arte/{id}           # Detalle de obra
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo de Desarrollo

- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Diseño**: Sistema de componentes modular

---

**🏛️ Biblioteca Digital** - *Preservando y organizando el conocimiento cultural para las futuras generaciones*