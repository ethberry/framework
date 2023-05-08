import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { AchievementRuleService } from "./rule.service";
import { AchievementRuleEntity } from "./rule.entity";
import { AchievementRuleAutocompleteDto, AchievementRuleSearchDto, AchievementRuleUpdateDto } from "./dto";
import { UserEntity } from "../../infrastructure/user/user.entity";

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
    return this.achievementRuleService.findOne({ id });
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() dto: AchievementRuleUpdateDto,
  ): Promise<AchievementRuleEntity | undefined> {
    return this.achievementRuleService.update({ id }, dto);
  }
}
