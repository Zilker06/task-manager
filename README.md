# Task Manager API

API de gestión de tareas con Node.js, Firebase y Docker.

## 🔧 Requisitos
- Node.js v18+
- Docker (opcional)
- Cuenta de Firebase

## 🚀 Instalación Local

1. **Clona el repositorio**:
```bash
git clone https://github.com/tu-usuario/task-manager.git
cd task-manager
```
2. Instala dependencias:
```bash
npm install
```
3. Inicia la API:
```bash
npm  run dev
```

4. Accede a la API:
Swagger UI: *https://localhost:3000/api-docs*

🐳 Uso con Docker

```bash
docker build -t task-manager .
docker run -p 3000:3000 task-manager
```