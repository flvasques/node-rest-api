import { User } from "../models/user";

export interface IUserService {
    carregar(email: string): Promise<User | null>;
    carregarPorId(id: number): Promise<User | null>;
    criar(nome: string, email: string, password: string): Promise<User>;
    atualizar(id: number, nome: string, email: string): Promise<User | null>;

}