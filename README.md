# Task Manager Distribuido

## Arquitectura general propuesta

- **Backend Node.js (Express)**
    - API REST principal para CRUD de tareas, usuarios, proyectos, etc.
    - Acceso a PostgreSQL para almacenamiento persistente.
- **Servicio de notificaciones en Python (FastAPI)**
    - Microservicio separado encargado de enviar notificaciones (email, push, etc).
    - Recibe eventos (ej. creación, actualización de tarea) desde backend principal o directamente desde frontend.
    - Puede usar Redis para caché o cola de mensajes.
- **Frontend Next.js**
    - Consume la API REST de Node.js para gestionar tareas.
    - Opcionalmente puede consumir directamente el servicio de notificaciones para configurar alertas.
- **Base de datos**
    - PostgreSQL para datos relacionales principales (tareas, usuarios, etc).
    - Redis para caché y/o mensajes entre servicios.

## Estructura básica y stack

- Backend **Node.js**
    - Express + Sequelize/TypeORM/Prisma para PostgreSQL
    - JWT para autenticación
    - API REST con endpoints para tareas, usuarios, proyectos.
- Servicio **Python** (FastAPI)
    - Endpoint para recibir eventos (ej. POST /notify)
    - Manejo de tareas de notificación (email con SMTP o servicios externos)
    - Uso de Redis para cachear usuarios o colas.
- Frontend **Next.js**
    - Autenticación (ejemplo: NextAuth o JWT)
    - Páginas para listado y gestión de tareas
    - Consumo de API REST con fetch/axios.

Proyecto llevado a cabo para ganar experiencia hands-on en containerizacion, pipelines, y monitoring.
