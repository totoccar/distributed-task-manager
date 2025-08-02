# 🧠 Task Manager Distribuido

Práctica DevOps y microservicios, simula un sistema de gestión de tareas distribuido con:

- 🟦 Backend principal: Node.js + Express
- 🟨 Microservicio: FastAPI (Python) para notificaciones
- 🟥 Redis: para pub/sub y caché
- 🟩 Base de datos: MongoDB (local o MongoDB Atlas)
- 🐳 Contenerización: Docker + Docker Compose

---

## 🚀 Incluye

- CRUD de tareas desde el backend Node.js
- Microservicio que escucha eventos `"task.created"` desde Redis
- Infraestructura multi-servicio orquestada con Docker
- Posibilidad de desplegar en Railway o AWS
