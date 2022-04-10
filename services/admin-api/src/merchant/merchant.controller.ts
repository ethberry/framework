import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { MerchantService } from "./merchant.service";
import { MerchantEntity } from "./merchant.entity";
import { MerchantCreateDto, MerchantSearchDto, MerchantUpdateDto } from "./dto";
import { Roles } from "../common/decorators";
import { UserEntity } from "../user/user.entity";
import { UserRole } from "@gemunion/framework-types";

@ApiBearerAuth()
@Controller("/merchants")
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: MerchantSearchDto): Promise<[Array<MerchantEntity>, number]> {
    return this.merchantService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<MerchantEntity>> {
    return this.merchantService.autocomplete();
  }

  @Post("/")
  public create(@Body() dto: MerchantCreateDto, @User() userEntity: UserEntity): Promise<MerchantEntity> {
    return this.merchantService.create(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id") id: number,
    @Body() dto: MerchantUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<MerchantEntity | null> {
    return this.merchantService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<MerchantEntity | null> {
    return this.merchantService.findOne({ id });
  }

  @Delete("/:id")
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id") id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.merchantService.delete({ id }, userEntity);
  }
}
