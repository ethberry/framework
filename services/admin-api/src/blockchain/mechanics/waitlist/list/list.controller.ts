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
import { SearchDto } from "@gemunion/collection";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListListService } from "./list.service";
import { WaitListListEntity } from "./list.entity";
import { WaitListGenerateDto, WaitListListCreateDto, WaitListListUpdateDto, WaitListUploadDto } from "./dto";
import { WaitListItemEntity } from "../item/item.entity";

@ApiBearerAuth()
@Controller("/waitlist/list")
export class WaitListListController {
  constructor(private readonly waitListListService: WaitListListService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto, @User() userEntity: UserEntity): Promise<[Array<WaitListListEntity>, number]> {
    return this.waitListListService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: WaitListListCreateDto, @User() userEntity: UserEntity): Promise<WaitListListEntity> {
    return this.waitListListService.create(dto, userEntity);
  }

  @Post("/generate")
  public generate(@Body() dto: WaitListGenerateDto): Promise<{ root: string }> {
    return this.waitListListService.generate(dto);
  }

  @Post("/upload")
  public upload(@Body() dto: WaitListUploadDto, @User() userEntity: UserEntity): Promise<Array<WaitListItemEntity>> {
    return this.waitListListService.upload(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(@User() userEntity: UserEntity): Promise<Array<WaitListListEntity>> {
    return this.waitListListService.autocomplete(userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<WaitListListEntity | null> {
    return this.waitListListService.findOneWithRelations({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: WaitListListUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<WaitListListEntity | null> {
    return this.waitListListService.update({ id }, dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.waitListListService.delete({ id }, userEntity);
  }
}
