import { Controller, Get, Param } from "@nestjs/common";

import { AddressPipe, ApiAddress, Public } from "@gemunion/nest-js-utils";

import { VestingService } from "./vesting.service";
import { VestingEntity } from "./vesting.entity";

@Public()
@Controller("/-vesting")
export class VestingController {
  constructor(private readonly vestingService: VestingService) {}

  @ApiAddress("wallet")
  @Get("/:wallet")
  public getTokenMetadata(@Param("wallet", AddressPipe) wallet: string): Promise<VestingEntity | null> {
    return this.vestingService.findOne({ beneficiary: wallet.toLowerCase() });
  }
}
