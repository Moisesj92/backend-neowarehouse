# Backend NeoWarehouse

API REST construida con Express + TypeScript + Node 22 para el sistema de gestión de almacenes NeoWarehouse.

## 📋 Requisitos previos

- [Docker](https://www.docker.com/get-started) y Docker Compose instalados en tu sistema
- [Node.js 22](https://nodejs.org/) (opcional, para desarrollo local sin Docker)
- [pnpm](https://pnpm.io/) (opcional, para desarrollo local sin Docker)

## 🚀 Configuración inicial

1. **Clonar el repositorio** (si aún no lo has hecho)

2. **Configurar variables de entorno**

   Copia el archivo de ejemplo y ajusta las variables según sea necesario:

   ```bash
   cp .env.example .env
   ```

   El archivo `.env` contiene la configuración de la base de datos PostgreSQL:

   ```
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=neo_warehouse
   DB_USER=postgres
   DB_PASSWORD=postgres123
   ```

3. **Iniciar los servicios con Docker**

   ```bash
   docker compose up
   ```

   Esto iniciará:

   - El servidor API en `http://localhost:3000`
   - PostgreSQL en el puerto `5432`

## 🛠️ Desarrollo

### Con Docker (recomendado)

```bash
# Iniciar en modo desarrollo con hot-reload
docker compose up

# Ver logs
docker compose logs -f app

# Detener servicios
docker compose down

# Detener servicios y eliminar volúmenes
docker compose down -v
```

### Sin Docker (local)

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Ejecutar en producción
pnpm start
```

## 📁 Estructura del proyecto

```
backend-neowarehouse/
├── src/
│   └── index.ts          # Punto de entrada de la aplicación
├── dist/                 # Archivos compilados (generados)
├── .env                  # Variables de entorno (no versionado)
├── .env.example          # Ejemplo de variables de entorno
├── compose.yml           # Configuración de Docker Compose
├── Dockerfile            # Imagen de Docker
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript
└── README.md
```

## 🔌 API Endpoints

### Prueba de conexión

```
GET http://localhost:3000/
```

Respuesta:

```json
{
  "mensaje": "¡Hola Mundo!",
  "tecnologia": "Express + TypeScript + Node 22",
  "status": "OK"
}
```

## 📦 Scripts disponibles

- `pnpm dev` - Inicia el servidor en modo desarrollo con hot-reload
- `pnpm build` - Compila el código TypeScript a JavaScript
- `pnpm start` - Ejecuta la aplicación compilada

## 🐳 Comandos útiles de Docker

```bash
# Reconstruir las imágenes
docker compose build

# Ejecutar en segundo plano
docker compose up -d

# Ver contenedores en ejecución
docker compose ps

# Entrar al contenedor de la app
docker compose exec app sh

# Entrar al contenedor de PostgreSQL
docker compose exec db psql -U postgres -d neo_warehouse
```

## 🗄️ Base de datos

La aplicación utiliza PostgreSQL 18.1 Alpine. Los datos se persisten en un volumen de Docker llamado `postgres_data`.

Para conectarte directamente a la base de datos:

```bash
docker compose exec db psql -U postgres -d neo_warehouse
```

## 🔧 Tecnologías utilizadas

- **Node.js** v22.20.0
- **Express** v5.2.1
- **TypeScript** v5.9.3
- **PostgreSQL** v18.1
- **Docker** & Docker Compose
- **pnpm** - Gestor de paquetes
- **tsx** - TypeScript executor con hot-reload
- **tsup** - Bundler para TypeScript

## 📝 Licencia

ISC
