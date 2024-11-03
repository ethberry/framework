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

import { NotFoundInterceptor, PaginationInterceptor, User } from "@ethberry/nest-js-utils";

import { UserEntity } from "../../../../../infrastructure/user/user.entity";
import { VestingBoxAutocompleteDto, VestingBoxCreateDto, VestingBoxSearchDto, VestingBoxUpdateDto } from "./dto";
import { VestingBoxService } from "./box.service";
import { VestingBoxEntity } from "./box.entity";

@ApiBearerAuth()
@Controller("/vesting/boxes")
export class VestingBoxController {
  constructor(private readonly vestingBoxService: VestingBoxService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public searchContracts(
    @Query() dto: VestingBoxSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<VestingBoxEntity>, number]> {
    return this.vestingBoxService.search(dto, userEntity);
  }

  @Get("/autocomplete")
  public autocomplete(
    @Query() dto: VestingBoxAutocompleteDto,
    @User() userEntity: UserEntity,
  ): Promise<Array<VestingBoxEntity>> {
    return this.vestingBoxService.autocomplete(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: VestingBoxUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<VestingBoxEntity> {
    return this.vestingBoxService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<VestingBoxEntity | null> {
    return this.vestingBoxService.findOneWithRelations({ id });
  }

  @Post("/")
  public create(@Body() dto: VestingBoxCreateDto, @User() userEntity: UserEntity): Promise<VestingBoxEntity> {
    return this.vestingBoxService.create(dto, userEntity);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.vestingBoxService.delete({ id }, userEntity);
  }
}
