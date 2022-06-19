import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";

import { JsonService } from "./json.service";

@Controller("/json")
export class JsonController {
  constructor(private readonly jsonService: JsonService) {}

  @Get("/:sub/profile")
  @UseInterceptors(NotFoundInterceptor)
  public getBalance(@Param("sub") sub: string): Promise<Record<string, any> | undefined> {
    return this.jsonService.getBalance(sub);
  }
}
