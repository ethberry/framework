import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { Erc1155TokenHistoryService } from "./token-history.service";
import { UserEntity } from "../../user/user.entity";

@ApiBearerAuth()
@Controller("/erc1155-token-history")
export class Erc1155TokenHistoryController {
  constructor(private readonly erc1155HistoryService: Erc1155TokenHistoryService) {}

  @Get("/:contract/approve")
  public search(@User() userEntity: UserEntity, @Param("contract") contract: string): Promise<boolean> {
    return this.erc1155HistoryService.getApprove(userEntity, contract);
  }
}
