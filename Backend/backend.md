# README  
## Backend con Express + PostgreSQL + Docker Compose

Este documento explica cómo:

1. Crear un nuevo proyecto Express  
2. Habilitar CORS para desarrollo local  
3. Configurar PostgreSQL desde Express  
4. Levantar una base de datos PostgreSQL con Docker Compose  

---

# 1. Crear un nuevo proyecto Express

## 1.1 Inicializar el proyecto

```bash
mkdir mi-backend
cd mi-backend
npm init -y
```

## 1.2 Habilitar ES Modules

Editar `package.json` y agregar o modificar:

```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js"
  }
}
```

## 1.3 Instalar Express

```bash
npm install express
```

## 1.4 Crear estructura mínima

```
mi-backend/
  src/
    index.js
  package.json
  .env
```

## 1.5 Crear el servidor base

`src/index.js`:

```js
import express from "express";

const app = express();
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Backend funcionando" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
```

---

# 2. Habilitar CORS

## 2.1 Instalar CORS

```bash
npm install cors
```

## 2.2 Configuración recomendada para desarrollo

Permitir todas las origins (solo desarrollo):

```js
app.use(cors());
```

---

# 3. Configurar PostgreSQL desde Express

## 3.1 Instalar el cliente de PostgreSQL

```bash
npm install pg
npm install dotenv
```

## 3.2 Crear archivo de conexión

`src/db.js`:

```js
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```
## 3.3 Setup de backend + DB

`src/index.js`:

```js
...
import { pool } from "./db.js";
...
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});
```

## 3.4 Configurar variables de entorno

`.env`:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fiumbr
```

Ajustar usuario, contraseña y base según la configuración.

---

# 4. PostgreSQL con Docker Compose

## 4.1 Crear archivo `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: fiumbr
    volumes:
      - ./.volumes/postgres/data:/var/lib/postgresql/data/
    ports:
      - "5432:5432"
```

## 4.2 Levantar la base de datos

```bash
docker compose up -d
```

## 4.3 Verificar funcionamiento

```bash
docker ps
```

---

# 5. Crear una tabla de ejemplo

```sql
CREATE TABLE users (
  ...
);
```

---

# 6. Iniciar el backend

```bash
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

---

# 7. Flujo completo

1. Levantar PostgreSQL  
   ```bash
   docker compose up -d
   ```
2. Iniciar servidor Express  
   ```bash
   npm run dev
   ```
3. Probar rutas  
   ```
   GET http://localhost:3000/
   GET http://localhost:3000/users
   ```
