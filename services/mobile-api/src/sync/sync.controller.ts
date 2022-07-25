import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";
import { IBalance } from "@framework/types";

import { SyncService } from "./sync.service";

@Controller("/sync")
export class SyncController {
  constructor(private readonly jsonService: SyncService) {}

  @Get("/:sub/profile")
  @UseInterceptors(NotFoundInterceptor)
  public getProfile(@Param("sub") sub: string): Promise<Record<string, any> | undefined> {
    return this.jsonService.getProfile(sub);
  }

  @Get("/:sub/balance")
  @UseInterceptors(NotFoundInterceptor)
  public getBalance(@Param("sub") sub: string): Promise<Array<IBalance> | undefined> {
    return this.jsonService.getBalance(sub);
  }
}
