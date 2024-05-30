import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { ContractEntity } from "../../../../hierarchy/contract/contract.entity";
import { ContractSearchDto } from "../../../../hierarchy/contract/dto";
import { LootContractService } from "./contract.service";

@ApiBearerAuth()
@Controller("/loot/contracts")
export class LootContractController {
  constructor(private readonly lootBoxContractService: LootContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.lootBoxContractService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.lootBoxContractService.findOne({ id });
  }
}
