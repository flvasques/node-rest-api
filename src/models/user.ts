import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import { Contato } from "./contato";
const bcrypt = require("bcrypt");

@Table({
    tableName: 'users',
    timestamps: true,
  })
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    nome?: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    email?: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password?: string

    @HasMany(() => Contato, {foreignKey: 'userId'})
    contatos?: Contato[]

    senhaCorreta(password: string) {
        return bcrypt.compareSync(password, this.password);
    }

}
