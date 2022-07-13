import { Controller, Get, Param, UseInterceptors, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { AddressPipe, ApiAddress, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";

import { ContractHistoryService } from "./contract-history.service";
import { UserEntity } from "../../user/user.entity";
import { ContractHistorySearchDto } from "./dto";
import { ContractHistoryEntity } from "./contract-history.entity";

@ApiBearerAuth()
@Controller("/contract-history")
export class Erc1155TokenHistoryController {
  constructor(private readonly contractHistoryService: ContractHistoryService) {}

  @Public()
  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ContractHistorySearchDto): Promise<[Array<ContractHistoryEntity>, number]> {
    return this.contractHistoryService.search(dto);
  }

  @ApiAddress("contract")
  @Get("/:contract/approve")
  public approve(@User() userEntity: UserEntity, @Param("contract", AddressPipe) contract: string): Promise<boolean> {
    return this.contractHistoryService.getApprove(userEntity, contract);
  }
}
