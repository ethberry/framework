import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractAutocompleteDto, ContractSearchDto } from "../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LotteryContractService } from "./lottery.service";

@ApiBearerAuth()
@Controller("/lottery/contracts")
export class LotteryContractController {
  constructor(private readonly lotteryContractService: LotteryContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.lotteryContractService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.lotteryContractService.findOne({ id });
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<ContractEntity>> {
    return this.lotteryContractService.autocomplete(dto, userEntity);
  }
}
