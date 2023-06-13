import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptDto } from './dto/create-ai.dto';
import { demoResponse } from '../../common/constants/res.demo';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('teach-me')
  async teachMe(@Body() content: PromptDto) {
    return demoResponse.content;
    // return await this.aiService.teachMe(content.prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('rephrase')
  async rephrase(@Body() content: PromptDto) {
    return demoResponse;
    // return await this.aiService.rephrase(content.prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('similar-grammar')
  async similarGrammar(@Body() content: PromptDto) {
    return demoResponse.content;
    // return await this.aiService.similarGrammars(content.prompt)
  }

  @UseGuards(JwtAuthGuard)
  @Post('correct-it')
  async correctIt(@Body() content: PromptDto) {
    return demoResponse.content;
    // return await this.aiService.correctIt(content.prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('explain-me')
  async explainMe(@Body() content: PromptDto) {
    return await this.aiService.explainMe(content.prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete')
  async aiComplete(@Body() content: PromptDto) {
    console.log('complete api route is called', content.prompt);
    return await this.aiService.aiComplete(content.prompt);
  }

  @UseGuards(JwtAuthGuard)
  @Post('paraphrase')
  async paraphrase(@Body() content: PromptDto) {
    return await this.aiService.paraphrase(content.prompt);
  }
}
