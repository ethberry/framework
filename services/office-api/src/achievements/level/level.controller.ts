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

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../infrastructure/user/user.entity";
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
  public create(
    @Body() dto: AchievementLevelCreateDto,
    @User() userEntity: UserEntity,
  ): Promise<AchievementLevelEntity> {
    return this.achievementLevelService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AddressUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<AchievementLevelEntity | undefined> {
    return this.achievementLevelService.update({ id }, dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.achievementLevelService.delete({ id }, userEntity);
  }
}
