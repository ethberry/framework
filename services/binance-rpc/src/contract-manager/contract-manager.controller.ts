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

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { ContractManagerCreateDto, ContractManagerSearchDto } from "./dto";
import { ContractManagerService } from "./contract-manager.service";
import { ContractManagerEntity } from "./contract-manager.entity";
import { IContractManagerUpdateDto } from "./interfaces";

@ApiBearerAuth()
@Controller("/system-manager")
export class ContractManagerController {
  constructor(private readonly systemManagerService: ContractManagerService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ContractManagerSearchDto): Promise<[Array<ContractManagerEntity>, number]> {
    return this.systemManagerService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: ContractManagerCreateDto): Promise<ContractManagerEntity | null> {
    return this.systemManagerService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: IContractManagerUpdateDto,
  ): Promise<ContractManagerEntity | null> {
    return this.systemManagerService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractManagerEntity | null> {
    return this.systemManagerService.findOne({ id });
  }

  // todo probably remove it
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.systemManagerService.delete({ id });
  }
}
