# Sistema de Reservas para Asesores Comerciales

Este proyecto consiste en una aplicación **full‑stack** para la gestión de reservas de productos por parte de asesores comerciales. La interfaz sigue la estética de las pantallas proporcionadas y se construye con **React** en el frontend y **Node.js/Express** en el backend. Los datos se almacenan en una base de datos **MongoDB**. 

## Arquitectura

El proyecto está dividido en dos carpetas principales:

- **`backend/`**: Implementa una API REST con Express. Utiliza una arquitectura por capas con carpetas para **configuración**, **modelos**, **servicios**, **controladores** y **rutas**. La conexión a MongoDB se gestiona con Mongoose y se delegan las operaciones a un servicio que encapsula la lógica de negocio. El archivo `src/app.js` expone la aplicación Express y arranca el servidor cuando se ejecuta como proceso principal.
- **`frontend/`**: Contiene una aplicación React sencilla creada con `react-scripts`. Se utilizan componentes funcionales para las distintas vistas: inicio de sesión, dashboard, inventario y listado de reservas. El enrutado se gestiona con `react-router-dom` y las llamadas al backend se realizan con Axios.  

La organización en capas facilita el mantenimiento y las pruebas; cada capa se encarga de una responsabilidad concreta:

1. **Modelos (`models/`)**: Definen la estructura de los documentos en MongoDB (por ejemplo `Reservation`).
2. **Servicios (`services/`)**: Encapsulan la lógica de negocio y las operaciones sobre los modelos.
3. **Controladores (`controllers/`)**: Gestionan las peticiones HTTP, validan los datos y delegan en los servicios.
4. **Rutas (`routes/`)**: Definen los endpoints y asocian cada uno a su controlador.

Además se incluyen pruebas automatizadas de **unidad**, **integración** y de **componente** utilizando **Jest** y **Supertest** en el backend y **React Testing Library** en el frontend.

## Puesta en marcha local

Para ejecutar la aplicación en tu entorno local necesitas Node.js ≥ 16 y MongoDB. Configura la variable de entorno `MONGODB_URI` con la cadena de conexión a tu base de datos. Cada paquete tiene su propio `package.json` así que debes instalar las dependencias de forma independiente:

```bash
cd backend
npm install

# Arrancar API (asume puerto 4000 por defecto)
npm start

cd ../frontend
npm install

# Levantar frontend de desarrollo en http://localhost:3000
npm start
```

Con ambos servidores en marcha, podrás navegar por las vistas de la aplicación. El inventario contiene productos de ejemplo y al hacer una reserva se enviará una petición POST al backend, que la guardará en la base de datos.

## Despliegue en Vercel

Para desplegar en **Vercel** puedes utilizar un único repositorio con dos directorios. Vercel detectará automáticamente un proyecto de Node.js en `backend` y de React en `frontend` si configuras los `vercel.json` o las opciones de despliegue en la interfaz. Una estrategia común es:

1. Crear un repositorio con este contenido y subirlo a GitHub.
2. En Vercel, importar el repositorio y configurar dos proyectos:
   - **Backend**: en las opciones de construcción indica como directorio `backend`, comando de build `npm install` y comando de salida `npm start`. Define la variable de entorno `MONGODB_URI` en Vercel con la cadena de conexión a MongoDB Atlas u otro proveedor.
   - **Frontend**: en las opciones de construcción selecciona el directorio `frontend`, el comando de construcción `npm run build` y directorio de salida `build`. Define la variable `REACT_APP_API_URL` con la URL de tu API backend desplegada.
3. Tras la primera publicación, el frontend consumirá la API del backend desplegado y la aplicación quedará disponible.

Consulta la documentación oficial de Vercel para ajustar estos pasos a tu flujo de trabajo.

## Ejecución de pruebas

Para ejecutar las pruebas del backend:

```bash
cd backend
npm test
```

Esto ejecutará las pruebas unitarias de los controladores y las pruebas de integración de las rutas con Supertest.

Para las pruebas del frontend:

```bash
cd frontend
npm test
```

Se lanzarán los tests definidos para los componentes React.

## Uso

1. **Inicio de sesión**: La vista de login permite introducir correo y contraseña, aunque en este ejemplo no hay autenticación real; se redirige directamente al dashboard.
2. **Dashboard**: Muestra métricas generales de ventas, productos en stock y desglose por categoría y región. Se utiliza información estática para simular los gráficos de ejemplo.
3. **Inventario**: Presenta una lista de productos con su precio, descripción y stock. Al pulsar **Reservar Ahora** se envía una solicitud al backend para crear una reserva.
4. **Reservas**: Lista las reservas existentes recuperadas del backend. Permite visualizar los detalles (en un `alert`) y eliminar una reserva.