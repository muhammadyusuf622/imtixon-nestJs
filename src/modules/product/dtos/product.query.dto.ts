import { BadRequestException } from "@nestjs/common";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from "class-validator";


const QueryName = [
  'name',
  'discount',
  'rating',
  'stock'
]

const QuerysortOrder = ['ASC', 'DESC']


const acceptedFields = [
  'id',
  'name',
  'description',
  'price',
  'discount',
  'rating',
  'stock',
  'image',
];

export class ProductQueryDto{

  @IsOptional()
  @Transform(({value}) => 
    { 
      if(QueryName.includes(value)){
        return value
      } else {
        return value = 'name'
      }
    })
  @IsString()
  @ApiPropertyOptional({type: 'string', example: 'id', enum: QueryName})
  sortField?: string;

  @IsOptional()
  @Transform(({value}) => 
    { 
      if(QuerysortOrder.includes(value)){
        return value
      } else {
        throw new BadRequestException("ASC or DESC")
      }
    })
  @IsString()
  @ApiPropertyOptional({type: 'string', example: 'ASC', enum: QuerysortOrder})
  sortOrder?: string;

  @IsOptional()
  @Transform(({value}) => Number(value))
  @IsInt()
  @ApiPropertyOptional({type: 'number', example: 10})
  limit: number;

  @IsOptional()
  @Transform(({value}) => Number(value))
  @IsInt()
  @ApiPropertyOptional({type: 'number', example: 1})
  page: number;

  @ApiProperty({ type: 'number', required: false, example: 800, })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  maxPrice?: number;

  @ApiProperty({ type: 'number', required: false, example: 200, })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  minPrice?: number;

  @IsOptional()
  @ApiProperty({type: 'string', required: false,})
  @Transform(({ value }) => {
    if (!value?.length) return acceptedFields;
    else {
      const values: string[] = value.split(',');
      const isValid = values.every((el) => acceptedFields.includes(el));
      if (!isValid)
        throw new BadRequestException(`Xato ustun yuborildi: ${value} yoki verguldan keyin probel tashlamang`);
      return values;
    }
  })
  @IsArray()
  fields?: string[];
}