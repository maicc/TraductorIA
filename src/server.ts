import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translateRoute from './routes/translate';
import path from 'path';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/translate', translateRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
