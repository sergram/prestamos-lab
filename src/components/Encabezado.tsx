
import type { Equipo } from '../types';

interface EncabezadoProps {
  equipos: Equipo[];
  carne: string;
}

function Encabezado({ equipos, carne }: EncabezadoProps) {
  const disponibles = equipos.filter(
    (equipo) => equipo.disponible
  ).length;

  const total = equipos.length;

  return (
    <header className="encabezado">
      <h1>Préstamos Lab — {carne}</h1>

      <p>
        {disponibles} de {total} equipos disponibles
      </p>
    </header>
  );
}

export default Encabezado;
