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
import { SearchableDto, SearchableOptionalDto, SearchDto } from "@gemunion/collection";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListListService } from "./list.service";
import { WaitListListEntity } from "./list.entity";
import { WaitListGenerateDto } from "./dto";

@ApiBearerAuth()
@Controller("/waitlist/list")
export class WaitListListController {
  constructor(private readonly waitlistListService: WaitListListService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: SearchDto, @User() userEntity: UserEntity): Promise<[Array<WaitListListEntity>, number]> {
    return this.waitlistListService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: SearchableDto, @User() userEntity: UserEntity): Promise<WaitListListEntity> {
    return this.waitlistListService.create(dto, userEntity);
  }

  @Post("/generate")
  public generate(@Body() dto: WaitListGenerateDto): Promise<{ root: string }> {
    return this.waitlistListService.generate(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<WaitListListEntity>> {
    return this.waitlistListService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<WaitListListEntity | null> {
    return this.waitlistListService.findOne({ id });
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SearchableOptionalDto,
    @User() userEntity: UserEntity,
  ): Promise<WaitListListEntity | null> {
    return this.waitlistListService.update({ id, merchantId: userEntity.merchantId }, dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.waitlistListService.delete({ id, merchantId: userEntity.merchantId });
  }
}
