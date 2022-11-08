import Express, { response, Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import Cors from 'cors';
import jwt_decode from 'jwt-decode';
import dotenv from 'dotenv';

import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

dotenv.config({ path: './.env' });

const stringConexion = `mongodb+srv://mykitchen:mykitchen@cluster0.rtgxla0.mongodb.net/?retryWrites=true&w=majority`;

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
    console.log('hicierron get en /')
  });

  app.post('/producto/nuevo', (req, res) => {
    console.log(req);
    const datosProducto = req.body;
    console.log('llaves: ', Object.keys(datosProducto));
    try {
      if (
        Object.keys(datosProducto).includes('nombre') &&
        Object.keys(datosProducto).includes('ingredientes') &&
        Object.keys(datosProducto).includes('pasos') 
      ) {
        baseDeDatos.collection('recetas').insertOne(datosProducto, (err, result) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          } else {
            console.log(result);
            res.sendStatus(200);
          }
        });
      } else {
        res.sendStatus(500);
      }
    } catch {
      res.sendStatus(500);
    }
  });

  app.get('/productos/recetas', (req, res) => {
    let ingredient = req.query.ingredientes;
    console.log('alguien hizo get en la ruta /productos/recetas');
    baseDeDatos
      .collection('recetas')
      .find( {ingredientes:ingredient })
      .limit(50)
      .toArray((err, result) => {
        if (err) {
          res.status(500).send('Error consultando los usuarios');
        } else {
          res.json(result);
          console.log(result)
        }
      });
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