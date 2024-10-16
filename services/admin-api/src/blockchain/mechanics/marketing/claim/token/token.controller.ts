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
import { ClaimTokenService } from "./token.service";
import { ClaimEntity } from "../claim.entity";
import { ClaimTokenCreateDto, ClaimTokenSearchDto, ClaimTokenUpdateDto, ClaimTokenUploadDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims/tokens")
export class ClaimTokenController {
  constructor(private readonly claimTokenService: ClaimTokenService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(
    @Query() dto: ClaimTokenSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ClaimEntity>, number]> {
    return this.claimTokenService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: ClaimTokenCreateDto, @User() userEntity: UserEntity): Promise<ClaimEntity> {
    return this.claimTokenService.create(dto, userEntity);
  }

  @Post("/upload")
  public upload(@Body() dto: ClaimTokenUploadDto, @User() userEntity: UserEntity): Promise<Array<ClaimEntity>> {
    return this.claimTokenService.upload(dto, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ClaimTokenUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ClaimEntity | null> {
    return this.claimTokenService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ClaimEntity | null> {
    return this.claimTokenService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.claimTokenService.delete({ id }, userEntity);
  }
}
