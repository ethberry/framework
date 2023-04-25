import { Body, Controller, Get, Param, ParseIntPipe, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { SearchableDto } from "@gemunion/collection";

import { AchievementRuleService } from "./rule.service";
import { AchievementRuleEntity } from "./rule.entity";

@ApiBearerAuth()
@Controller("/achievements/rules")
export class AchievementRuleController {
  constructor(private readonly achievementRuleService: AchievementRuleService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<AchievementRuleEntity>, number]> {
    return this.achievementRuleService.search();
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<AchievementRuleEntity>> {
    return this.achievementRuleService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<AchievementRuleEntity | null> {
    return this.achievementRuleService.findOne({ id });
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: SearchableDto): Promise<AchievementRuleEntity | undefined> {
    return this.achievementRuleService.update({ id }, dto);
  }
}
