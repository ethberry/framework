import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractSearchDto } from "../../../hierarchy/contract/dto";
import { Erc1155ContractService } from "./contract.service";

@ApiBearerAuth()
@Controller("/erc1155/contracts")
export class Erc1155ContractController {
  constructor(private readonly erc1155ContractService: Erc1155ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.erc1155ContractService.search(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc1155ContractService.findOne({ id });
  }
}
