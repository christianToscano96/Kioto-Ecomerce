# CI/CD Setup

## Secrets requeridos

### Vercel (Frontend)
- `VERCEL_TOKEN` - Token de Vercel
- `VERCEL_ORG_ID` - ID de la organización
- `VERCEL_PROJECT_ID` - ID del proyecto

### Render (Backend)
- `RENDER_API_KEY` - API key de Render
- `RENDER_SERVICE_ID` - ID del servicio web

### Notificaciones
- `SLACK_WEBHOOK_URL` - Webhook para notificaciones

### Codecov
- `CODECOV_TOKEN` (opcional) - Token de Codecov

## Configuración

### 1. Vercel (Frontend)
```bash
npm install -g vercel
vercel login
vercel link
```

### 2. Render (Backend)
1. Ir a [render.com](https://render.com)
2. Crear "New" → "Web Service"
3. Conectar repositorio de GitHub
4. Configurar:
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Root directory: `backend`
5. Agregar variables de entorno en Render dashboard

### 3. GitHub Secrets
Ir a: Settings → Secrets and variables → Actions

## Render Free Tier Settings

- **Plan**: Starter ($0)
- **Specs**: 512MB RAM, 0.5 CPU
- **Sleep**: After 15 min inactive
- **Bandwidth**: 100GB/mes

### Variables de entorno en Render:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<tu_mongodb_connection>
JWT_SECRET=<tu_jwt_secret>
STRIPE_SECRET_KEY=<tu_stripe_key>
```

## Flujo de trabajo

1. Push a `develop` → Tests + Lint
2. Push a `main` → Tests + Lint + Deploy
3. PR a `main` → Tests + Preview Deploy

## Scripts útiles

```bash
# Run local tests
npm run test:coverage

# Run linter
npm run lint

# Build
npm run build
```