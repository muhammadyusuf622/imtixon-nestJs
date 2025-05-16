import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max, Min, MinLength } from "class-validator";
import { statusEnum } from "../enum";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";


export class ProductUpdateDto{


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

  @Transform(({value}) => {
    if(typeof value == 'string'){
      return value.trim()
    } else {
      return value
    }
  })
  @ApiProperty({type: 'string', example: 'Yaxshi telvizorlar Telvizor', required: true})
  @IsString()
  @MinLength(4)
  description: string;

  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 100, required: true, maximum: 10000})
  @IsInt()
  @Max(10000)
  @IsPositive()
  price: number;

  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 20, required: true, maximum: 100})
  @IsInt()
  @Max(100)
  @IsPositive()
  discount: number;

  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 3, required: true, maximum: 5})
  @IsInt()
  @Max(5)
  @IsPositive()
  rating: number;

  @Transform(({value}) => Number(value))
  @ApiProperty({type: 'number', example: 100, required: true, maximum: 1000})
  @IsInt()
  @Max(1000)
  @IsPositive()
  stock: number;

  
  @ApiProperty({type: 'string', example: statusEnum.active, required: true, enum: statusEnum})
  @IsEnum(statusEnum)
  @IsString()
  status: statusEnum;

  @ApiProperty({type: 'string', format: 'binary', })
  @IsOptional()
  image?: string;
}