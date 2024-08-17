import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';

@Injectable()
export class FileService {
    async saveFile(file: Express.Multer.File[],folder:string='products') {
       const uploadFolder = `${path}/uploads/${folder}`
       await ensureDir(uploadFolder)//если нет папки то создаем
       const response:FileResponse[]=await Promise.all(file.map(async file=>{
           const originalName = `${Date.now()}-${file.originalname}`

           await writeFile(`${uploadFolder}/${originalName}`,file.buffer)
           return {name:originalName,url:`${uploadFolder}/${originalName}`}
       }))

       return response
    }
  
}

