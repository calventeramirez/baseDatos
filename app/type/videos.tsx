// Modelo principal de video
export interface Video {
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