import {ArgumentMetadata, Injectable, PipeTransform} from "@nestjs/common";


@Injectable()
export class FileSizeValidationPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata): any {
        const fiftyMb = 50000000;
        return value.size < fiftyMb;
    }
}