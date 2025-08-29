import { Book, CD } from '@/types'

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    description: 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de varias generaciones.',
    publishedYear: 1967,
    genre: 'Realismo mágico',
    isbn: '978-84-376-0494-7'
  },
  {
    id: '2',
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes',
    description: 'La historia de un hidalgo que pierde la razón por leer libros de caballería.',
    publishedYear: 1605,
    genre: 'Clásico',
    isbn: '978-84-376-0495-4'
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'Una distopía sobre un futuro totalitario donde el Gran Hermano lo controla todo.',
    publishedYear: 1949,
    genre: 'Distopía',
    isbn: '978-84-376-0496-1'
  }
]

export const mockCDs: CD[] = [
  {
    id: '1',
    title: 'Abbey Road',
    artist: 'The Beatles',
    description: 'Uno de los álbumes más influyentes de la historia del rock.',
    releaseYear: 1969,
    genre: 'Rock',
    duration: '47:23'
  },
  {
    id: '2',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    description: 'Obra maestra del jazz modal considerada uno de los mejores álbumes de jazz.',
    releaseYear: 1959,
    genre: 'Jazz',
    duration: '45:44'
  },
  {
    id: '3',
    title: 'Thriller',
    artist: 'Michael Jackson',
    description: 'El álbum más vendido de la historia de la música pop.',
    releaseYear: 1982,
    genre: 'Pop',
    duration: '42:19'
  }
]