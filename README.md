# Sitio institucional — inmobiliariacincinnati.com

Sitio estático (sin build, sin backend) para usar como verificación de negocio en Meta
mientras se termina la web definitiva. Dos páginas: `index.html` (home) y `privacy.html`
(política de privacidad, exigida por Meta para la app).

## 1. Subir a GitHub

```bash
cd site-cincinnati
git init
git add -A
git commit -m "Sitio institucional Cincinnati"
gh repo create <tu-usuario>/cincinnati-web --public --source=. --remote=origin --push
```

(o crea el repo vacío en github.com y haz `git remote add origin <url> && git push -u origin main`)

## 2. Activar GitHub Pages

En el repo → **Settings → Pages** → Source: `Deploy from a branch`, branch `main`, carpeta `/ (root)`.
Guardar. El archivo `CNAME` ya incluido deja el dominio personalizado configurado del lado de GitHub.

## 3. DNS en SiteGround (zona del dominio inmobiliariacincinnati.com)

Agrega estos registros. **No toques los registros MX** si ya tienen correo configurado en ese
dominio — el correo y la web son registros independientes.

| Tipo | Host | Valor |
|---|---|---|
| A | @ (raíz) | 185.199.108.153 |
| A | @ (raíz) | 185.199.109.153 |
| A | @ (raíz) | 185.199.110.153 |
| A | @ (raíz) | 185.199.111.153 |
| CNAME | www | `<tu-usuario>.github.io` |

Confirma las IPs vigentes en la documentación de GitHub ("Managing a custom domain for your
GitHub Pages site") antes de pegarlas, por si cambiaron.

## 4. HTTPS

Después de que el DNS resuelva (minutos a un par de horas), en **Settings → Pages** marca
**Enforce HTTPS**. GitHub emite el certificado solo; no hay nada que subir a mano.

## 5. Antes de usarlo para la verificación de Meta

Ya están en el footer de ambas páginas y en la sección "Contacto" de la política de privacidad:

- **RUC:** 20534390808
- **Dirección legal:** Cal. Libertad Nro. 176, Com. San Miguel de Miraflores, Miraflores, Lima, Perú

Deben coincidir letra por letra con los documentos que se suban a Meta y con "Información de la
empresa" en Meta. Si alguno difiere, corregirlo en `index.html` y `privacy.html`.

**Pendiente: las fotos son de stock, temporales.** Ninguna muestra Fundo Hass ni Villa Hass.
Reemplazarlas por fotos reales del cliente conservando los mismos nombres de archivo en
`assets/img/` (no hay que tocar el HTML):

| Archivo | Dónde se usa | Tamaño | Foto de stock actual (Unsplash, vía picsum.photos) |
|---|---|---|---|
| `hero-1.jpg` | Portada, 1.ª foto | 1920×1200 | Anton Sulsky |
| `hero-2.jpg` | Portada, 2.ª foto | 1920×1200 | Philipp Reiner |
| `hero-3.jpg` | Portada, 3.ª foto | 1920×1200 | Matt Benson |
| `hero-4.jpg` | Portada, 4.ª foto | 1920×1200 | Kenneth Thewissen |
| `nosotros.jpg` | Sección Nosotros | 1400×1100 | Brian Jimenez |
| `fundo-hass.jpg` | Tarjeta Fundo Hass | 1400×1000 | Drew Geraets |
| `villa-hass.jpg` | Tarjeta Villa Hass | 1400×1000 | Silvestri Matteo |

## 5b. Cómo está hecho

Diseño basado en la plantilla de referencia "Aether" (aura.build): portada a pantalla completa
que queda fija y funde 4 fotos mientras se hace scroll. Sigue siendo un sitio estático sin build.
La animación usa GSAP, ScrollTrigger y Lenis cargados desde CDN (`index.html`, al final); la
lógica está en `assets/main.js`. Si el CDN falla o el visitante tiene "reducir movimiento"
activado, la página se muestra estática con la primera foto y el título.

## 6. Cuando la web definitiva esté lista

Se revierte solo cambiando los mismos registros A/CNAME de vuelta a donde corresponda. No hay
nada más que desarmar del lado de GitHub.
