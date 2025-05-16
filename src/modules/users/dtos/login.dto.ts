import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";



export class LoginDto{
    @ApiProperty({type: 'string', example: 'aly@email.com', required: true})
    @IsString()
    @IsEmail()
    email: string;
  
    @Transform(({value}) => {
      if(typeof value == 'string'){
        return value.trim()
      } else {
        return value
      }
    })
    @ApiProperty({type: 'string', example: 'xxxxx', required: true})
    @IsString()
    @MinLength(4)
    password: string;
}