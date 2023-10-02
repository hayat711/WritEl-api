import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  @Get()
  getInfo(): string {
    return `WritEl; Content creation platform powered by AI`;
  }
}
