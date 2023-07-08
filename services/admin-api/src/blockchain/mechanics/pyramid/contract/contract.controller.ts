import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { PyramidContractService } from "./contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractSearchDto, ContractUpdateDto } from "../../../hierarchy/contract/dto/";
import { UserEntity } from "../../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/pyramid/contracts")
export class PyramidContractController {
  constructor(private readonly pyramidContractService: PyramidContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.pyramidContractService.search(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ContractUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ContractEntity> {
    return this.pyramidContractService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.pyramidContractService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.pyramidContractService.delete({ id }, userEntity);
  }
}
