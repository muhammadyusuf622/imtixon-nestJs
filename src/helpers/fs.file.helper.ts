import { BadRequestException, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "node:fs"
import * as fsPromis from "fs/promises"
import { promises } from "node:dns";




@Injectable()
export class FsHelper{

  async uploadFile(file: Express.Multer.File, deleteFile: string = 'yet'){

    if(deleteFile != 'yet'){
      try {
        const imgAbsalutPath = path.join(process.cwd())
        await fsPromis.unlink(imgAbsalutPath + deleteFile);
      } catch (error) {
        throw new BadRequestException(error,'File uchirishda Xatolik: ❌')
      }
    }

    if(file) {

      const fileFolder = path.join(process.cwd(), 'uploads');

      if(!fs.existsSync(fileFolder)){
        fs.mkdirSync(fileFolder, {recursive: true});
      }

      let fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-image${path.extname(file.originalname)}`;

      await fsPromis.writeFile(path.join(fileFolder, fileName), file.buffer);


      return path.join('/' + fileFolder.split('/').splice(7).join(), fileName);
    }
  }
}