// Modelo principal de libro
export interface Libro {
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
