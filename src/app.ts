import { NODE_ENV, PORT } from '#config/environment';
import { cors } from '#middlewares/cors.middleware';
import express from 'express';
import helmet from 'helmet';
import router from '#routes/index';
import errorHandler from '#middlewares/error.middleware';
import { limiter } from '#middlewares/limit.middleware';
import { errorPath } from '#middlewares/errorPath.middleware';

const app = express();

app.use(express.json({ encoded: 'utf-8' }));
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(limiter({ skip: NODE_ENV === 'development' }));
app.use(cors({ skip: NODE_ENV === 'development' }));

/**
 * GET /health
 * @description Verifica el estado de la aplicación
 * @access public
 * @returns {object} Estado del servicio y entorno actual
 * {
 *   success: true,
 *   status: 'UP',
 *   environment: 'Nombre del entorno actual o "Not defined"',
 *   date: Fecha actual
 * }
 */
app.get('/health', (_, res) => {
  res.send({
    uptime: process.uptime(),
    message: "Ok",
    date: new Date()
  });
});

app.use('/api/v1',router)

app.use(errorHandler)


app.use(errorPath)

// Iniciar el servidor
if (NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}\n`);
  });
}

export { app };
