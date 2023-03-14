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

import { StakingRulesService } from "./rules.service";
import { StakingCreateDto, StakingRuleSearchDto } from "./dto";
import { StakingRulesEntity } from "./rules.entity";
import { StakingUpdateDto } from "./dto/update";

@ApiBearerAuth()
@Controller("/staking/rules")
export class StakingRulesController {
  constructor(private readonly stakingService: StakingRulesService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: StakingRuleSearchDto): Promise<[Array<StakingRulesEntity>, number]> {
    return this.stakingService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<StakingRulesEntity | null> {
    return this.stakingService.findOneWithRelations({ id });
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
