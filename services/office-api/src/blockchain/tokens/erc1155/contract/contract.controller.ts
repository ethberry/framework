import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractSearchDto, ContractUpdateDto } from "../../../hierarchy/contract/dto";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { Erc1155ContractService } from "./contract.service";
import { Erc1155ContractCreateDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc1155/contracts")
export class Erc1155ContractController {
  constructor(private readonly erc1155CollectionService: Erc1155ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.erc1155CollectionService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: Erc1155ContractCreateDto, @User() userEntity: UserEntity): Promise<ContractEntity> {
    return this.erc1155CollectionService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ContractUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ContractEntity | null> {
    return this.erc1155CollectionService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc1155CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.erc1155CollectionService.delete({ id }, userEntity);
  }
}
