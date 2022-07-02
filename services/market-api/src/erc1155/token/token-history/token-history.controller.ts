import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, User } from "@gemunion/nest-js-utils";

import { Erc1155TokenHistoryService } from "./token-history.service";
import { UserEntity } from "../../../user/user.entity";

@ApiBearerAuth()
@Controller("/erc1155-token-history")
export class Erc1155TokenHistoryController {
  constructor(private readonly erc1155TokenHistoryService: Erc1155TokenHistoryService) {}

  @ApiAddress("contract")
  @Get("/:contract/approve")
  public approve(@User() userEntity: UserEntity, @Param("contract", AddressPipe) contract: string): Promise<boolean> {
    return this.erc1155TokenHistoryService.getApprove(userEntity, contract);
  }
}
