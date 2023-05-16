import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { AchievementLevelService } from "./level.service";
import { AchievementLevelEntity } from "./level.entity";
import { AchievementLevelCreateDto, AchievementLevelSearchDto, AddressUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/achievements/levels")
export class AchievementLevelController {
  constructor(private readonly achievementLevelService: AchievementLevelService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: AchievementLevelSearchDto): Promise<[Array<AchievementLevelEntity>, number]> {
    return this.achievementLevelService.search(dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<AchievementLevelEntity | null> {
    return this.achievementLevelService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: AchievementLevelCreateDto): Promise<AchievementLevelEntity> {
    return this.achievementLevelService.create(dto);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: AddressUpdateDto): Promise<AchievementLevelEntity | undefined> {
    return this.achievementLevelService.update({ id }, dto);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.achievementLevelService.delete({ id });
  }
}
