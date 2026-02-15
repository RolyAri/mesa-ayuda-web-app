export interface Solicitud {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  solicitante: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface SolicitudFilters {
  estado?: string;
  prioridad?: string;
}
