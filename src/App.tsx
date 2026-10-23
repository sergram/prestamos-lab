
import { useState } from 'react';
import type { Equipo, Prestamo } from './types';

import Encabezado from './components/Encabezado';
import ListaEquipos from './components/ListaEquipos';
import FormularioPrestamo from './components/FormularioPrestamo';
import PrestamosActivos from './pages/PrestamosActivos';
import { equiposIniciales } from './data/equipos';

import './App.css';

const CARNE = '23-0902-20001';

function App() {
  const [equipos, setEquipos] = useState<Equipo[]>(equiposIniciales);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
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

  const guardarPrestamo = (
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

    const nuevoPrestamo: Prestamo = {
      id: Date.now(),
      equipoId: equipoSeleccionado.id,
      solicitante,
      carne,
      fechaPrestamo: new Date().toISOString(),
      fechaLimite: new Date(
        `${fechaLimite}T23:59:59`
      ).toISOString(),
      devuelto: false
    };

    setPrestamos((anteriores) => [
      ...anteriores,
      nuevoPrestamo
    ]);

    setEquipos((anteriores) =>
      anteriores.map((equipo) =>
        equipo.id === equipoSeleccionado.id
          ? { ...equipo, disponible: false }
          : equipo
      )
    );

    setEquipoSeleccionado(null);
    setMensajeError('');
  };

  const devolverPrestamo = (id: number) => {
    const prestamo = prestamos.find(
      (item) => item.id === id && !item.devuelto
    );

    if (!prestamo) return;

    setPrestamos((anteriores) =>
      anteriores.map((item) =>
        item.id === id
          ? { ...item, devuelto: true }
          : item
      )
    );

    setEquipos((anteriores) =>
      anteriores.map((equipo) =>
        equipo.id === prestamo.equipoId
          ? { ...equipo, disponible: true }
          : equipo
      )
    );
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


        <ListaEquipos
          equipos={equiposFiltrados}
          onPrestar={manejarPrestamo}
        />

        {equipoSeleccionado && (
          <section className="seccion-formulario">
            {mensajeError && (
              <p className="mensaje-error">{mensajeError}</p>
            )}

            <FormularioPrestamo
              equipo={equipoSeleccionado}
              onGuardar={guardarPrestamo}
              onCancelar={() => {
                setEquipoSeleccionado(null);
                setMensajeError('');
              }}
            />
          </section>
        )}

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
