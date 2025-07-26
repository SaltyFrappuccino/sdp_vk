import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { initializeDatabase } from './database.js';
import apiRouter from './api.js';
import { swaggerSpec } from './swaggerConfig.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Anketnica Backend!');
});

app.use('/api', apiRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Backend server is running at http://localhost:${port}`);
      console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();