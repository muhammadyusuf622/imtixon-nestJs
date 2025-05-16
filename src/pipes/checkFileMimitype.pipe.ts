import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import * as path from "path"


export class checkFileMimitypePipe implements PipeTransform {

  constructor(private readonly mimitypes: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    
    if(!value){
      return value;
    }


    if(!this.mimitypes.includes(path.extname(value.originalname))){
      throw new BadRequestException(`Bunday field name yuborish mumkin emas ${path.extname(value.originalname)}`)
    }

    return value
  }
}