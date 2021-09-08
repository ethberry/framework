import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { TemplateType } from "@gemunion/framework-types";

import { HandlebarsService } from "./handlebars.service";

@Controller()
export class HandlebarsController {
  constructor(private readonly tplService: HandlebarsService) {}

  @Get(TemplateType.TEST)
  @HttpCode(HttpStatus.NO_CONTENT)
  async test2(@Query() payload: any): Promise<string> {
    return this.tplService.tpl(TemplateType.TEST, payload);
  }

  @MessagePattern(TemplateType.TEST)
  async test(@Payload() payload: any): Promise<string> {
    return this.tplService.tpl(TemplateType.TEST, payload);
  }
}
