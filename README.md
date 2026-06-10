# Instalación y Ejecución Local

Este documento detalla el procedimiento paso a paso para clonar, configurar y ejecutar la aplicación **Harmony Music** de forma local.

## Repositorio
https://github.com/Edsal18/Harmony-music-test

## Requisitos Previos del Sistema
Antes de comenzar con el proceso de instalación, contar con las siguientes herramientas instaladas en tu equipo de desarrollo:

*   **Node.js:** Se recomienda la versión **18.x o superior**.
*   **Git:** Herramienta para clonar el repositorio del proyecto desde la consola de comandos.

| Herramienta | Versión Recomendada |
| :--- | :--- |
| Node.js | 18.x + |
| Git | Última estable |

---

## Paso 1: Clonar y Acceder al Repositorio
Abre una terminal en tu sistema y ejecuta los siguientes comandos para descargar el código fuente:

```bash
# Clonar el proyecto
git clone https://github.com/Edsal18/Harmony-music-test.git

# Entrar a la carpeta raíz del proyecto
cd Harmony-music-test
```

## Paso 2: Configuración del Servidor Backend y Base de Datos
El backend expone una API REST construida en Node.js y Express.js y utiliza Prisma ORM con una base de datos local SQLite autónoma.

1.  Entrar a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instalar dependencias locales:
    ```bash
    npm install
    ```
3.  Crear archivo de configuración de entorno (.env):
    *   En macOS / Linux (Terminal):
        ```bash
        cp .env.example .env
        ```
    *   En Windows (CMD):
        ```cmd
        copy .env.example .env
        ```
    *   En Windows (PowerShell):
        ```powershell
        Copy-Item .env.example .env
        ```
4.  Crear e inicializar la Base de Datos SQLite:
    ```bash
    npx prisma db push
    ```
5.  Poblar la base de datos (Carga Semilla):
    ```bash
    node prisma/seed.js
    ```
6.  Iniciar el servidor en modo desarrollo:
    ```bash
    npm run dev
    ```

El backend estará ejecutándose en http://localhost:5001.

## Paso 3: Configuración de la Interfaz Frontend
El frontend está desarrollado en React con Vite y diseñado con estilos oscuros premium utilizando Tailwind CSS.

1.  Abrir una nueva ventana o pestaña de la terminal.
2.  Entrar a la carpeta del frontend:
    ```bash
    cd frontend
    ```
3.  Instalar dependencias del cliente:
    ```bash
    npm install
    ```
4.  Crear el archivo de entorno (.env):
    *   En macOS / Linux (Terminal):
        ```bash
        cp .env.example .env
        ```
    *   En Windows (CMD):
        ```cmd
        copy .env.example .env
        ```
    *   En Windows (PowerShell):
        ```powershell
        Copy-Item .env.example .env
        ```
5.  Iniciar la aplicación cliente:
    ```bash
    npm run dev
    ```

El frontend estará listo en el enlace local http://localhost:5173.

## Credenciales para Pruebas del Sistema
Una vez levantada la aplicación, abrir http://localhost:5173 en el navegador.

En la siguiente tabla se muestra las credenciales para acceder a los dos tipos de usuarios:

| Rol / Nivel | Correo Electrónico | Contraseña | Permisos y Capacidades |
| :--- | :--- | :--- | :--- |
| Administrador (ADMIN) | admin@harmony.com | admin123 | Acceso al Panel de Administración (Dashboard), visualización del catálogo, y permisos CRUD. |
| Usuario Regular (USER) | user@harmony.com | user123 | Visualización del catálogo de inicio, uso de filtros y búsquedas. |

## Arquitectura de Base de Datos (3NF)
1.  **Role:** Define los roles del sistema (ADMIN, USER).
2.  **User:** Registra las credenciales de acceso de los usuarios (email y contraseña cifrada con bcryptjs), enlazado directamente a su rol mediante RoleId.
3.  **Category:** Define las agrupaciones lógicas de productos (ej: Cuerdas, Teclados, Percusión).
4.  **Item:** Contiene la información técnica e imágenes de cada instrumento (title, description, price, imageUrl), asociado a su respectiva categoría mediante CategoryId.
