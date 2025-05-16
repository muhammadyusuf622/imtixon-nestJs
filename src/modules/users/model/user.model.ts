import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserRole } from "../enum";



@Table({tableName: 'users', timestamps: true})
export class UserModel extends Model{

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({type: DataType.UUID})
  declare id: string;

  @Column({type: DataType.STRING})
  declare name: string;

  @Column({type: DataType.STRING})
  declare email: string;

  @Column({type: DataType.STRING})
  declare password: string;

  @Column({type: DataType.ENUM, values: Object.values(UserRole), defaultValue: UserRole.USER})
  declare role?: UserRole.USER;
}