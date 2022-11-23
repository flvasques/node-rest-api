import { IUserService } from "../interfaces/iUserService";
import { Contato } from "../models/contato";
import { User } from "../models/user";
const bcrypt = require("bcrypt");

export class UserService implements IUserService {
   
    async criar(nome: string, email: string, password: string): Promise<User> {
        const saltRounds = 5;
        const hash = await new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, function(err: any, hash: any) {
              if (err) reject(err)
              resolve(hash)
            });
          })
        return User.create({
            nome: nome,
            email: email,
            password: hash
        });
    }

    async carregar(email: string): Promise<User | null> {
       return User.findOne({
            where: {
                email: email
            },
            include:
            [{model: Contato, as: 'contatos'}]
        });

    }

    async atualizar(id: number, nome: string, email: string): Promise<User | null> {
        let usuario = await User.findByPk(id);
        if(usuario) {
            usuario.set({
                nome: nome,
                email: email
            });
                        
            return usuario.save();
        } else {
            return null;
        }

    }

    carregarPorId(id: number): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

}