import { ArgumentMetadata, ConflictException, PipeTransform } from "@nestjs/common";



export class checkFileSizePipe implements PipeTransform {
  constructor(private readonly limit: number) {};

  transform(value: any, metadata: ArgumentMetadata) {
    
    console.log(value)
    console.log("bu method" ,metadata)
    if(!value) {
      return value
    }

    if(value?.size > this.limit){
      throw new ConflictException(`Fayl hajmi ${this.limit / 1024} MB dan oshmasligi kerak`);
    }

    return value
  }
}