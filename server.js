import Express, { response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from 'cors';
import jwt_decode from 'jwt-decode';
import dotenv from 'dotenv';

import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

dotenv.config({ path: './.env' });

const stringConexion = `mongodb+srv://mykitchen:mykitchen@cluster0.cixyiwn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(stringConexion, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let baseDeDatos;

const app = Express();

app.use(Express.json());
app.use(Cors());


  
  app.get('/dashboard',  (req, res) => {
    res.send('Secured resource');
  });

  const main = () => {
    const port = process.env.PORT || 5000;
    client.connect((err, db) => {
      if (err) {
        console.error('Error conectando a la base de datos');
        return 'error';
      }
      baseDeDatos = db.db('mykitchen');
      console.log('baseDeDatos exitosa');
      return app.listen(port, () => {
        console.log(`escuchando puerto ${port}`);
      });
    });
  };
  
  main();