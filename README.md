
# Préstamos Lab

Aplicación web para gestionar el préstamo y devolución de equipos de un laboratorio, desarrollada con React, TypeScript y Vite.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- CSS
- json-server
- API REST

## Funcionalidades

- Visualización de ocho equipos del laboratorio.
- Búsqueda de equipos por nombre.
- Filtrado por categoría.
- Registro de préstamos.
- Validación de los datos del solicitante.
- Préstamos con duración máxima de tres días.
- Restricción de un préstamo activo por carné.
- Devolución de equipos.
- Actualización de disponibilidad.
- Identificación visual de préstamos vencidos.
- Persistencia de datos mediante json-server.

## Categorías de equipos

- Laptop
- Proyector
- Router

## Requisitos

- Node.js
- npm

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/sergram/prestamos-lab.git
```

Entrar al proyecto:

```bash
cd prestamos-lab
```

Instalar las dependencias:

```bash
npm install
```

## Configuración

Crear un archivo `.env` en la raíz del proyecto con:

```env
VITE_API_URL=http://localhost:3001
```

## Ejecución

Abrir una terminal e iniciar la API REST:

```bash
npx json-server db.json --port 3001
```

Abrir otra terminal e iniciar React:

```bash
npm run dev
```

Acceder a la aplicación:

http://localhost:5173

## Endpoints principales

- GET /equipos
- GET /prestamos
- POST /prestamos
- PATCH /prestamos/:id
- PATCH /equipos/:id

## Reglas de negocio

1. Un equipo no puede prestarse si está ocupado.
2. Un solicitante no puede tener más de un préstamo activo.
3. La duración máxima de un préstamo es de tres días.
4. Al registrar un préstamo, el equipo cambia a no disponible.
5. Al devolver un préstamo, el equipo vuelve a estar disponible.
6. Los préstamos vencidos se identifican visualmente.

