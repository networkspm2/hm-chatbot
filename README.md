# hm-chatbot

WhatsApp Cloud API chatbot — Fastify + Prisma + PostgreSQL.

## Requisitos

- Node.js >= 20
- PostgreSQL (o Docker)

## Setup local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default: 3000) |
| `DATABASE_URL` | Connection string de PostgreSQL |
| `META_VERIFY_TOKEN` | Token que configurás en Meta Developers para verificar el webhook |
| `META_PHONE_NUMBER_ID` | ID del número de WhatsApp en Meta |
| `META_ACCESS_TOKEN` | Token de acceso de la app de Meta |

### 3. Levantar la base de datos (opción Docker)

```bash
docker compose up db -d
```

### 4. Correr las migraciones

```bash
npm run db:migrate
```

Cuando Prisma pida un nombre para la migración, escribí algo como `init`.

### 5. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

El servidor arranca en `http://localhost:3000`.

---

## Endpoints

### `GET /health`

Verifica que el servidor está corriendo.

```bash
curl http://localhost:3000/health
# { "status": "ok", "timestamp": "..." }
```

### `GET /webhook/meta`

Verificación del webhook de Meta. Meta llama este endpoint cuando configurás el webhook en el panel de desarrolladores.

Parámetros query que envía Meta:
- `hub.mode` — siempre `subscribe`
- `hub.verify_token` — debe coincidir con `META_VERIFY_TOKEN` en tu `.env`
- `hub.challenge` — string que hay que devolver tal cual

```bash
curl "http://localhost:3000/webhook/meta?hub.mode=subscribe&hub.verify_token=tu_token&hub.challenge=12345"
# 12345
```

### `POST /webhook/meta`

Recibe los eventos de WhatsApp (mensajes entrantes, estados de envío, etc.). Por ahora solo imprime el body en consola.

---

## Exponer el servidor a internet (para Meta)

Meta necesita una URL pública HTTPS para llamar al webhook. En desarrollo podés usar **ngrok**:

```bash
# Instalar ngrok (https://ngrok.com/download)
ngrok http 3000
```

Ngrok te dará una URL como `https://abc123.ngrok-free.app`. Usala en el panel de Meta:

1. Ir a [Meta for Developers](https://developers.facebook.com/)
2. Tu app → WhatsApp → Configuration → Webhook
3. Callback URL: `https://abc123.ngrok-free.app/webhook/meta`
4. Verify Token: el valor que pusiste en `META_VERIFY_TOKEN`
5. Hacer clic en "Verify and Save"

Si el GET /webhook/meta devuelve el challenge correctamente, Meta confirmará la suscripción.

---

## Docker (stack completo)

```bash
# Levantar app + base de datos
docker compose up --build

# Correr migraciones dentro del contenedor
docker compose exec app npx prisma migrate deploy
```

---

## Estructura del proyecto

```
hm-chatbot/
├── src/
│   ├── server.js          # Punto de entrada
│   ├── app.js             # Setup de Fastify y registro de rutas
│   └── routes/
│       ├── health.js      # GET /health
│       └── webhook.js     # GET y POST /webhook/meta
├── prisma/
│   └── schema.prisma      # Schema de la base de datos
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── package.json
```
