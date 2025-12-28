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
   DB_PORT=5432
   DB_NAME=neo_warehouse
   DB_USER=postgres
   DB_PASSWORD=postgres123
   ```

3. **Iniciar los servicios con Docker**

   ```bash
   # Construir e iniciar los servicios
   docker compose up -d

   # Ejecutar migraciones de Prisma
   docker compose exec app pnpm prisma migrate dev
   ```

   Esto iniciará:

   - El servidor API en `http://localhost:3000`
   - PostgreSQL en el puerto `5432`

## 🛠️ Desarrollo

### Con Docker (recomendado)

```bash
# Iniciar en modo desarrollo con hot-reload
docker compose up

# Ejecutar en segundo plano
docker compose up -d

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

# Generar Prisma Client
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

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
│   ├── index.ts                    # Punto de entrada de la aplicación
│   ├── controllers/                # Controladores de las rutas
│   │   ├── category.controller.ts
│   │   ├── product.controller.ts
│   │   └── inventoryMovement.controller.ts
│   ├── services/                   # Lógica de negocio
│   │   ├── category.service.ts
│   │   ├── product.service.ts
│   │   └── inventoryMovement.service.ts
│   ├── repositories/               # Acceso a datos (Prisma)
│   │   ├── category.repository.ts
│   │   ├── product.repository.ts
│   │   └── inventoryMovement.repository.ts
│   ├── routes/                     # Definición de rutas
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   └── inventoryMovement.routes.ts
│   ├── schemas/                    # Validaciones con Zod
│   │   ├── common.schema.ts
│   │   ├── category.schema.ts
│   │   ├── product.schema.ts
│   │   └── inventoryMovement.schema.ts
│   ├── middlewares/                # Middlewares personalizados
│   │   └── validate.middleware.ts
│   ├── lib/                        # Utilidades y configuraciones
│   │   └── prisma.ts
│   └── generated/                  # Cliente de Prisma generado
│       └── prisma/
├── prisma/
│   ├── schema.prisma               # Esquema de base de datos
│   └── migrations/                 # Migraciones de base de datos
├── dist/                           # Archivos compilados (generados)
├── .env                            # Variables de entorno (no versionado)
├── .env.example                    # Ejemplo de variables de entorno
├── compose.yml                     # Configuración de Docker Compose
├── Dockerfile                      # Imagen de Docker
├── package.json                    # Dependencias y scripts
├── tsconfig.json                   # Configuración de TypeScript
├── prisma.config.ts                # Configuración de Prisma
└── README.md
```

## 🔌 API Endpoints

### Health Check

```
GET /api/status
```

Respuesta:

```json
{
  "status": "Running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Categorías

- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/:id` - Obtener una categoría por ID
- `POST /api/categories` - Crear una categoría
- `PUT /api/categories/:id` - Actualizar una categoría
- `PATCH /api/categories/:id` - Actualizar parcialmente una categoría
- `DELETE /api/categories/:id` - Eliminar una categoría

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID
- `POST /api/products` - Crear un producto
- `PUT /api/products/:id` - Actualizar un producto
- `PATCH /api/products/:id` - Actualizar parcialmente un producto
- `DELETE /api/products/:id` - Eliminar un producto

### Movimientos de Inventario

- `GET /api/inventory-movements` - Obtener todos los movimientos
- `GET /api/inventory-movements/:id` - Obtener un movimiento por ID
- `GET /api/inventory-movements/product/:productId` - Obtener movimientos por producto
- `GET /api/inventory-movements/product/:productId/stock` - Obtener stock actual calculado
- `POST /api/inventory-movements` - Crear un movimiento (IN, OUT, ADJUSTMENT)

## 📦 Scripts disponibles

- `pnpm dev` - Inicia el servidor en modo desarrollo con hot-reload
- `pnpm build` - Compila el código TypeScript a JavaScript
- `pnpm start` - Ejecuta la aplicación compilada
- `pnpm prisma generate` - Genera el cliente de Prisma
- `pnpm prisma migrate dev` - Ejecuta migraciones en desarrollo
- `pnpm prisma migrate deploy` - Ejecuta migraciones en producción
- `pnpm prisma studio` - Abre Prisma Studio para visualizar datos

## 🐳 Comandos útiles de Docker

```bash
# Reconstruir las imágenes
docker compose build

# Iniciar servicios en segundo plano
docker compose up -d

# Ver contenedores en ejecución
docker compose ps

# Entrar al contenedor de la app
docker compose exec app sh

# Ejecutar migraciones de Prisma
docker compose exec app pnpm prisma migrate dev

# Ejecutar migraciones en producción
docker compose exec app pnpm prisma migrate deploy

# Generar Prisma Client
docker compose exec app pnpm prisma generate

# Abrir Prisma Studio
docker compose exec app pnpm prisma studio

# Ver logs de la app
docker compose logs -f app

# Reiniciar solo la app
docker compose restart app

# Entrar al contenedor de PostgreSQL
docker compose exec db psql -U postgres -d neo_warehouse

# Hacer backup de la base de datos
docker compose exec db pg_dump -U postgres neo_warehouse > backup.sql

# Restaurar backup
docker compose exec -T db psql -U postgres -d neo_warehouse < backup.sql
```

## 🗄️ Base de datos

La aplicación utiliza PostgreSQL 18.1 Alpine con Prisma como ORM. Los datos se persisten en un volumen de Docker llamado `postgres_data`.

### Gestión de migraciones

```bash
# Crear una nueva migración
docker compose exec app pnpm prisma migrate dev --name nombre_migracion

# Aplicar migraciones pendientes
docker compose exec app pnpm prisma migrate deploy

# Resetear la base de datos (¡cuidado en producción!)
docker compose exec app pnpm prisma migrate reset

# Ver estado de migraciones
docker compose exec app pnpm prisma migrate status
```

Para conectarte directamente a la base de datos:

```bash
docker compose exec db psql -U postgres -d neo_warehouse
```

## 🔧 Tecnologías utilizadas

- **Node.js** v22.20.0
- **Express** v5.2.1
- **TypeScript** v5.9.3
- **Prisma** - ORM para Node.js y TypeScript
- **PostgreSQL** v18.1
- **Docker** & Docker Compose
- **pnpm** - Gestor de paquetes
- **tsx** - TypeScript executor con hot-reload
- **tsup** - Bundler para TypeScript
- **Zod** - Validación de esquemas TypeScript-first
- **CORS** - Manejo de políticas de origen cruzado

## 📝 Licencia

ISC

## 🤔 Decisiones de diseño

### ¿Por qué elegiste este stack?

- **Node.js 22 + TypeScript**: Proporciona type-safety, mejor mantenibilidad y aprovecha las últimas características de JavaScript/Node.js
- **Express 5**: Framework minimalista y maduro, ideal para APIs REST con gran ecosistema de middleware, además quería aprender más sobre Express y usarlo en un nuevo proyecto
- **Prisma ORM**: Es el estándar moderno para Node.js y Express, compatible con TypeScript y ofrece un excelente cliente tipado
- **PostgreSQL 18**: Base de datos relacional robusta, perfecta para manejar transacciones complejas de inventario
- **Docker**: Garantiza consistencia entre entornos de desarrollo, testing y producción
- **pnpm**: Gestor de paquetes más rápido y eficiente en espacio que npm/yarn
- **Zod**: Validación de esquemas con inferencia de tipos TypeScript, integración perfecta con el stack

### ¿Cómo modelaste el inventario?

El modelo de datos está estructurado en tres entidades principales:

#### **Entidades principales:**

1. **Category** (Categoría)

   - `id`: UUID (clave primaria)
   - `name`: String único
   - `createdAt`, `updatedAt`: Timestamps para auditoría
   - Relación: Una categoría puede tener múltiples productos

2. **Product** (Producto)

   - `id`: UUID (clave primaria)
   - `name`: String
   - `price`: Integer (precio en centavos para evitar problemas de punto flotante)
   - `stock`: Integer (stock actual calculado)
   - `categoryId`: UUID (clave foránea)
   - `createdAt`, `updatedAt`: Timestamps para auditoría
   - Relación: Pertenece a una categoría, tiene múltiples movimientos de inventario

3. **InventoryMovement** (Movimiento de Inventario)
   - `id`: UUID (clave primaria)
   - `productId`: UUID (clave foránea)
   - `type`: Enum (IN, OUT, ADJUSTMENT)
   - `quantity`: Integer
   - `reason`: String opcional (obligatorio para ADJUSTMENT)
   - `referenceNumber`: String opcional
   - `createdAt`, `updatedAt`: Timestamps para auditoría
   - Relación: Pertenece a un producto

#### **Tracking de movimientos:**

- **IN (Entrada)**: Incrementa el stock (compras, devoluciones de clientes)
- **OUT (Salida)**: Decrementa el stock (ventas, transferencias)
- **ADJUSTMENT (Ajuste)**: Establece un nuevo valor de stock (correcciones, inventarios físicos)

#### **Campos de auditoría:**

Todas las entidades incluyen `createdAt` y `updatedAt` para trazabilidad completa de cambios.

#### **Cálculo de stock:**

El stock se calcula dinámicamente basándose en los movimientos:

- Si existe un ADJUSTMENT, se toma el más reciente como punto de partida
- Se suman todos los movimientos IN posteriores
- Se restan todos los movimientos OUT posteriores
- El resultado se almacena en el campo `stock` del producto para consultas rápidas

### ¿Qué operaciones de inventario decidiste soportar?

#### **CRUD de Categorías:**

- Crear, leer, actualizar y eliminar categorías
- Validación: No se puede eliminar una categoría con productos asociados
- Unicidad: Los nombres de categorías son únicos (case-insensitive)

#### **CRUD de Productos:**

- Crear, leer, actualizar y eliminar productos
- Validaciones:
  - Precio debe ser positivo y no exceder 100,000,000 centavos
  - Stock no puede ser negativo
  - Nombre único por producto
  - Categoría debe existir
- Búsqueda: Búsqueda de productos por nombre (case-insensitive)

#### **Movimientos de Inventario:**

1. **Entrada de stock (IN)**

   - Registra recepciones de mercancía
   - Incrementa el stock automáticamente
   - Puede incluir número de referencia (ej: número de orden de compra)

2. **Salida de stock (OUT)**

   - Registra despachos/ventas
   - Valida que haya stock suficiente antes de permitir la operación
   - Decrementa el stock automáticamente
   - Retorna error si no hay stock suficiente

3. **Ajustes de inventario (ADJUSTMENT)**
   - Para correcciones o conteos físicos
   - Establece un nuevo valor de stock absoluto
   - Requiere obligatoriamente una razón explicativa
   - Sirve como punto de referencia para futuros cálculos

#### **Consultas:**

- Stock actual por producto (calculado dinámicamente)
- Historial completo de movimientos (ordenado por fecha descendente)
- Movimientos filtrados por producto
- Comparación entre stock calculado y stock almacenado

### ¿Qué validaciones implementaste en el backend?

#### **Validaciones de esquema (usando Zod):**

- **Tipos de datos**: Validación estricta de tipos (UUID, String, Number, Enum)
- **Campos requeridos**: Validación de campos obligatorios
- **Formatos**:

  - UUIDs válidos para IDs
  - Strings con longitud máxima definida
  - Números enteros donde corresponde
  - Enums para tipos de movimiento

- **Categorías:**
  - Nombre: Requerido, máximo 50 caracteres, trimmed
- **Productos:**

  - Nombre: Requerido, 1-100 caracteres, trimmed
  - Precio: Entero positivo
  - Stock: Entero no negativo, default 0
  - CategoryId: UUID válido

- **Movimientos:**
  - ProductId: UUID válido
  - Type: Enum (IN, OUT, ADJUSTMENT)
  - Quantity: Entero positivo
  - Reason: Máximo 500 caracteres (obligatorio para ADJUSTMENT)
  - ReferenceNumber: Máximo 100 caracteres (opcional)

#### **Validaciones de negocio:**

- **Productos:**

  - Stock no puede ser negativo
  - Precio debe ser positivo y no exceder 100,000,000
  - Verificación de existencia de categoría antes de crear/actualizar
  - No se permiten nombres duplicados (exactos)
  - No se puede eliminar un producto con movimientos asociados (integridad referencial)

- **Categorías:**

  - Nombres únicos (case-insensitive)
  - No se puede eliminar una categoría con productos asociados
  - Verificación de existencia antes de operaciones

- **Movimientos de inventario:**
  - Cantidad debe ser mayor que 0
  - Para movimientos OUT: Verificación de stock suficiente antes de permitir la operación
  - Para movimientos ADJUSTMENT: Razón obligatoria
  - Verificación de existencia del producto antes de crear movimiento
  - Actualización automática del stock del producto después de cada movimiento

#### **Manejo de errores:**

Respuestas HTTP apropiadas con mensajes descriptivos:

- **400 Bad Request**: Errores de validación (datos inválidos, formato incorrecto)
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflictos de negocio (nombres duplicados, stock insuficiente, restricciones de integridad)
- **500 Internal Server Error**: Errores del servidor

Cada error incluye:

```json
{
  "error": "Mensaje descriptivo del error",
  "message": "Detalles adicionales (para errores de validación)",
  "errors": [
    {
      "field": "nombre_del_campo",
      "message": "Descripción del error"
    }
  ]
}
```

#### **Arquitectura de validación:**

1. **Nivel de ruta**: Middleware [`validate`](src/middlewares/validate.middleware.ts) con esquemas Zod
2. **Nivel de servicio**: Validaciones de negocio en [`product.service.ts`](src/services/product.service.ts), [`category.service.ts`](src/services/category.service.ts) y [`inventoryMovement.service.ts`](src/services/inventoryMovement.service.ts)
3. **Nivel de controlador**: Manejo de errores y respuestas HTTP en [`product.controller.ts`](src/controllers/product.controller.ts), [`category.controller.ts`](src/controllers/category.controller.ts) e [`inventoryMovement.controller.ts`](src/controllers/inventoryMovement.controller.ts)

### ¿Cómo manejaste la sincronización entre frontend y backend?

#### **API REST con respuestas JSON estandarizadas:**

- **Endpoints RESTful**: Siguiendo convenciones REST para operaciones CRUD
- **Códigos HTTP semánticos**: Uso apropiado de códigos de estado
- **Respuestas consistentes**: Formato JSON uniforme en todas las respuestas
- **CORS configurado**: Permite solicitudes desde el frontend

#### **Gestión de stock en tiempo real:**

1. **Transaccionalidad**: Cada movimiento de inventario actualiza automáticamente el stock del producto
2. **Cálculo dinámico**: El stock se calcula basándose en todos los movimientos históricos
3. **Sincronización automática**: Después de cada movimiento ([`inventoryMovement.service.ts`](src/services/inventoryMovement.service.ts)):
   - Se calcula el nuevo stock con [`calculateCurrentStock`](src/repositories/inventoryMovement.repository.ts)
   - Se actualiza el campo `stock` del producto mediante [`productRepository.update`](src/repositories/product.repository.ts)
4. **Validación previa**: Para movimientos OUT, se verifica el stock antes de permitir la operación

#### **Consistencia de datos:**

- **Prisma ORM**: Garantiza integridad referencial y transacciones ACID
- **Pool de conexiones**: Configurado con [`PrismaPg`](src/lib/prisma.ts) adapter para PostgreSQL
- **Graceful shutdown**: Cierre ordenado de conexiones en [`index.ts`](src/index.ts)

#### **Arquitectura en capas:**

```
Cliente (Frontend)
      ↓
Routes (Definición de endpoints)
      ↓
Middlewares (Validación con Zod)
      ↓
Controllers (Manejo de HTTP)
      ↓
Services (Lógica de negocio)
      ↓
Repositories (Acceso a datos)
      ↓
Prisma ORM
      ↓
PostgreSQL
```

Esta arquitectura permite:

- Separación clara de responsabilidades
- Fácil testing y mantenimiento
- Validación en múltiples niveles
- Respuestas consistentes y predecibles
