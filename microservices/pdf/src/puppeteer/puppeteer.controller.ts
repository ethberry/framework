import { Controller, Get, Query } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { PdfType } from "@gemunion/framework-types";

import { PuppeteerService } from "./puppeteer.service";

@Controller()
export class PuppeteerController {
  constructor(private readonly tplService: PuppeteerService) {}

  @Get(PdfType.PRINT)
  async test2(@Query() payload: string): Promise<string> {
    return this.tplService.print(payload);
  }

  @MessagePattern(PdfType.PRINT)
  async test(@Payload() payload: string): Promise<string> {
    return this.tplService.print(payload);
  }
}
