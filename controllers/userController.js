const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();

const User = require('../models/user');
const Contato = require('../models/contato');

const saltRounds = 5;


class UserController {

    async login (req, res) {
        try {
            const { email, password } = req.body;
            if( (!email) || (!password) ) {
                return res.status(400).send({ error: "Os campos email e password são obrigatórios." });
            }

            const usuario = await User.findOne({
                where: {
                    email: email
                },
                include:
                [{model: Contato, as: 'constatos'}]
            });

            if (usuario == null) {
                return res.status(401).send({ error: "Email ou senha incorretos." });
            }

            const correto = bcrypt.compareSync(password, usuario.password);
            if (correto) {
                const id = usuario.id;
                const token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: process.env.JWTExpiracao
                });

                const data = {
                    usuer: usuario.toJSON(),
                    token: token
                }
                return res.status(200).send({data});
            } else {
                return res.status(401).send({ error: "Email ou senha incorretos." });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    async criar (req,res) {
        try {
            
            const { nome, email, password, contatos } = req.body;
            if( (!nome) || (!email) || (!password) ) {
                return res.status(400).send({ error: "Os campos nome, email e password são obrigatórios." });
            }
            let usuario = await User.findOne({
                where: {
                    email: email
                }
            });

            if (usuario != null) {
                return res.status(400).send({ error: "Email ja cadastrado." });
            }

            const hash = await new Promise((resolve, reject) => {
                bcrypt.hash(password, saltRounds, function(err, hash) {
                  if (err) reject(err)
                  resolve(hash)
                });
              })

            usuario = await User.create({
                nome: nome,
                email: email,
                password: hash
            });

            if (Array.isArray(contatos)) {
                for (const contato of contatos) {
                    Contato.create({
                        userId: usuario.id,
                        nome : contato.nome,
                        email: contato.email,
                        tipo: contato.tipo
                    });
                }                    
            }

            const id = usuario.id;
            const token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: process.env.JWTExpiracao
            });
            
            const data = {
                usuer: usuario.toJSON(),
                token: token
            }

            
            return res.status(200).send({data});
       
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    async atualizar (req, res) {
        try {
            const userId = req.userId;
            const { email, nome } = req.body;
            if( (!email) || (!nome) ) {
                return res.status(400).send({ error: "Os campos nome, email são obrigatórios." });
            }

            let usuario = await User.findOne({
                where: {
                    email: email
                }
            });
            if(usuario.id != null && usuario.id != userId)  {
                return res.status(417).send({ error: "Este email não pode ser usutilizado" });
            }

            usuario = await User.findByPk(userId);
            usuario.set({
                nome: nome,
                email: email
            });
            
            await usuario.save();
            const data = {
                usuer: usuario.toJSON()
            }
            return res.status(200).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }
    
    async listarConatos (req, res) {
        try {
            const userId = req.userId;
                       
            const contatos = await Contato.findAll({
                where: {
                    userId: userId
                },
                attributes: ['id', 'nome'],
                raw: true
            });

            return res.status(200).send({contatos});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    async carregarContato (req, res) {
        try {
            const userId = req.userId;       
            const id = req.params.id;
                       
            const contato = await Contato.findByPk(id);

            if (contato == null) {
                return res.status(417).send({ error: "Contato não encontrado." });
            }

            if (contato.userId != userId) {
                return res.status(417).send({ error: "Não foi possivel carregar o contato" });
            }
            
            const data = contato.toJSON();
            return res.status(200).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }
    

    async criarContato (req, res) {
        try {
            const userId = req.userId;
            const { nome, email, tipo } = req.body;
            if( (!nome) || (!email) || (!tipo) ) {
                return res.status(400).send({ error: "Os campos nome, email e tipo são obrigatórios." });
            }
            
            const contato = await Contato.create({
                userId: userId,
                nome : nome,
                email: email,
                tipo: tipo
            });
            const data = contato.toJSON();
            return res.status(200).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    async atualizarContato (req, res) {
        try {
            const userId = req.userId;
            const { nome, email, tipo } = req.body;
            const id = req.params.id;

            if( (!nome) || (!email) || (!tipo) ) {
                return res.status(400).send({ error: "Os campos nome, email e tipo são obrigatórios." });
            }
                        
            const contato = await Contato.findByPk(id);

            if (contato == null) {
                return res.status(417).send({ error: "Contato não encontrado." });
            }
            if (contato.userId != userId) {
                return res.status(417).send({ error: "A edição não foi possivel" });
            }

            await contato.set({
                nome: nome,
                email: email,
                tipo: tipo
            });

            await contato.save();
            
            const data = contato.toJSON();
            return res.status(200).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }
    async apagarContato (req, res) {
        try {

            const userId = req.userId;
            const id = req.params.id;
             
            const contato = await Contato.findByPk(id);

            if (contato == null) {
                return res.status(417).send({ error: "Contato não encontrado." });
            }
            if (contato.userId != userId) {
                return res.status(417).send({ error: "Não foi possivel apagar o contato" });
            }

            await contato.destroy();
            
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

}

module.exports = UserController;