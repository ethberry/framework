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

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc998ContractService } from "./contract.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractSearchDto, ContractUpdateDto } from "../../../hierarchy/contract/dto/";

@ApiBearerAuth()
@Controller("/erc998-contracts")
export class Erc998ContractController {
  constructor(private readonly erc998ContractService: Erc998ContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ContractSearchDto): Promise<[Array<ContractEntity>, number]> {
    return this.erc998ContractService.search(dto);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ContractUpdateDto): Promise<ContractEntity> {
    return this.erc998ContractService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc998ContractService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc998ContractService.delete({ id });
  }
}
