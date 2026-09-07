# Instalación local y despliegue en Render

## Revisión del proyecto

Es una aplicación React + TypeScript con Vite 5. No necesita un backend para
servirse como Static Site. La configuración está en `vite.config.ts`.
Los scripts existentes en `package.json` son correctos y se conservan:

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
}
```

Este bloque corresponde al campo `scripts`, no reemplaza todo `package.json`.
El build comprueba TypeScript y genera `dist`. Vite usa `base: '/'` y
`build.outDir: 'dist'` por defecto; son adecuados para Render.
No hacen falta `start`, Express, Docker ni una variable `PORT`.
La app no usa rutas de React Router, por lo que no necesita una regla de rewrite.

Cambios incluidos:

- `vite.config.ts`: desarrollo en 3000 y preview en 4173, con puertos estrictos.
- `.gitignore`: excluye `.env` y sus variantes; permite `.env.example`.
- `.env.example`: plantilla sin credenciales.
- `.node-version`: selecciona Node 24 para Render.
- `render.yaml`: configuración opcional para un Blueprint.
- Componentes de Radio: eliminan `DrawingManager` y la biblioteca `drawing`.
  Google retiró esta biblioteca en mayo de 2026. Se utiliza `google.maps.Circle`
  con radios predefinidos o dos clics (centro y borde), manteniendo la edición.

## Verificación realizada en esta carpeta

- Node.js 24.18.0 y npm 11.16.0.
- Instalación con `npm ci`: correcta.
- `npm run build`: correcto, TypeScript y Vite 5.4.11; generó `dist`.
- `npm run lint`: correcto, sin errores ni advertencias de ESLint.
- `npm run preview`: inició en el puerto 4173; HTML, JavaScript y CSS respondieron HTTP 200.
- El build mostró un aviso no bloqueante sobre datos antiguos de Browserslist.
- `.env` contiene una clave de ejemplo. No se verificó la carga real de Google
  Maps ni las interacciones de medición con una clave válida. El checklist del
  paso 2 queda pendiente de esa configuración.
- No se ha publicado el sitio ni conectado una cuenta de Render.

## 1. Ejecutar en Windows

Instala Node.js 24.x con npm. Abre PowerShell en la carpeta del proyecto:

```powershell
cd "C:\Users\Stev\Downloads\google-maps-measure-tools-main"
node --version
npm --version
npm ci --include=dev
```

Se usa `npm ci` porque existe `package-lock.json`; conserva las versiones del
lockfile. Si cambias dependencias, usa `npm install` y sube también el lockfile
actualizado. No uses `--omit=dev` para compilar: Vite y TypeScript son dependencias
de desarrollo.

La carpeta recibida ya contiene `.env`. Edítalo localmente y reemplaza el valor
de ejemplo por tu clave, sin compartirla en el chat:

```dotenv
VITE_GOOGLE_MAPS_API_KEY=TU_CLAVE_DE_GOOGLE_MAPS
```

Si trabajas en un clon nuevo que no contiene `.env`, puedes crearlo sin
sobrescribir uno existente:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Después de configurar Google Cloud como se indica más abajo:

```powershell
npm run dev
```

Abre http://localhost:3000. Detén el servidor con Ctrl+C.
Reinicia Vite si cambias `.env`. Si el puerto está ocupado, ciérralo desde la
terminal que lo inició o usa `npm run dev -- --port 3001` y autoriza ese puerto
en Google Cloud.

## 2. Probar el build

```powershell
npm run build
npm run preview
```

El primer comando debe terminar sin errores y crear `dist/index.html` y sus
assets. El segundo sirve ese resultado en http://localhost:4173.
`preview` es solo para comprobar el resultado localmente; Render sirve `dist`.
Si cambias la clave, vuelve a compilar antes de usar preview.

Comprueba con una clave válida:

- El mapa carga y la consola del navegador no muestra errores de autorización.
- Distancia: dibujar varios puntos, editar y limpiar.
- Radio: elegir 100 m y pulsar el centro; cancelar, editar y limpiar.
- Radio manual: pulsar Dibujar, elegir centro y borde; comprobar radio y área.
- Cancelar tras seleccionar solo el centro y volver a dibujar.
- Cambiar entre Distancia y Radio y recargar la página.

## 3. Subir los archivos a tu GitHub

La carpeta recibida no contiene `.git`: es una copia de archivos, no un clon
con historial. Una opción sencilla es crear un fork del repositorio original,
clonar tu fork en otra carpeta y copiar allí los archivos modificados indicados
arriba, `README.md` y esta guía. No copies `.env`, `node_modules` ni `dist`.

Desde tu clon:

```powershell
git status --short
git check-ignore .env
git ls-files .env
git add .gitignore .env.example .node-version vite.config.ts render.yaml README.md DEPLOY_RENDER.md src
git diff --cached --stat
git commit -m "Prepare Vite app for Render and replace retired drawing library"
git push
```

`git check-ignore .env` debe mostrar `.env`; `git ls-files .env` no debe mostrar
nada. Si `.env` ya estaba versionado, ejecuta `git rm --cached .env` antes del
commit: conserva la copia local, pero deja de versionarla. Si una clave real se
publicó previamente, reemplázala en Google Cloud; `.gitignore` no borra el historial.

## 4. Crear el Static Site en Render

1. Entra en https://dashboard.render.com y selecciona **New > Static Site**.
2. Conecta GitHub y autoriza el repositorio de tu cuenta que contiene los cambios.
3. Selecciona ese repositorio y la rama donde hiciste el push, normalmente `main`.
4. Completa los campos:

| Campo | Valor |
| --- | --- |
| Name | Un nombre disponible, por ejemplo `mi-medidor-mapas` |
| Branch | La rama con tus cambios |
| Root Directory | Vacío si `package.json` está en la raíz |
| Build Command | `npm ci --include=dev && npm run build` |
| Publish Directory | `dist` |

5. En la sección de variables de entorno del formulario, añade
   `VITE_GOOGLE_MAPS_API_KEY` con tu clave de producción como valor, sin comillas.
   Añade también `SKIP_INSTALL_DEPS=true` para que la instalación la gestione el
   Build Command. `.node-version` ya selecciona Node 24; no necesitas otra variable
   `NODE_VERSION`.
6. Pulsa **Create Static Site** y espera a que el build y el despliegue terminen.
7. Copia el dominio real que Render asigne, autorízalo en Google Cloud y abre la
   URL HTTPS. Repite las comprobaciones de mapa y mediciones del paso 2.

Para añadir o cambiar la clave después: abre el servicio > **Environment** >
**Add Environment Variable**, introduce nombre y valor y selecciona
**Save, rebuild, and deploy**. Reutilizar un build anterior no actualiza la clave
incluida en el JavaScript. Los siguientes pushes a la rama conectada se despliegan
automáticamente si Auto-Deploy está habilitado.

Alternativa: **New > Blueprint**, conecta el mismo repositorio y usa el
`render.yaml` incluido. `sync: false` solicita el valor de la clave durante la
creación sin guardarlo en YAML. Elige el flujo manual o Blueprint: no necesitas
crear dos sitios. El flujo manual no importa automáticamente el YAML.

## 5. Configurar Google Maps

1. En https://console.cloud.google.com elige o crea un proyecto.
2. Vincula una cuenta de facturación y habilita **Maps JavaScript API** desde
   **APIs y servicios > Biblioteca**.
3. Ve a **APIs y servicios > Credenciales**, crea o edita una clave de API.
4. En **Restricciones de aplicaciones**, selecciona **Sitios web / HTTP referrers**.
5. Autoriza estos orígenes para desarrollo (puedes usar una clave separada):

```text
http://localhost:3000/*
http://localhost:4173/*
```

Si navegas usando `127.0.0.1`, añade también ese host con los mismos puertos.
Para la clave de producción, añade el hostname exacto que Render te proporcione:

```text
https://mi-medidor-mapas.onrender.com/*
```

Sustituye el nombre de ejemplo por el real. Evita `https://*.onrender.com/*`:
autorizaría también sitios de otros usuarios de Render. Si añades un dominio
propio o un preview, autoriza su origen concreto. No uses restricciones por IP
del servidor para una clave que se utiliza desde el navegador.

6. En **Restricciones de API**, elige **Restringir clave** y permite solamente
   **Maps JavaScript API**. Este código no necesita Places, Geocoding ni Directions;
   `geometry` y `marker` son bibliotecas de Maps JavaScript API.
7. Guarda, espera unos minutos si las restricciones aún no se propagan y recarga.

Las variables `VITE_*` se insertan en los archivos JavaScript durante el build:
la clave será visible en el navegador aunque se guarde en Environment de Render.
La protección consiste en las restricciones por sitio y API. Usa claves separadas
para desarrollo y producción, y configura cuotas y alertas de consumo acordes
con tu proyecto.

## Diagnóstico rápido

| Síntoma | Comprobación |
| --- | --- |
| Build falla buscando `package.json` | Revisa Root Directory. |
| No encuentra `vite` o `tsc` | Instala también devDependencies con `--include=dev`. |
| `npm ci` informa desajuste | Ejecuta `npm install` localmente y sube el lockfile actualizado. |
| `RefererNotAllowedMapError` | Autoriza el origen real, incluido protocolo y puerto local. |
| `InvalidKeyMapError` | Revisa la clave y vuelve a hacer build. |
| `ApiNotActivatedMapError` | Habilita Maps JavaScript API en el proyecto de esa clave. |
| `BillingNotEnabledMapError` | Revisa la facturación del proyecto. |

## Documentación oficial

- https://vite.dev/guide/static-deploy#render
- https://vite.dev/guide/env-and-mode
- https://render.com/docs/static-sites
- https://render.com/docs/configure-environment-variables
- https://render.com/docs/node-version
- https://render.com/docs/blueprint-spec
- https://developers.google.com/maps/documentation/javascript/get-api-key
- https://developers.google.com/maps/api-security-best-practices
- https://developers.google.com/maps/deprecations
