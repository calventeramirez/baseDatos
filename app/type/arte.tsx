// Modelo principal de Cuadros y esculturas
export interface Arte {
  id?: string,
  titulo: string,
  autor: string,
  tematica: string,
  tecnicaPictorica?: string,
  tecnicaEscultorica?: string,
  certificado: boolean,
  altura?: number,
  anchura?: number,
  peso?: number,
  foto: string,
}
