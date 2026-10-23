
import { useState } from 'react';
import type { Equipo, Prestamo } from './types';
import Encabezado from './components/Encabezado';
import ListaEquipos from './components/ListaEquipos';
import FormularioPrestamo from './components/FormularioPrestamo';
import PrestamosActivos from './pages/PrestamosActivos';
import { useEquipos } from './hooks/useEquipos';

import './App.css';
import {
  registrarPrestamo,
  actualizarDisponibilidad,
  obtenerPrestamos,
  marcarDevuelto
} from './services/api';

import { useEffect } from 'react';

const CARNE = '23-0902-20001';

function App() {
const {
  equipos,
  setEquipos,
 cargando,
  error,
  reintentar
} = useEquipos();
  const [guardando, setGuardando] = useState(false);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  useEffect(() => {
  const cargarPrestamos = async () => {
    try {
      const datos = await obtenerPrestamos();
      setPrestamos(datos);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
    }
  };
  

  void cargarPrestamos();
}, []);
  const [equipoSeleccionado, setEquipoSeleccionado] =
    useState<Equipo | null>(null);
  const [mensajeError, setMensajeError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

const equiposFiltrados = equipos.filter((equipo) => {
  const coincideNombre = equipo.nombre
    .toLowerCase()
    .includes(busqueda.toLowerCase().trim());

  const coincideCategoria =
    categoria === 'Todas' || equipo.categoria === categoria;

  return coincideNombre && coincideCategoria;
});

  const manejarPrestamo = (id: number) => {
    const equipo = equipos.find((item) => item.id === id);

    if (equipo && equipo.disponible) {
      setMensajeError('');
      setEquipoSeleccionado(equipo);
    }
  };


const guardarPrestamo = async (
  solicitante: string,
  carne: string,
  fechaLimite: string
) => {
  if (!equipoSeleccionado) return;

  const tienePrestamoActivo = prestamos.some(
    (prestamo) =>
      !prestamo.devuelto &&
      prestamo.carne === carne
  );

  if (tienePrestamoActivo) {
    setMensajeError(
      'Este solicitante ya tiene un préstamo activo.'
    );
    return;
  }

  const nuevoPrestamo: Omit<Prestamo, 'id'> = {
    equipoId: equipoSeleccionado.id,
    solicitante,
    carne,
    fechaPrestamo: new Date().toISOString(),
    fechaLimite: new Date(
      `${fechaLimite}T23:59:59`
    ).toISOString(),
    devuelto: false
  };

  if (guardando) return;
setGuardando(true);

  try {
    setMensajeError('');

    const prestamoGuardado = await registrarPrestamo(
      nuevoPrestamo
    );

    await actualizarDisponibilidad(
      equipoSeleccionado.id,
      false
    );

    setPrestamos((anteriores) => [
      ...anteriores,
      prestamoGuardado
    ]);

    setEquipos((anteriores) =>
      anteriores.map((equipo) =>
        equipo.id === equipoSeleccionado.id
          ? { ...equipo, disponible: false }
          : equipo
      )
    );

    setEquipoSeleccionado(null);
  } catch (error) {
    console.error('Error al registrar préstamo:', error);

    setMensajeError(
      'No se pudo completar el préstamo. Verifica la API.'
    );
  }
  finally {
  setGuardando(false);
}
};

const [devolviendoId, setDevolviendoId] =
  useState<number | string | null>(null);

const devolverPrestamo = async (id: number | string) => {
  if (devolviendoId !== null) return;

  const prestamo = prestamos.find(
    (item) => item.id === id && !item.devuelto
  );

  if (!prestamo) return;

  setDevolviendoId(id);
  setMensajeError('');

  try {
    // Primero liberamos el equipo en la API
    await actualizarDisponibilidad(
      prestamo.equipoId,
      true
    );

    // Después marcamos el préstamo como devuelto
    await marcarDevuelto(id);

    // Actualizamos los préstamos en React
    setPrestamos((anteriores) =>
      anteriores.map((item) =>
        item.id === id
          ? { ...item, devuelto: true }
          : item
      )
    );

    // Actualizamos el inventario en React
    setEquipos((anteriores) =>
      anteriores.map((equipo) =>
        equipo.id === prestamo.equipoId
          ? { ...equipo, disponible: true }
          : equipo
      )
    );

  } catch (error) {
    console.error('Error al devolver préstamo:', error);

    setMensajeError(
      'No se pudo completar la devolución. Revisa la API.'
    );

    // Recuperamos los datos reales del servidor
    try {
      const [equiposActualizados, prestamosActualizados] =
        await Promise.all([
          reintentar(),
          obtenerPrestamos()
        ]);

      void equiposActualizados;
      setPrestamos(prestamosActualizados);
    } catch (errorRecarga) {
      console.error('Error al sincronizar:', errorRecarga);
    }

  } finally {
    setDevolviendoId(null);
  }
};


  return (
    <div className="app">
      <Encabezado equipos={equipos} carne={CARNE} />

      <main>
        <h2>Inventario de equipos</h2>

<div className="filtros-inventario">
  <input
    type="text"
    placeholder="Buscar equipo por nombre..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />

  <select
    value={categoria}
    onChange={(e) => setCategoria(e.target.value)}
  >
    <option value="Todas">Todas las categorías</option>
    <option value="Laptop">Laptop</option>
    <option value="Proyector">Proyector</option>
    <option value="Router">Router</option>
  </select>
</div>

{cargando ? (
  <p className="mensaje-cargando">
    Cargando equipos desde la API...
  </p>
) : error ? (
  <div className="panel-error-api">
    <h3>Error de conexión</h3>
    <p>{error}</p>
    <button onClick={() => void reintentar()}>
      Reintentar
    </button>
  </div>
) : (
  <ListaEquipos
    equipos={equiposFiltrados}
    onPrestar={manejarPrestamo}
  />
)}


        {equipoSeleccionado && (
          <section className="seccion-formulario">
            {mensajeError && (
              <p className="mensaje-error">{mensajeError}</p>
            )}

            <FormularioPrestamo
              equipo={equipoSeleccionado}
              onGuardar={guardarPrestamo}
              guardando={guardando}
              onCancelar={() => {
                setEquipoSeleccionado(null);
                setMensajeError('');
              }}
            />
          </section>
        )}
        
      {mensajeError && !equipoSeleccionado && (
         <p className="mensaje-error">{mensajeError}</p>
      )
      }

        <PrestamosActivos
          equipos={equipos}
          prestamos={prestamos}
          onDevolver={devolverPrestamo}
        />
      </main>
    </div>
  );
}

export default App;
