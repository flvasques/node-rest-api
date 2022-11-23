import { Router } from "express";
import { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import { ContatoService } from "../services/contatoService";
import { UserService } from "../services/userService";
const jwt = require('jsonwebtoken');
require('dotenv').config();

const index = Router();



const verificarJWT = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Token não enviado" });
    jwt.verify(token, process.env.SECRET, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ error: "Token invalido" });
      req.userId = decoded.id;
      next();
    });
}

const userController = new UserController(new UserService(), new ContatoService);

index.post('/usuario/login', userController.login);
index.post('/usuario/cadastar', userController.criar);
index.put('/usuario/atualizar', verificarJWT, userController.atualizar);

index.get('/contatos', verificarJWT, userController.listarConatos);
index.get('/contatos/:id', verificarJWT, userController.carregarContato);
index.post('/contatos/', verificarJWT, userController.criarContato);
index.put('/contatos/:id', verificarJWT, userController.atualizarContato);
index.delete('/contatos/:id', verificarJWT, userController.apagarContato);


export { index };