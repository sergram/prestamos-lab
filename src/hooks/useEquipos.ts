
import { useEffect, useState, useCallback } from 'react';
import type { Equipo } from '../types';
import { obtenerEquipos } from '../services/api';

export function useEquipos() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEquipos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const datos = await obtenerEquipos();
      setEquipos(datos);
    } catch {
      setError(
        'No se pudo cargar el inventario. Verifica la conexión con la API.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarEquipos();
  }, [cargarEquipos]);

  return {
    equipos,
    setEquipos,
    cargando,
    error,
    reintentar: cargarEquipos
  };
}
