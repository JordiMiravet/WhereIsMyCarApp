# WhereIsMyCar app

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-TS-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-6C2BD9?style=for-the-badge&logo=primeng&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![FullCalendar](https://img.shields.io/badge/FullCalendar-3788D8?style=for-the-badge&logo=fullcalendar&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Jasmine-8A4Baf?style=for-the-badge&logo=jasmine&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)



## Index

- [Descripción de la Aplicación](#descripción-de-la-aplicación)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación del Proyecto](#instalación-del-proyecto)
- [Uso](#uso)
- [Vista Previa del Proyecto](#vista-previa-del-proyecto)
- [Tests](#tests)
- [Contribución](#Contribución)
- [GH-Pages](#gh-pages)
- [Autor](#autor)

---

## Descripción de la Aplicación:

Este proyecto consiste en una aplicación desarrollada con Angular 20 orientada a la gestión personalizada de un garaje de vehículos. La aplicación permite a cada usuario administrar sus propios coches, registrar su ubicación, planificar su uso mediante un calendario y visualizar estadísticas detalladas de utilización.

La aplicación está estructurada en módulos y componentes reutilizables, e integra autenticación de usuarios, protección de rutas mediante Guards, consumo de APIs, gestión de estado, formularios reactivos con validaciones y persistencia de datos en base de datos.

La funcionalidad principal se organiza en diferentes bloques:
- **Autenticación de usuarios:** Registro y login mediante email y contraseña. Cada usuario dispone de su propio perfil y datos independientes.
- **Gestión de vehículos (CRUD):** Creación, edición y eliminación de coches dentro del garaje personal.
- **Gestión de ubicación en mapa:** Visualización de los vehículos en un mapa interactivo donde es posible actualizar su posición mediante drag & drop para indicar dónde se han aparcado.
- **Calendario de eventos:** Planificación de eventos asociados a cada coche con fecha y hora específicas.
- **Control de solapamientos:** El sistema impide la creación de eventos que coincidan en horario para el mismo vehículo.
- **Filtrado dinámico:** Posibilidad de visualizar eventos de un coche concreto o de todos los vehículos.
- **Gestión de eventos (CRUD):** Creación, edición y eliminación de eventos desde el calendario.
- **Sistema de comentarios:** Los usuarios pueden añadir comentarios en los eventos registrados.

- Panel de estadísticas: Visualización de gráficos que muestran:
    - Total de horas acumuladas por coche.
    - Vehículo más utilizado.
    - Distribución de horas de uso por día de la semana.

La aplicación combina gestión de datos, visualización geográfica, planificación temporal y análisis estadístico dentro de una única plataforma integrada.

## Tecnologías

- `HTML5`
- `CSS3`
- `JavaScript`
- `TypeScript`
- `Angular 20`
- `PrimeNG`
- `Leaflet`
- `FullCalendar`
- `Chart.js`
- `NestJS`
- `MongoDB`
- `Firebase Authentication`
- Testing con `Jasmine`

---

## Estructura del Proyecto

```bash
whereismycarapp
├──src
│   ├──app
│   │   ├──features
│   │   │   ├──auth
│   │   │   │   ├──login
│   │   │   │   ├──register
│   │   │   │   └──services
│   │   │   │
│   │   │   ├──calendar
│   │   │   │   ├──components
│   │   │   │   │   └──calendar-view
│   │   │   │   ├──interfaces
│   │   │   │   │   └──event.ts
│   │   │   │   ├──modals
│   │   │   │   │   ├──day-events-modal
│   │   │   │   │   └──event-form-modal
│   │   │   │   └──services
│   │   │   │
│   │   │   ├──graphics
│   │   │   │   ├──components
│   │   │   │   │   └──graphics-view
│   │   │   │   ├──interfaces
│   │   │   │   │   └──VehicleMetrics.ts
│   │   │   │   └──services
│   │   │   ├──map
│   │   │   │   ├──components
│   │   │   │   │   ├──buttons
│   │   │   │   │   │   └──user-location-button
│   │   │   │   │   └──map-view
│   │   │   │   └──services
│   │   │   └──vehicle
│   │   │       ├──components
│   │   │       │   ├──vehicle-empty-state
│   │   │       │   ├──vehicle-selector
│   │   │       │   └──vehicle-table
│   │   │       ├──interfaces
│   │   │       │   └──vehicle.ts
│   │   │       ├──modals
│   │   │       │   └──vehicle-form-modal
│   │   │       └──services
│   │   │           ├──vehicle-modal-state-service
│   │   │           └──vehicle-service
│   │   ├──pages
│   │   │   ├──calendar
│   │   │   ├──graphics
│   │   │   ├──home
│   │   │   └──map
│   │   ├──shared
│   │   │   ├──components
│   │   │   │   ├──buttons
│   │   │   │   │   ├──create-button
│   │   │   │   │   ├──delete-button
│   │   │   │   │   └──edit-button
│   │   │   │   └──modals
│   │   │   │       └──confirm-modal
│   │   │   ├──layout
│   │   │   │   ├──auth-actions
│   │   │   │   ├──header
│   │   │   │   └──navigation
│   │   │   └──services
│   │   │       └──geolocation
│   │   │
│   │   ├──app.config.ts
│   │   ├──app.css
│   │   ├──app.html
│   │   ├──app.routes.ts
│   │   ├──app.spec.ts
│   │   └──app.ts
│   ├──assets
│   │   └──icons
│   ├──index.html
│   ├──main.ts
│   └──styles.css

```

---

## Instalación del Proyecto

La aplicación está dividida en dos repositorios:
- Frontend → Angular 20 (https://github.com/JordiMiravet/WhereIsMyCarApp.git)
- Backend → NestJS (https://github.com/JordiMiravet/WhereIsMyCarApp-backend.git)

Es necesario levantar ambos para que funcione correctamente.
### Requisitos previos

- Node.js v20 o superior
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB en ejecución

### 1. Frontend

Clonar el repositorio:

```bash
    git clone https://github.com/JordiMiravet/WhereIsMyCarApp.git
    cd whereismycarapp
    npm install
```
Configuración de Firebase

El frontend utiliza Firebase Authentication, por lo que necesitas crear tu propio proyecto en Firebase.
1. Crear un proyecto en https://console.firebase.google.com
2. Activar Authentication con Email/Password
3. En la configuración del proyecto, añadir una aplicación web
4. Copiar la configuración que te da Firebase

Dentro de src, crear la carpeta environments y añadir el archivo:

```bash
    src/environments/environment.ts
```

Con el siguiente contenido, reemplazando los valores por los de tu proyecto:

```typescript
    export const environment = {
        production: true,
        firebaseConfig: {
            apiKey: "TU_API_KEY",
            authDomain: "TU_AUTH_DOMAIN",
            projectId: "TU_PROJECT_ID",
            storageBucket: "TU_STORAGE_BUCKET",
            messagingSenderId: "TU_MESSAGING_SENDER_ID",
            appId: "TU_APP_ID"
        }
    };

```

### 2. Backend

Clonar el repositorio del backend:
```bash
    git clone https://github.com/JordiMiravet/WhereIsMyCarApp-backend.git
    cd whereismycar-backend
    npm install
```

Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

```env
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/whereismycar

    FIREBASE_PROJECT_ID=tu_project_id
    FIREBASE_CLIENT_EMAIL=tu_client_email
    FIREBASE_PRIVATE_KEY=tu_private_key
```
Las credenciales de Firebase se obtienen desde:
Firebase Console → Configuración del Proyecto → Cuentas de servicio → Generar nueva clave privada.
Del archivo JSON descargado necesitas:
- project_id
- client_email
- private_key

La private_key debe mantenerse en una sola línea y conservar los \n.

### 3. Ejecutar la aplicación

Primero levantar el backend:

```code
    npm run start:dev
```

Después, en otra terminal en el proyecto de frontend, levantar el frontend:

```bash
    ng serve
```

Abrir en el navegador:

```bash
    http://localhost:4200
```


Notas
- Es necesario tener Node.js instalado.
- Angular CLI debe estar instalado globalmente:
```bash
    npm install -g @angular/cli
```
- Las claves reales no están incluidas en el repositorio.
- Cada desarrollador debe usar su propio proyecto de Firebase.

---

1. Uso

Aquí explicas cómo interactuar con la app una vez que está corriendo. Por ejemplo:

    1. Abrir la aplicación en el navegador: http://localhost:4200
    2. Registrar un nuevo usuario con email y contraseña.
    3. Iniciar sesión con tus credenciales.
    4. Crear, editar o eliminar un vehículo desde el panel de gestión de vehículos (Home).
    5. Mover coches en el mapa para actualizar su ubicación. (Map)
        - Por defecto se muestran todos los coches.
        - Filtrando un vehículo concreto, solo se mostrará la localización de ese coche.
    6. Añadir, editar o eliminar eventos al calendario para cada coche. (Calendar)
        - La app evita conflictos de horario entre eventos de un mismo coche.
        - Por defecto se muestran los eventos de todos los vehículos.
        - Filtrando un vehículo concreto, solo se verán los eventos de ese coche.
    7. Visualizar estadísticas en la sección de gráficos. (Graphics)

