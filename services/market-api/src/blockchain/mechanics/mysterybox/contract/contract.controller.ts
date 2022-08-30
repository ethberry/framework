import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { MysteryboxContractService } from "./contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../user/user.entity";

@ApiBearerAuth()
@Controller("/mysterybox-contracts")
export class MysteryboxContractController {
  constructor(private readonly mysteryboxContractService: MysteryboxContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto, @User() userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
    return this.mysteryboxContractService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.mysteryboxContractService.findOne({ id });
  }
}
