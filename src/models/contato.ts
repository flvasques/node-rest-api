import { User } from './user';
import { Table, Model, Column, DataType, BelongsTo } from "sequelize-typescript";

@Table({
    tableName: 'contatos',
    timestamps: true,
  })
export class Contato extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id?: number | null

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references : {
            model: User,
            key: 'id'
        }
    })
    userId?: number | null

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    nome?: string | null

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email?: string | null

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    tipo?: string | null

    @BelongsTo(() => User, 'userId')
    usuario?: User
}