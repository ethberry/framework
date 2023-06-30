import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth } from "@nestjs/swagger";

import { testChainId } from "@framework/constants";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";
import { SearchDto } from "@gemunion/collection";

import { LotteryContractService } from "./lottery.service";

import { ContractAutocompleteDto } from "../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/lottery/contracts")
export class LotteryContractController {
  constructor(
    private readonly lotteryContractService: LotteryContractService,
    private readonly configService: ConfigService,
  ) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto, @User() userEntity: UserEntity): Promise<[Array<ContractEntity>, number]> {
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
    const chainId = ~~this.configService.get<number>("CHAIN_ID", Number(testChainId));
    return this.lotteryContractService.autocomplete(dto, userEntity?.chainId || chainId);
  }
}
