import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
import { statusEnum } from "../enum";


@Table({tableName: 'product', timestamps: true})
export class ProductModel extends Model{

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({type: DataType.UUID})
    declare id: string;
  
  @Column({type: DataType.STRING})
  name: string;

  @Column({type: DataType.STRING})
  description: string;

  @Column({type: DataType.BIGINT})
  price: number;

  @Column({type: DataType.SMALLINT})
  discount: number;

  @Column({type: DataType.SMALLINT})
  rating: number;

  @Column({type: DataType.SMALLINT})
  stock: number;

  @Column({type: DataType.ENUM, values: Object.values(statusEnum), defaultValue: statusEnum.active})
  status?: statusEnum.active;

  @Column({type: DataType.STRING})
  image: string;
}