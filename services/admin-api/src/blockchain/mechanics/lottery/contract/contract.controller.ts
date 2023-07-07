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
import { ContractSearchDto, ContractUpdateDto } from "../../../hierarchy/contract/dto/";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { LotteryContractService } from "./contract.service";
import { LotteryScheduleUpdateDto } from "./dto";

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

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ContractUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ContractEntity> {
    return this.lotteryContractService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.lotteryContractService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.lotteryContractService.delete({ id }, userEntity);
  }

  @Post("/:id/schedule")
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateSchedule(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: LotteryScheduleUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<any> {
    return this.lotteryContractService.updateSchedule({ id }, dto, userEntity);
  }
}
