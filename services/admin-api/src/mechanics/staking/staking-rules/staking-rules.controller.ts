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

import { StakingRulesService } from "./staking-rules.service";
import { StakingCreateDto, StakingSearchDto } from "./dto";
import { StakingRulesEntity } from "./staking-rules.entity";
import { StakingUpdateDto } from "./dto/update";

@ApiBearerAuth()
@Controller("/staking-rules")
export class StakingRulesController {
  constructor(private readonly stakingService: StakingRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    return this.stakingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingRulesEntity | null> {
    return this.stakingService.findOneWithPrice({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: StakingUpdateDto,
  ): Promise<StakingRulesEntity | null> {
    return this.stakingService.update({ id }, dto);
  }

  @Post("/")
  public create(@Body() dto: StakingCreateDto): Promise<StakingRulesEntity> {
    return this.stakingService.create(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return await this.stakingService.delete({ id });
  }
}
