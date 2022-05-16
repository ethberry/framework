import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";

import { Erc20VestingService } from "./vesting.service";
import { Erc20VestingEntity } from "./vesting.entity";

@Public()
@Controller("/erc20-vesting")
export class Erc20VestingController {
  constructor(private readonly erc20VestingService: Erc20VestingService) {}

  @ApiAddress("wallet")
  @Get("/:wallet")
  public getTokenMetadata(@Param("wallet", AddressPipe) wallet: string): Promise<Erc20VestingEntity | null> {
    return this.erc20VestingService.findOne({ beneficiary: wallet.toLowerCase() });
  }
}
