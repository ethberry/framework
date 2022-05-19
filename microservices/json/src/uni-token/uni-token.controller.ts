import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress } from "@gemunion/nest-js-utils";

import { UniTokenService } from "./uni-token.service";

@ApiBearerAuth()
@Controller("/uni-token")
export class UniTokenController {
  constructor(private readonly uniTokenService: UniTokenService) {}

  @ApiAddress("address")
  @Get("/:address")
  public getTokenMetadata(@Param("address", AddressPipe) address: string): Promise<any> {
    return this.uniTokenService.getTokens(address);
  }
}
