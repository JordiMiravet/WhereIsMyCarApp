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
//////////////////////// Estoy por aqui
---

## Instalación del proyecto

#### Requisitos previos
- Antes de instalar el proyecto asegúrate de tener:
    - Navegador web
    - node > 22
    - npm > 10
    - Angular CLI (instalado globalmente)
    

1. Clona el repositorio:

```bash
    git clone https://github.com/JordiMiravet/Bootcamp-S7.git
```

2. Instala dependencias:

```bash
    npm install
```

3. Ejecuta el servidor:

```bash
    ng serve
```

4. Abrir en el navegador:

```bash
    http://localhost:4200
```

---

## Uso

Tras iniciar la aplicación, el usuario puede:

1. **Registro y login de usuarios**: Los usuarios pueden crear una cuenta y loguearse para acceder al contenido protegido.
2. **Acceder a la página principal**: Se muestra un listado de naves espaciales con información básica como nombre y modelo.
3. **Navegación paginada**: Solo se cargan inicialmente las primeras 10 naves, y el usuario puede cargar más mediante el _scroll infinito_.
4. **Ver detalles de cada nave**: Haciendo clic en cualquier nave del listado, se accede a su ficha completa con todos los atributos disponibles (fabricante, costo, velocidad, tripulación, pasajeros, clase de nave, etc.).
5. **Explorar pilotos asociados**: Dentro de la ficha de cada nave, se pueden ver tarjetas con los pilotos que la han manejado.
6. **Consultar películas relacionadas**: Se muestran las películas en las que aparece cada nave.
7. **Protección de rutas**: El listado de naves y los detalles solo están disponibles para usuarios registrados.
8. **Navegación dinámica**: El usuario puede volver a la lista de naves o moverse entre secciones mediante la barra de navegación.

---

## Vista Previa del proyecto

1. Registro de usuario
- El usuario puede registrarse únicamente si el correo no está registrado previamente.
- Tras registrarse, se redirige automáticamente a la lista de naves.
- En caso de que el email ya exista, se muestra un mensaje de error.

![register](/public/assets/readme/sw_register.gif)

2. Login de usuario
- El usuario puede iniciar sesión solo si el correo y la contraseña coinciden.
- Tras iniciar sesión, se redirige automáticamente a la lista de naves.
- Si los datos son incorrectos, se muestra un mensaje de error.

![login](/public/assets/readme/sw_login.gif)

3. Logout de usuario
- El usuario puede cerrar sesión.
- Una vez hecho logout, no podrá acceder a la información protegida de la página.

![logout](/public/assets/readme/sw_logout.gif)

4. Lista de naves:
- Se carga dinámicamente una lista de naves usando scroll infinito.

![list](/public/assets/readme/sw_list_infinite-scroll.gif)

5. Detalle de una nave especifica
- Se muestran los detalles de la nave seleccionada de la lista.
- Mientras se cargan los datos, se muestra un mensaje de carga y, si ocurre un error, aparece un mensaje de error.

![detail](/public/assets/readme/sw_detail.gif)

---

## Tests

La aplicación incluye pruebas unitarias con `Jasmine` y se ejecutan mediante `Karma`.  

#### Resumen
- `32 specs` ejecutadas
- `0 fallos`
- Componentes y servicios principales testeados:
    - Componentes: HeaderComponent, LoginComponent, RegisterComponent, StarshipsListComponent, StarshipInfoComponent, StarshipPilotsComponent, StarshipFilmsComponent, StarshipDetailComponent
    - Servicios: UserService, StarshipsService

#### Ejemplo destacado

Se verifica que un usuario pueda loguearse correctamente:

```ts
    it('should call onSubmit and attempt login when form is valid', () => {
    component.formLogin.setValue({
        email: 'pleaseStopTesting@gmail.com',
        password: '123456'
    })
    
    let called = false;
    (component as any).userService.login = () => {
        called = true;
        return Promise.resolve();
    };
    
    component.onSubmit();

    expect(called).toBe(true);
    });
```

También se validan formularios reactivos y mensajes de error:

```ts
    it('should display error messages for invalid email and password', () => {
    const emailControl = component.formLogin.controls['email'];
    const passwordControl = component.formLogin.controls['password'];

    emailControl.setValue(''); 
    emailControl.markAsTouched();
    passwordControl.setValue('');
    passwordControl.markAsTouched();

    expect(emailControl.invalid).toBeTrue();
    expect(passwordControl.invalid).toBeTrue();

    expect(component.message.invalidEmail).toBe('Please enter a valid email');
    expect(component.message.invalidPassword).toBe('Please enter a password that contains at least 6 characters');
    });
```
#### Ejecutar test

- Para correr todos los tests locales:

```bash
    ng test
```

---

## Contribución
 
Para colaborar en este proyecto, sigue estos pasos:

1. Haz un **fork** del repositorio.

```bash
https://github.com/JordiMiravet/Bootcamp-S7.git
```

2. Crea una nueva rama para tu funcionalidad o corrección:

```bash
   git checkout -b feature/nueva-funcionalidad

```

3. Realiza los cambios y asegúrate de que los test pasan correctamente.

4. Haz un commit siguiendo las Conventional Commits:

```bash
    feat: añade nueva funcionalidad
    fix: corrige error
    docs: actualiza documentación
```

5. Envía un Pull Request describiendo tus cambios.

---

## GH-Pages
[Abrir proyecto](https://jordimiravet.github.io/Bootcamp-S7/)

---

## Autor

```bash
    Jordi Miravet – Bootcamp S7 : StarWars app
```


