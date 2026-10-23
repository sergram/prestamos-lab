export interface Equipo {
  id: number;
  nombre: string;
  categoria: string;
  disponible: boolean;
}

export interface Prestamo {
  id: number | string;
  equipoId: number;
  solicitante: string;
  carne: string;
  fechaPrestamo: string;
  fechaLimite: string;
  devuelto: boolean;
}