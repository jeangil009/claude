# Guía: una animación al día con Claude (18 repos, verificados)

Flujo: **Tema → guion → movimiento → banda sonora → exportación.**
Este documento convierte la lista de 18 repos en un flujo reproducible y marca lo que se verificó y lo que no.

## 0. Antes de usar cualquier repo

**Licencias (decide qué repo entra a una pieza comercial).**

| Repo | Licencia según fuentes | Consecuencia |
|---|---|---|
| anything2explainer | PolyForm Noncommercial | No usar en piezas monetizadas (YouTube con anuncios, entregables a clientes) sin autorización del autor |
| onetake | PolyForm Noncommercial | Igual |
| Remotion | Licencia propia de Remotion (gratis para individuos y equipos pequeños, de pago para empresas sobre cierto tamaño). Una fuente de búsqueda dijo "MIT", contradice lo que conozco; **leer LICENSE antes** | Si la pieza sale a nombre de STUDIO AFE, confirmar con la licencia vigente |
| HyperFrames | Apache 2.0 (repo oficial heygen-com). Un fork afirma otra cosa: usar solo el oficial | Sin restricción comercial conocida |
| OpenScreen, Lemo-Opuscar, Taste Skill, EffectCraft | MIT (EffectCraft: MIT o Apache-2.0) | Sin restricción comercial conocida |
| Impeccable, Open Design | Apache-2.0 (Open Design: otras fuentes dicen MIT) | Sin restricción comercial conocida |

Regla de atribución: antes de poner marca en una pieza, confirmar a nombre de quién va (STUDIO AFE, consultor independiente o tercero). Por defecto, sin marca.

**Cosas de la lista original que no se confirmaron.**
- "99 estilos" de Lemo-Opuscar: las fuentes consultadas dicen 59. Contar los estilos en el repo.
- Los enlaces del post están truncados (`github.com/alchaincyf/hua…`). Los dueños/nombres de abajo salen de búsqueda, no de los enlaces completos. Verifica la URL final antes de `git clone`.
- No se buscaron GSAP, Three.js, Blender MCP, ComfyUI, Remotion ni FFmpeg (proyectos conocidos). Aun así revisa su licencia.
- Los conteos de estrellas varían entre directorios; ignóralos.
- Los directorios de terceros (open-design.ai, skillsllm, instagit) no son fuente primaria.

## 1. Los 18 repos por etapa

| Etapa | Repo | Para qué sirve (verificado en README/listados) | Instalación citada |
|---|---|---|---|
| Guion | anything2explainer (Vincentwei1021) | Tema → explainer narrado con Remotion, voz TTS y subtítulos; fondo negro | `git clone` + symlink a `~/.claude/skills/` |
| Guion/estilo | Lemo-Opuscar (lemomo-ai) | Biblioteca de estilos de film y skill que dirige un corto hecho en código | `claude plugin marketplace add lemomo-ai/lemo-opuscar` |
| Movimiento | HyperFrames (heygen-com) | HTML + CSS/JS → MP4 por Chrome headless, frame a frame | `npx hyperframes init mi-video` |
| Movimiento | Remotion (remotion-dev) | Video como componentes React | `bun create video` |
| Movimiento | Remotion Skills (remotion-dev/skills) | Skills oficiales: studio, render, captions, docs | `npx skills add remotion-dev/skills` |
| Movimiento | huashu-motion (alchaincyf) | Films de lanzamiento: una composición HTML + GSAP | `npx skills add alchaincyf/huashu-motion` |
| Movimiento | onetake (feitangyuan) | Film sin cortes: un elemento sobrevive y se vuelve la siguiente escena | `git clone` en la carpeta de skills |
| Movimiento | GSAP (greensock) | Líneas de tiempo y easing | `npm i gsap` |
| 3D | Three.js (mrdoob) | Escenas 3D desde la web | `npm i three` |
| 3D | Blender MCP (ahujasid) | Claude controla Blender | ver README del repo |
| Imagen | ComfyUI (Comfy-Org) | Motor de imágenes/video IA local | ver README del repo |
| VFX | EffectCraft (storytold) | Estudio de motion graphics y VFX en Rust, con CLI JSON y servidor MCP | Releases o `cargo` (Rust 1.95+) |
| Demo | OpenScreen (getopenscreen) | Grabación de pantalla con aspecto de demo. **Solo video, sin audio** | Releases; skill: `npx skills add getopenscreen/openscreen --skill openscreen-demo` |
| Estilo | Impeccable (pbakaus) | Skill de diseño con comandos tipo audit, polish, critique | `npx skills add pbakaus/impeccable` |
| Estilo | Taste Skill (Leonxlnx) | Controla variación, intensidad de movimiento y densidad visual | `npx skills add Leonxlnx/taste-skill` |
| Estilo | Hallmark (Nutlope) | Skill anti "look de IA" con linter en navegador | `npx skills add nutlope/hallmark` |
| Estilo | Open Design (nexu-io) | Estudio de diseño local, alternativa a Claude Design | App de escritorio (Releases) |
| Exportación | FFmpeg | Codificación final a MP4 | `apt install ffmpeg` (ya instalado aquí: 6.1.1) |

Los comandos `npx skills add ...` salen de listados y READMEs de terceros; no se ejecutaron aquí. El sistema bloqueó la prueba de `npx hyperframes`, así que **los subcomandos de HyperFrames (preview, render) no están verificados**. Usa `npx hyperframes --help`.

## 2. Pila mínima recomendada (3 repos, no 18)

No instales los 18. Para una pieza diaria alcanza con:

1. **HyperFrames** para el movimiento (Apache 2.0; el flujo "HTML → video" lo puede conducir Claude directamente).
2. **Impeccable o Hallmark** como pulido final (elige uno, no ambos).
3. **FFmpeg** para exportar.

Añade más solo cuando la pieza lo pida: GSAP si necesitas timelines finos, OpenScreen si es un demo de pantalla, Three.js o Blender si hay 3D.

## 3. Primera animación (flujo con contrato, como en esta carpeta)

Esta carpeta ya tiene el método: `brief.md`, `style-guide.md`, `shotlist.md`, escena determinista y `reviews/`. Reutilízalo para cualquier pieza nueva.

**Paso 1, Tema (5 min).** Escribe `brief.md` con: una frase, audiencia, duración (15-30 s para el primer intento), formato (9:16 y 16:9), qué datos son reales y qué es inaceptable.

**Paso 2, Guion (10 min).** Escribe `shotlist.md` con beats y tiempos: `inicio-finS NOMBRE propósito | entra → sale`. Primer beat = el veredicto o gancho, no la introducción. Si un beat no se justifica, no entra.

**Paso 3, Movimiento (30-60 min).** Pídele a Claude que construya la escena a partir de brief + shotlist + style-guide. Reglas que aplican desde `style-guide.md`: un color por magnitud, mínimo 18 pt para móvil, sin degradados decorativos ni logo sorpresa. Cada elemento aparece una vez y se queda.

**Paso 4, Revisión (10 min).** Renderiza, genera la contact sheet (`python tools/contact_sheet.py video.mp4 reviews/NNN-contact-sheet.png`), anota defectos con tiempo y evidencia en `reviews/NNN.md`, corrige solo eso y repite. Aquí entra el pulido (Impeccable/Hallmark) para texto y layout.

**Paso 5, Banda sonora (10 min).** Define el audio en `brief.md` antes de renderizar. Tres vías: música sin derechos de autor registrada en el brief; voz con ElevenLabs o Higgsfield (ya conectados en tu entorno); o mudo con subtítulos. Mezcla con FFmpeg:

```bash
ffmpeg -i video.mp4 -i musica.mp3 -filter:a "volume=0.4" -c:v copy -shortest salida.mp4
```

**Paso 6, Exportación (2 min).**

```bash
# 16:9 para YouTube/informes
ffmpeg -i salida.mp4 -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart final_16x9.mp4
# 9:16 para Shorts/Reels (recorte central desde un maestro 16:9)
ffmpeg -i salida.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart final_9x16.mp4
```

Si el maestro ya sale a 9:16 desde el motor de render, no recortes: renderiza directo al formato.

## 4. Rutina diaria (≈1 h)

| Min | Acción |
|---|---|
| 0-15 | Tema + brief + shotlist (reusar plantilla de esta carpeta) |
| 15-60 | Render de prueba en baja calidad, contact sheet, un ciclo de correcciones |
| 60-75 | Audio + render final + exportación a los dos formatos |

Guarda cada pieza en `motion/<fecha>-<tema>/` con su brief, shotlist, fuente y `reviews/`, para regenerarla de forma determinista.

## 5. Dónde encaja cada trabajo tuyo

- **Informes de avance (EVM, Curva S):** ya resuelto en `scurve_evm.py` (Manim). Los repos de arriba no reemplazan eso: sirven para piezas de marketing o explicativas, no para cifras de contrato. Las cifras siempre salen del JSON de la app.
- **Bouncy Jax (YouTube, niños 2-6):** el estilo Pixar 3D lo cubre tu pipeline HIGGSFIELD/Seedance; de los 18, solo Blender MCP, Three.js y ComfyUI aportan. Si el canal está monetizado, evita onetake y anything2explainer (licencia no comercial).
- **TodoClick Market:** OpenScreen (demo del producto/tienda) + HyperFrames (gráficos animados) + FFmpeg.
- **Propuestas a clientes (STUDIO AFE u otro):** confirmar atribución y licencia antes de entregar.

## 6. Fuentes consultadas (terceras, sin acceso directo a GitHub)

- huashu-motion: https://skillsllm.com/skill/huashu-motion
- HyperFrames: https://github.com/heygen-com/hyperframes y https://hyperframes.heygen.com/
- OpenScreen: https://github.com/getopenscreen/openscreen
- Impeccable: https://github.com/pbakaus/impeccable
- onetake: https://github.com/feitangyuan/onetake
- anything2explainer: https://github.com/Vincentwei1021/anything2explainer
- Lemo-Opuscar: https://github.com/lemomo-ai/lemo-opuscar
- EffectCraft: https://github.com/storytold/effectcraft
- Taste Skill: https://github.com/Leonxlnx/taste-skill
- Hallmark: https://github.com/Nutlope/hallmark
- Open Design: https://github.com/nexu-io/open-design
- Remotion Skills: https://www.remotion.dev/docs/ai/skills
