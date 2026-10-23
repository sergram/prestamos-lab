
import Encabezado from './components/Encabezado';
import ListaEquipos from './components/ListaEquipos';
import { equiposIniciales } from './data/equipos';
import './App.css';

const CARNE = '0902-23-20001';

function App() {
  const manejarPrestamo = (id: number) => {
    alert(`Seleccionaste el equipo con ID: ${id}`);
  };

  return (
    <div className="app">
      <Encabezado
        equipos={equiposIniciales}
        carne={CARNE}
      />

      <main>
        <h2>Inventario de equipos</h2>

        <ListaEquipos
          equipos={equiposIniciales}
          onPrestar={manejarPrestamo}
        />
      </main>
    </div>
  );
}

export default App;
