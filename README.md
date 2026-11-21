# visor-partituras

Visor de hojas de acordes (PDF) para iPhone y iPad. Funciona sin internet.

- Abrir: https://sebasquinteroo1999-debug.github.io/visor-partituras/
- La biblioteca se guarda solo en cada equipo. Los PDF vienen de la carpeta Orquesta de iCloud Drive.
- Al cambiar cualquier archivo, subir `VERSION` en `sw.js` para que los equipos bajen la versión nueva.

## Intros (carpeta `intros/`)
App aparte para escuchar el inicio de cada tema de la tanda por audífonos antes de entrar.
URL: https://sebasquinteroo1999-debug.github.io/visor-partituras/intros/
- Tiene su propio service worker (`intros/sw.js`, caché `intros-…`). El del visor ignora `/intros/`.
- Audios en IndexedDB del equipo (base "intros"), por nombre de tema.
- Al cambiar archivos de `intros/`, subir VERSION en `intros/sw.js` y APP_VERSION en `intros/index.html`.
