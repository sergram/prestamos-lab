
import type { Equipo, Prestamo } from '../types';

interface PrestamosActivosProps {
  equipos: Equipo[];
  prestamos: Prestamo[];
  onDevolver: (id: number | string) => void;
}

function PrestamosActivos({
  equipos,
  prestamos,
  onDevolver
}: PrestamosActivosProps) {

  const prestamosActivos = prestamos.filter(
    (prestamo) => !prestamo.devuelto
  );

  const hoy = new Date();

  return (
    <section className="prestamos-activos">
      <h2>Préstamos activos</h2>

      {prestamosActivos.length === 0 ? (
        <p>No hay préstamos activos registrados.</p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Solicitante</th>
                <th>Fecha límite</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {prestamosActivos.map((prestamo) => {
                const equipo = equipos.find(
                  (item) => item.id === prestamo.equipoId
                );

                const fecha = new Date(prestamo.fechaLimite);
                const vencido = fecha < hoy;

                return (
                  <tr
                    key={prestamo.id}
                    className={vencido ? 'fila-vencida' : ''}
                  >
                    <td>{equipo?.nombre ?? 'Equipo desconocido'}</td>
                    <td>{prestamo.solicitante}</td>
                    <td>{fecha.toLocaleDateString('es-GT')}</td>
                    <td>
                      <button
                        className="boton-devolver"
                        onClick={() => onDevolver(prestamo.id)}
                      >
                        Devolver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PrestamosActivos;
