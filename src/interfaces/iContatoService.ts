import { Contato } from "../models/contato";

export interface IContatoService {
    criar(userId: number, nome: string, email: string, tipo: string): Promise<Contato>
    criarVarios(contatos: any, userId: number): Promise<boolean>
    listar(userId: number): Promise<Contato[]>
    carregar(id: number): Promise<Contato | null>
    atualizar(contato: Contato, nome: string, email: string, tipo: string): Promise<Contato>
    apagar(contato: Contato): Promise<void>


}