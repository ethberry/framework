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
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimItemCreateDto, ClaimItemUpdateDto, ClaimSearchDto } from "./dto";
import { UserEntity } from "../../../infrastructure/user/user.entity";

@ApiBearerAuth()
@Controller("/claims")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ClaimSearchDto, @User() userEntity: UserEntity): Promise<[Array<ClaimEntity>, number]> {
    return this.claimService.search(dto, userEntity);
  }

  @Post("/")
  public create(@Body() dto: ClaimItemCreateDto, @User() userEntity: UserEntity): Promise<ClaimEntity> {
    return this.claimService.create(dto, userEntity);
  }

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  public upload(
    @UploadedFile() file: Express.Multer.File,
    @User() userEntity: UserEntity,
  ): Promise<Array<ClaimEntity>> {
    return this.claimService.upload(file, userEntity);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: ClaimItemUpdateDto,
    @User() userEntity: UserEntity,
  ): Promise<ClaimEntity | null> {
    return this.claimService.update({ id }, dto, userEntity);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ClaimEntity | null> {
    return this.claimService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number, @User() userEntity: UserEntity): Promise<void> {
    await this.claimService.delete({ id }, userEntity);
  }
}
