import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import DatabaseFile from "./entity/databaseFile.entity";
import {QueryRunner, Repository} from "typeorm";

@Injectable()
export class DatabaseFileService {
    constructor(@InjectRepository(DatabaseFile) private readonly databaseFileRepository : Repository<DatabaseFile>,) {
    }


    async uploadDatabaseFile(dataBuffer: Buffer, filename : string, queryRunner: QueryRunner) {
        const newFile = await queryRunner.manager.create(DatabaseFile, {
            filename,
            data: dataBuffer
        });

        await queryRunner.manager.save(DatabaseFile, newFile);
        return newFile;
    }

    async getFileById(fileId: string) {
        const file = await this.databaseFileRepository.findOne({
            where: {
                id: fileId
            }
        });
        if (!file) {
            throw new NotFoundException();
        }
        return file;
    }

    async deleteFile(fileId: string, queryRunner: QueryRunner){
        const deleteResponse = await queryRunner.manager.delete(DatabaseFile, fileId);
        if (!deleteResponse.affected) {
            throw new NotFoundException();
        }
    }

}
