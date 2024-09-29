import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { NativeContractService } from "./contract.service";
import { NativeContractCreateDto, NativeContractUpdateDto } from "./dto";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractSearchDto } from "../../../hierarchy/contract/dto";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/native/contracts")
export class NativeTokenController {
  constructor(private readonly nativeContractService: NativeContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.nativeContractService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: NativeContractCreateDto, @User() userEntity: UserEntity): Promise<ContractEntity> {
    return this.nativeContractService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: NativeContractUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ContractEntity> {
    return this.nativeContractService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.nativeContractService.findOne({ id }, { relations: { templates: true } });
  }

  @Delete("/:id")
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<ContractEntity> {
    return this.nativeContractService.delete({ id }, userEntity);
  }
}
