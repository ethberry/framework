import { Body, Controller, Get, Param, Post, UseInterceptors } from "@nestjs/common";

import { AddressPipe, ApiAddress, NotFoundInterceptor, Public } from "@gemunion/nest-js-utils";

import { VestingService } from "./vesting.service";
import { VestingEntity } from "./vesting.entity";

@Public()
@Controller("/vesting")
export class VestingController {
  constructor(private readonly vestingService: VestingService) {}

  @ApiAddress("wallet")
  @Get("/:wallet")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("wallet", AddressPipe) wallet: string): Promise<VestingEntity | null> {
    return this.vestingService.findOne({ account: wallet.toLowerCase() });
  }

  @Post("/")
  @UseInterceptors(NotFoundInterceptor)
  public sell(@Body() dto: any): Promise<VestingEntity | null> {
    return this.vestingService.sell(dto);
  }
}
