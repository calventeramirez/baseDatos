// Modelo principal de Musica
export interface Disco {
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
