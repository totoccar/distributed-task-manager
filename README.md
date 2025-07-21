# Task Manager

Un proyecto full-stack de gestión de tareas.

## Estructura del proyecto

```
task-manager/
├── frontend/          # Aplicación Next.js
│   ├── app/          # App Router de Next.js
│   ├── public/       # Archivos estáticos
│   ├── package.json  # Dependencias del frontend
│   └── ...
├── backend/          # API del backend (futuro)
├── README.md         # Este archivo
└── .gitignore
```

## Frontend (Next.js)

El frontend está ubicado en la carpeta `frontend/` y utiliza Next.js 15 con:
- **App Router** para el enrutamiento
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Fuente Roboto** para una apariencia profesional

### Ejecutar el frontend

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Backend (Futuro)

El backend se implementará en una carpeta separada `backend/` y se conectará con el frontend a través de APIs REST o GraphQL.

## Desarrollo

Para desarrollar en este proyecto:

1. Clona el repositorio
2. Navega a la carpeta del frontend: `cd frontend`
3. Instala las dependencias: `npm install`
4. Ejecuta el servidor de desarrollo: `npm run dev`

## Tecnologías utilizadas

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Roboto Font

### Backend (Por implementar)
- Node.js / Python / Go (por decidir)
- Base de datos (por decidir)

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request
