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
import { RaffleContractService } from "./contract.service";
import { RaffleScheduleUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/contracts")
export class RaffleContractController {
  constructor(private readonly raffleContractService: RaffleContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.raffleContractService.search(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ContractUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ContractEntity> {
    return this.raffleContractService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.raffleContractService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.raffleContractService.delete({ id }, userEntity);
  }

  @Post("/:id/schedule")
  @HttpCode(HttpStatus.NO_CONTENT)
  public updateSchedule(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: RaffleScheduleUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<any> {
    return this.raffleContractService.updateSchedule({ id }, dto, userEntity);
  }
}
