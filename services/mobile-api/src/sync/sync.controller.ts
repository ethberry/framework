import { Controller, Get, Param, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";

import { SyncService } from "./sync.service";

@Controller("/sync")
export class SyncController {
  constructor(private readonly jsonService: SyncService) {}

  @Get("/:sub/profile")
  @UseInterceptors(NotFoundInterceptor)
  public getBalance(@Param("sub") sub: string): Promise<Record<string, any> | undefined> {
    return this.jsonService.getProfile(sub);
  }

  // TODO GET /:sub/balance
}
