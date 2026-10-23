
import type { Equipo, Prestamo } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

interface EquipoAPI extends Omit<Equipo, 'id'> {
  id: string;
}

interface PrestamoAPI extends Omit<Prestamo, 'id' | 'equipoId'> {
  id: string;
  equipoId: number;
}

async function verificarRespuesta(
  respuesta: Response
): Promise<void> {
  if (!respuesta.ok) {
    throw new Error(
      `Error al comunicarse con la API (${respuesta.status})`
    );
  }
}

// GET /equipos
export async function obtenerEquipos(): Promise<Equipo[]> {
  const respuesta = await fetch(`${API_URL}/equipos`);
  await verificarRespuesta(respuesta);

  const datos: EquipoAPI[] = await respuesta.json();

  return datos.map((equipo) => ({
    ...equipo,
    id: Number(equipo.id)
  }));
}

// GET /prestamos?devuelto=false
export async function obtenerPrestamos(): Promise<Prestamo[]> {
  const respuesta = await fetch(
    `${API_URL}/prestamos?devuelto=false`
  );
  await verificarRespuesta(respuesta);

  const datos: PrestamoAPI[] = await respuesta.json();

  return datos.map((prestamo) => ({
    ...prestamo,
    id: prestamo.id,
    equipoId: Number(prestamo.equipoId)
  }));
}

// POST /prestamos
export async function registrarPrestamo(
  prestamo: Omit<Prestamo, 'id'>
): Promise<Prestamo> {
  const respuesta = await fetch(`${API_URL}/prestamos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prestamo)
  });

  await verificarRespuesta(respuesta);

  const datos: PrestamoAPI = await respuesta.json();

  return {
    ...datos,
    id: datos.id,
    equipoId: Number(datos.equipoId)
  };
}

// PATCH /equipos/:id
export async function actualizarDisponibilidad(
  id: number,
  disponible: boolean
): Promise<void> {
  const respuesta = await fetch(`${API_URL}/equipos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ disponible })
  });

  await verificarRespuesta(respuesta);
}

// PATCH /prestamos/:id
export async function marcarDevuelto(
  id: number | string
): Promise<void> {
  const respuesta = await fetch(`${API_URL}/prestamos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ devuelto: true })
  });

  await verificarRespuesta(respuesta);
}
