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

import { DropService } from "./drop.service";
import { DropEntity } from "./drop.entity";
import { DropCreateDto, DropSearchDto, DropUpdateDto } from "./dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/drops")
export class DropController {
  constructor(private readonly dropService: DropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: DropSearchDto, @User() userEntity: UserEntity): Promise<[Array<DropEntity>, number]> {
    return this.dropService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: DropCreateDto, @User() userEntity: UserEntity): Promise<DropEntity> {
    return this.dropService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: DropUpdateDto): Promise<DropEntity> {
    return this.dropService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<DropEntity | null> {
    return this.dropService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.dropService.delete({ id }, userEntity);
  }
}
