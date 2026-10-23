
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Equipo } from '../types';

interface FormularioPrestamoProps {
  equipo: Equipo;
  onGuardar: (
    solicitante: string,
    carne: string,
    fechaLimite: string
  ) => void;
  onCancelar: () => void;
  guardando: boolean;
}

interface ErroresFormulario {
  solicitante?: string;
  carne?: string;
  fechaLimite?: string;
}

function FormularioPrestamo({
  equipo,
  onGuardar,
  onCancelar,
  guardando
}: FormularioPrestamoProps) {
  const [solicitante, setSolicitante] = useState('');
  const [carne, setCarne] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [errores, setErrores] = useState<ErroresFormulario>({});

  const obtenerFechaLocal = (fecha: Date) => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  };

  const hoy = new Date();
  const fechaMinima = obtenerFechaLocal(hoy);

  const fechaMaximaDate = new Date(hoy);
  fechaMaximaDate.setDate(fechaMaximaDate.getDate() + 3);
  const fechaMaxima = obtenerFechaLocal(fechaMaximaDate);

  const manejarEnvio = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const nuevosErrores: ErroresFormulario = {};

    if (solicitante.trim().length < 5) {
      nuevosErrores.solicitante =
        'El nombre debe tener al menos 5 caracteres.';
    }

    const formatoCarne = /^\d{4}-\d{2}-\d{5}$/;

    if (!formatoCarne.test(carne)) {
      nuevosErrores.carne =
        'El carné debe tener el formato 0000-00-00000.';
    }

    if (
      !fechaLimite ||
      fechaLimite < fechaMinima ||
      fechaLimite > fechaMaxima
    ) {
      nuevosErrores.fechaLimite =
        'La fecha debe estar entre hoy y los próximos 3 días.';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      onGuardar(solicitante.trim(), carne, fechaLimite);
    }
  };

  return (
    <div className="panel-formulario">
      <h2>Registrar préstamo</h2>

      <p>Equipo: {equipo.nombre}</p>

      <form onSubmit={manejarEnvio} noValidate>
        <label htmlFor="solicitante">Solicitante</label>
        <input
          id="solicitante"
          type="text"
          value={solicitante}
          onChange={(e) => setSolicitante(e.target.value)}
        />
        {errores.solicitante && (
          <p className="mensaje-error">{errores.solicitante}</p>
        )}

        <label htmlFor="carne">Carné</label>
        <input
          id="carne"
          type="text"
          placeholder="0000-00-00000"
          value={carne}
          onChange={(e) => setCarne(e.target.value)}
        />
        {errores.carne && (
          <p className="mensaje-error">{errores.carne}</p>
        )}

        <label htmlFor="fechaLimite">Fecha límite</label>
        <input
          id="fechaLimite"
          type="date"
          min={fechaMinima}
          max={fechaMaxima}
          value={fechaLimite}
          onChange={(e) => setFechaLimite(e.target.value)}
        />
        {errores.fechaLimite && (
          <p className="mensaje-error">{errores.fechaLimite}</p>
        )}

        <div className="acciones-formulario">
      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar préstamo'}
      </button>
      <button type="button" onClick={onCancelar}>
        Cancelar
      </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioPrestamo;
