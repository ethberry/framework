import { Controller, Get, Query } from "@nestjs/common";

import { Public } from "@gemunion/nest-js-utils";

import { OneInchService } from "./one-inch.service";

@Public()
@Controller("/1inch")
export class OneInchController {
  constructor(private readonly oneInchService: OneInchService) {}

  @Get("/token-list")
  public async getTokenList(@Query() dto: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneInchService.getTokenList(dto);
  }

  @Get("/quote")
  public async getQuote(@Query() dto: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneInchService.getQuote(dto);
  }

  @Get("/swap")
  public async swap(@Query() dto: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneInchService.swap(dto);
  }

  @Get("/approve")
  public async approve(@Query() dto: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.oneInchService.approve(dto);
  }
}
