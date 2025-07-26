import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './database.js';
import apiRouter from './api.js';
import { swaggerSpec } from './swaggerConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8000;

app.use(cors({
  origin: ['*']
}));
app.use(express.json());

// Обслуживание API
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Обслуживание статики фронтенда - закомментировано, т.к. фронтенд раздается отдельным сервером
// const frontendPath = path.join(__dirname, '..', 'frontend');
// app.use(express.static(frontendPath));
//
// // "Catch-all" маршрут для SPA
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(frontendPath, 'index.html'));
// });


async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log(`API is available at http://localhost:${port}/api`);
      console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();