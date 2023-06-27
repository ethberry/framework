import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
import { AchievementRuleService } from "./rule.service";
import { AchievementRuleEntity } from "./rule.entity";
import {
  AchievementRuleAutocompleteDto,
  AchievementRuleCreateDto,
  AchievementRuleSearchDto,
  AchievementRuleUpdateDto,
} from "./dto";

@ApiBearerAuth()
@Controller("/achievements/rules")
export class AchievementRuleController {
  constructor(private readonly achievementRuleService: AchievementRuleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: AchievementRuleSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.achievementRuleService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: AchievementRuleAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<AchievementRuleEntity>> {
    return this.achievementRuleService.autocomplete(dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<AchievementRuleEntity | null> {
    return this.achievementRuleService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: AchievementRuleCreateDto, @User() userEntity: UserEntity): Promise<AchievementRuleEntity> {
    return this.achievementRuleService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() dto: AchievementRuleUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<AchievementRuleEntity | undefined> {
    return this.achievementRuleService.update({ id }, dto, userEntity);
  }
}
