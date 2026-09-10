# agenteMovilcoBACKEND

API backend de Agentemovilco. Node.js + Express + PostgreSQL (Prisma).

## Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Base de datos:** PostgreSQL vía Prisma 7 (driver adapter `pg`)
- **Validación:** Zod
- **Logging:** Winston (app) + Morgan (requests HTTP)
- **Seguridad/infra:** Helmet, CORS, Compression
- **Dev:** Nodemon

## Estructura

```
src/
  config/       # env y logger
  controllers/  # lógica de cada recurso
  lib/          # cliente de Prisma
  middlewares/  # validate, errorHandler, notFound
  routes/       # definición de endpoints
  validators/   # esquemas zod por recurso
  app.js        # configuración de Express (middlewares + rutas)
  server.js     # arranque del servidor y shutdown
prisma/
  schema.prisma
prisma.config.ts
```

## Base de datos (VPS, sin Postgres local)

No corremos Postgres en el Mac. La base vive en el VPS (`apex-vps`, 46.224.198.194) en un
contenedor Docker **aislado del resto de proyectos** (`agentemovilco-postgres`, red
`agentemovilco-network`, carpeta `/home/deployer/apps/agentemovilco/` en el servidor). Ese
contenedor expone **una sola instancia de Postgres con dos bases lógicas separadas**, cada
una con su propio rol/credenciales:

- `agentemovilco_dev` — para trabajar desde local (tu Mac) y en desarrollo.
- `agentemovilco_prod` — para cuando el backend corra en producción en el mismo VPS.

El puerto de Postgres (`5436`) solo escucha en `127.0.0.1` del VPS — nunca queda expuesto a
internet. Para trabajar desde tu Mac necesitas tu túnel SSH abierto hacia `apex-vps`
reenviando el puerto local `5436` al `127.0.0.1:5436` remoto. Con el túnel abierto, el
`DATABASE_URL` de tu `.env` local apunta a `127.0.0.1:5436` y todo funciona como si Postgres
estuviera en tu máquina.

En producción (backend corriendo en un contenedor en el propio VPS, en la red
`agentemovilco-network`), el `DATABASE_URL` no usa el túnel: se conecta directo por el
nombre del contenedor, `agentemovilco-postgres:5432`.

Las credenciales de `agentemovilco_dev` ya están en tu `.env` local (gitignored). Las de
`agentemovilco_prod` solo existen en el VPS, en
`/home/deployer/apps/agentemovilco/postgres/.env` (no se commitean a ningún repo).

## Puesta en marcha

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. `.env` ya está configurado apuntando a la base de dev del VPS vía túnel. Si necesitas
   regenerarlo desde cero: `cp .env.example .env` y pide las credenciales de
   `agentemovilco_dev`.
3. Abre tu túnel SSH hacia `apex-vps` (puerto local `5436` → remoto `127.0.0.1:5436`).
4. Aplicar el esquema a la base de datos:
   ```bash
   npm run prisma:migrate
   ```
5. Levantar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

El servidor queda en `http://localhost:4000`. Healthcheck: `GET /api/health`.

## Docker (imagen de producción)

Hay un `Dockerfile` multi-stage listo para desplegar el backend como contenedor en el VPS,
en la misma red `agentemovilco-network` que Postgres (compose en
`/home/deployer/apps/agentemovilco/docker-compose.yml` en el servidor — el servicio
`backend` se agrega ahí cuando hagamos el primer deploy real). Build local de prueba:

```bash
docker build -t agentemovilco-backend .
```

## Scripts

| Script                  | Descripción                              |
| ------------------------ | ----------------------------------------- |
| `npm run dev`            | Servidor con recarga automática (nodemon) |
| `npm start`               | Servidor en modo producción               |
| `npm run prisma:generate` | Regenera el cliente de Prisma             |
| `npm run prisma:migrate`  | Crea/aplica migraciones en desarrollo     |
| `npm run prisma:studio`   | Abre Prisma Studio                        |

## Convención de un recurso nuevo

El recurso `example` (`src/{controllers,routes,validators}/example.*`) sirve de plantilla: define el modelo en `prisma/schema.prisma`, corre `npm run prisma:migrate`, y replica el patrón validator → controller → router.
