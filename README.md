# Quartz Project Manager

> Fork de [Quartz v4](https://github.com/jackyzha0/quartz) con funcionalidades para gestión de proyectos.

Este fork añade el **SprintWidget**, un componente para visualizar y trackear tareas de sprints directamente en tus notas, similar a Notion o tableros Kanban.

## SprintWidget

El SprintWidget extrae automáticamente secciones de tus notas marcadas con tags especiales y las muestra en un widget interactivo con tabs en la parte superior de la página.

### Uso

Añade tags a tus headings de markdown:

```markdown
## Mi Proyecto #ganttchart

Descripción del proyecto...

### Sprint 4: Desarrollo API #actual

**Inicio:** 2025-01-01 | **Fin:** 2025-01-15

- [x] Crear endpoints REST
- [/] Implementar autenticación
- [ ] Documentar API

### Sprint 3: Diseño Base de Datos #backlog

- [ ] Migrar datos legacy
- [ ] Optimizar queries

### Ideas Futuras #backlog

- [ ] Integración con Slack
- [ ] Dashboard analytics
```

### Tags Disponibles

| Tag | Función |
|-----|---------|
| `#actual` | Marca la sección como sprint actual (Tab "Actual") |
| `#backlog` | Marca la sección como backlog (Tab "Backlog") |
| `#ganttchart` | Fuerza mostrar el widget en esa página |

### Dónde Aparece el Widget

El widget se muestra automáticamente en:

- Páginas `index.md` (raíz y carpetas)
- Páginas con algún heading que contenga `#ganttchart`
- Páginas con `sprintWidget: true` en el frontmatter

### Ejemplo Visual

```
┌─────────────────────────────────────────────────┐
│  [Actual (2)]  [Backlog (3)]                    │
├─────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐    │
│  │ Sprint 4: Desarrollo API           [↗]  │    │
│  │─────────────────────────────────────────│    │
│  │ - [x] Crear endpoints REST              │    │
│  │ - [/] Implementar autenticación         │    │
│  │ - [ ] Documentar API                    │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

### Características

- **Tabs interactivos**: Cambia entre Actual y Backlog con un click
- **Navegación rápida**: Botón "↗" para saltar a la sección original en el documento
- **Highlight animado**: La sección se resalta al navegar
- **Responsive**: Se adapta a móviles
- **Tema consistente**: Usa las variables de color de Quartz

## Instalación

```bash
# Clonar el fork
git clone https://github.com/nazho248/quartz-project-manager.git
cd quartz-project-manager

# Instalar dependencias
npm install

# Añadir tu contenido
# (tu carpeta content/ con archivos .md)

# Desarrollo local
npx quartz build --serve

# Build para producción
npx quartz build
```

## Configuración

El SprintWidget ya viene configurado. Si necesitas personalizarlo:

**quartz.config.ts:**
```typescript
Plugin.SprintWidget({
  actualTag: "actual",      // Cambiar tag para "Actual"
  backlogTag: "backlog",    // Cambiar tag para "Backlog"
  ganttChartTag: "ganttchart",
  maxDepth: 4,              // Nivel máximo de headings (h1-h4)
})
```

**quartz.layout.ts:**
```typescript
Component.SprintWidget({
  showOnIndex: true,        // Mostrar en páginas index
  defaultTab: "actual",     // Tab activo por defecto
})
```

## Actualizar desde Quartz Original

```bash
git fetch upstream
git merge upstream/v4
```

---

## Quartz Original

> "[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important." — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Documentación original: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>
