import {
  Body,
  ClassSerializerInterceptor,
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

import { StakingService } from "./staking.service";
import { StakingCreateDto, StakingSearchDto } from "./dto";
import { StakingEntity } from "./staking.entity";
import { StakingUpdateDto } from "./dto/update";

@ApiBearerAuth()
@Controller("/staking-rules")
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  public search(@Query() dto: StakingSearchDto): Promise<[Array<StakingEntity>, number]> {
    return this.stakingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingEntity | null> {
    return this.stakingService.findOne({ id }, { relations: { deposit: true, reward: true } });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: StakingUpdateDto,
  ): Promise<StakingEntity | null> {
    return this.stakingService.update({ id }, dto);
  }

  @Post("/")
  public create(@Body() dto: StakingCreateDto): Promise<StakingEntity> {
    return this.stakingService.create(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.stakingService.delete({ id });
  }
}
