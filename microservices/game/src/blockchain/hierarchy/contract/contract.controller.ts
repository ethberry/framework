import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseInterceptors } from "@nestjs/common";

import { NotFoundInterceptor, PaginationInterceptor, Public, User } from "@gemunion/nest-js-utils";
import { ModuleType, TokenType } from "@framework/types";

import { MerchantEntity } from "../../../infrastructure/merchant/merchant.entity";
import { ContractAutocompleteDto, ContractSearchDto, SystemContractSearchDto } from "./dto";
import { ContractService } from "./contract.service";
import { ContractEntity } from "./contract.entity";

@Public()
@Controller("/contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.contractService.search(
      dto,
      merchantEntity,
      [ModuleType.HIERARCHY],
      [TokenType.ERC721, TokenType.ERC998, TokenType.ERC1155],
    );
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: ContractAutocompleteDto,
    @User() merchantEntity: MerchantEntity,
  ): Promise<Array<ContractEntity>> {
    return this.contractService.autocomplete(dto, merchantEntity);
  }

  @Post("/system")
  @UseInterceptors(NotFoundInterceptor)
  public system(@Body() dto: SystemContractSearchDto): Promise<ContractEntity | null> {
    return this.contractService.findOne({
      contractModule: dto.contractModule as unknown as ModuleType,
      chainId: dto.chainId,
    });
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(
    @Param("id", ParseIntPipe) id: number,
    @User() merchantEntity: MerchantEntity,
  ): Promise<ContractEntity | null> {
    return this.contractService.findOneWithRelations({ id }, merchantEntity);
  }
}
