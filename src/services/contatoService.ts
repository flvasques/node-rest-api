import { IContatoService } from "../interfaces/iContatoService";
import { Contato } from "../models/contato";

export class ContatoService implements IContatoService {
    async criar(userId: number, nome: string, email: string, tipo: string): Promise<Contato> {
        return Contato.create({
            userId: userId,
            nome : nome,
            email: email,
            tipo: tipo
        });
    }

    async criarVarios(contatos: any, userId: number): Promise<boolean> {
        for (const contato of contatos) {
           await Contato.create({
                userId: userId,
                nome : contato.nome,
                email: contato.email,
                tipo: contato.tipo
            });
        }
        return true;
    }

    async listar(userId: number): Promise<Contato[]> {
        return Contato.findAll({
            where: {
                userId: userId
            },
            attributes: ['id', 'nome'],
            raw: true
        });
    }
 
    async carregar(id: number): Promise<Contato | null> {
        return Contato.findByPk(id);
    }

    async atualizar(contato: Contato, nome: string, email: string, tipo: string): Promise<Contato> {
        contato.set({
            nome: nome,
            email: email,
            tipo: tipo
        });

        return contato.save();
    }

    async apagar(contato: Contato): Promise<void> {
        return contato.destroy()
    }
}