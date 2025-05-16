import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";
import { statusEnum } from "../enum";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";


export class ProductPatchDto{


  @IsOptional()
  @Transform(({value}) => {
    if(typeof value == 'string'){
      return value.trim()
    } else {
      return value
    }
  })
  @ApiProperty({type: 'string', example: 'Telvizor', required: true})
  @IsString()
  @MinLength(4)
  name: string;

  @IsOptional()
  @Transform(({value}) => {
    if(typeof value == 'string'){
      return value.trim()
    } else {
      return value
    }
  })
  @ApiProperty({type: 'string', example: 'Yaxshi telvizorlar Telvizor', required: false})
  @IsString()
  @MinLength(4)
  description: string;

  @IsOptional()
  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 100, required: false, maximum: 10000})
  @IsInt()
  @Max(10000)
  @IsPositive()
  price: number;

  @IsOptional()
  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 20, required: false, maximum: 100})
  @IsInt()
  @Max(100)
  @IsPositive()
  discount: number;

  @IsOptional()
  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 3, required: false, maximum: 5})
  @IsInt()
  @Max(5)
  @IsPositive()
  rating: number;

  @IsOptional()
  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 100, required: false, maximum: 1000})
  @IsInt()
  @Max(1000)
  @IsPositive()
  stock: number;

  
  @IsOptional()
  @ApiProperty({type: 'string', example: statusEnum.active, required: false, enum: statusEnum})
  @IsEnum(statusEnum)
  @IsString()
  status: statusEnum;

  @IsOptional()
  @ApiProperty({type: 'string', format: 'binary', required: false})
  @IsOptional()
  image?: string;
}