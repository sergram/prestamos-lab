
import type { Equipo } from '../types';

interface TarjetaEquipoProps {
  equipo: Equipo;
  onPrestar: (id: number) => void;
}

function TarjetaEquipo({ equipo, onPrestar }: TarjetaEquipoProps) {
  return (
    <div className="tarjeta-equipo">
      <h3>{equipo.nombre}</h3>

      <p>Categoría: {equipo.categoria}</p>

      <span
        className={
          equipo.disponible
            ? 'estado disponible'
            : 'estado prestado'
        }
      >
        {equipo.disponible ? 'Disponible' : 'Prestado'}
      </span>

      <button
        disabled={!equipo.disponible}
        onClick={() => onPrestar(equipo.id)}
      >
        Prestar
      </button>
    </div>
  );
}

export default TarjetaEquipo;
