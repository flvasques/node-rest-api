import { IContatoService } from './../interfaces/iContatoService';
import { Request, Response } from "express";
import { User } from "../models/user";
import { Contato } from "../models/contato";
import { IUserService } from "../interfaces/iUserService";
const jwt = require('jsonwebtoken');
require('dotenv').config();

export class UserController {

   private userService: IUserService;
   private contatoService: IContatoService;
   private regexEmail = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   private regexNome = /^[A-ZÀÁÂÃÄÈÉÊẼËÌÍÎÏÓÒÕÔÖÚÙÛÜÝÑÇa-zàáâãäèéêẽëìíïòóöôõùúüûýñç]+( [A-ZÀÁÂÃÄÈÉÊẼËÌÍÎÏÓÒÕÔÖÚÙÛÜÝÑÇa-zàáâãäèéêẽëìíïòóöôõùúüûýñç]+)+$/;
   private regexTexto = /^[A-ZÀÁÂÃÄÈÉÊẼËÌÍÎÏÓÒÕÔÖÚÙÛÜÝÑÇa-zàáâãäèéêẽëìíïòóöôõùúüûýñç0-9\-\\\.]+$/;

   constructor(userService: IUserService, contatoSrevice: IContatoService) {
    this.userService = userService;
    this.contatoService = contatoSrevice;
   }

    public login = async (req: Request, res: Response) => {
        try {
            let statusCode = 200;
            let data = null;
            const { email, password } = req.body;
            if( (!this.regexEmail.test(email)) || (!password) ) {
                statusCode = 400;
                data = { error: "Os campos email e password são obrigatórios." };
            } else {
                const usuario = await this.userService.carregar(email);
                if (usuario == null) {
                    statusCode = 400;
                    data = { error: "Email ou senha incorretos." };
                } else {
                    const correto = usuario.senhaCorreta(password);
                    if (correto) {
                        const id = usuario.id;
                        const token = jwt.sign({ id }, process.env.SECRET, {
                            expiresIn: process.env.JWTExpiracao
                        });
        
                        data = {
                            usuer: usuario.toJSON(),
                            token: token
                        }
                    } else {
                        statusCode = 400;
                        data = { error: "Email ou senha incorretos." };
                    }
                }    
            }            
            return res.status(statusCode).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    public criar = async (req: any, res: Response)  => {
        try {
            let statusCode = 201;
            let data = null;
            const { nome, email, password, contatos } = req.body;
            if( (!this.regexNome.test(nome)) || (!this.regexEmail.test(email)) || (!password) ) {
                statusCode = 400;
                data = { error: "Os campos nome, email e password são obrigatórios." };
            } else {
                let usuario = await this.userService.carregar(email);
    
                if (usuario != null) {
                    statusCode = 400;
                    data = { error: "Email ja cadastrado." };
                } else {
                           
                    usuario = await this.userService.criar(nome, email, password);
    
                    if (Array.isArray(contatos)) {
                        await this.contatoService.criarVarios(contatos, usuario.id);
                    }
        
                    const id = usuario.id;
                    const token = jwt.sign({ id }, process.env.SECRET, {
                        expiresIn: process.env.JWTExpiracao
                    });
                    
                    data = {
                        usuer: usuario?.toJSON(),
                        token: token
                    }
                }
            }

            return res.status(statusCode).send({data});
       
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    public atualizar = async (req: any, res: Response) => {
        try {
            let statusCode = 200;
            let data = null;
            const userId = req.userId;
            const { email, nome } = req.body;
            if( (!this.regexNome.test(nome)) || (!this.regexEmail.test(email)) ) {
                statusCode = 400;
                data = { error: "Os campos nome, email são obrigatórios." };
            } else {
                let usuario: any = await this.userService.carregar(email);

                if(usuario?.id != null && usuario.id != userId)  {
                    statusCode = 417;
                    data = { error: "Este email não pode ser utilizado" };
                } else {
                    usuario = await this.userService.atualizar(userId, nome, email);
                    data = {
                        user: usuario?.toJSON()
                    }
                }
            }
            
            return res.status(statusCode).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }
    
    public listarConatos = async (req: any, res: Response)  => {
        try {

            const userId = req.userId;
                       
            const contatos = await this.contatoService.listar(userId);

            return res.status(200).send({contatos});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    public carregarContato = async (req: any, res: Response) => {
        try {
            let statusCode = 200;
            let data = null;
            const userId = req.userId;       
            const id = req.params.id;
                       
            const contato = await this.contatoService.carregar(id);
            if (contato != null) {
                if (contato.userId == userId) {
                    data = contato.toJSON();       
                } else {
                    statusCode = 417;
                    data = { error: "Não foi possivel carregar o contato." };
                } 
            } else {
                statusCode = 417;
                data = { error: "Contato não encontrado." };
            }

            return res.status(statusCode).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    public criarContato = async (req: any, res: Response)  => {
        try {
            let statusCode = 201;
            let data = null;
            const userId = req.userId;
            const { nome, email, tipo } = req.body;
            if( (!this.regexTexto.test(nome)) || (!this.regexEmail.test(email)) || (!this.regexTexto.test(tipo)) ) {
                statusCode = 400
                data = { error: "Os campos nome, email e tipo são obrigatórios." };
            } else {
                const contato = await this.contatoService.criar(userId, nome, email, tipo);
                data = contato.toJSON();
            }
            
            return res.status(statusCode).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    public atualizarContato = async (req: any, res: Response) => {
        try {
            let statusCode = 200;
            let data = null;
            const userId = req.userId;
            const { nome, email, tipo } = req.body;
            const id = req.params.id;

            if( (!this.regexTexto.test(nome)) || (!this.regexEmail.test(email)) || (!this.regexTexto.test(tipo)) ) {
                statusCode = 400
                data = { error: "Os campos nome, email e tipo são obrigatórios." };
            } else {
                        
                let contato = await this.contatoService.carregar(id);
                if (contato != null) {
                    if (contato.userId == userId) {     
                        contato = await this.contatoService.atualizar(contato, nome, email, tipo);
                        data = contato.toJSON();       

                    } else {
                        statusCode = 417;
                        data = { error: "A edição não foi possivel" };
                    }
                } else {
                    statusCode = 417;
                    data = { error: "Contato não encontrado." };
                }
            }
            return res.status(statusCode).send({data});
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

    public apagarContato = async (req: any, res: Response) => {
        try {
            let statusCode = 200;
            let data = {};

            const userId = req.userId;
            const id = req.params.id;
             
            const contato = await this.contatoService.carregar(id);

            if (contato != null) {
                if (contato.userId == userId) {
                    await this.contatoService.apagar(contato);
                } else {
                    statusCode = 417;
                    data = { error: "Não foi possivel apagar o contato" };
                }
            } else {
                statusCode = 417;
                data = { error: "Contato não encontrado." };
            }
            
            
            return res.status(statusCode).send(data);
        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Ocorreu uma falha!" });
        }
    }

}
