const { Router } = require('express');
const router = Router();
require('dotenv').config();

const jwt = require('jsonwebtoken');

const verificarJWT = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ error: "Token não enviado" });
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Token invalido" });
      
      req.userId = decoded.id;
      next();
    });
}

const UserController = require('../controllers/userController');

const userController = new UserController();

router.post('/usuario/login', userController.login);
router.post('/usuario/cadastar', userController.criar);
router.put('/usuario/atualizar', verificarJWT, userController.atualizar);

router.get('/contatos', verificarJWT, userController.listarConatos);
router.get('/contatos/:id', verificarJWT, userController.carregarContato);
router.post('/contatos/', verificarJWT, userController.criarContato);
router.put('/contatos/:id', verificarJWT, userController.atualizarContato);
router.delete('/contatos/:id', verificarJWT, userController.apagarContato);


module.exports = router;