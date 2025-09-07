// Modelo principal de revistas
export interface Revista {
  id?: string,
  titulo: string,
  tematica: string,
  editorial: string,
  fechaEdicion?: number,
  numPag?: number,
  numRevista?: number,
  fotoPortada?: string
}
