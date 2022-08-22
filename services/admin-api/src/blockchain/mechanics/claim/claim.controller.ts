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
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { ClaimService } from "./claim.service";
import { ClaimEntity } from "./claim.entity";
import { ClaimItemCreateDto, ClaimItemUpdateDto, ClaimSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/claims")
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: ClaimSearchDto): Promise<[Array<ClaimEntity>, number]> {
    return this.claimService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: ClaimItemCreateDto): Promise<ClaimEntity> {
    return this.claimService.create(dto);
  }

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  public upload(@UploadedFile() file: Express.Multer.File): Promise<Array<ClaimEntity>> {
    return this.claimService.upload(file);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ClaimItemUpdateDto): Promise<ClaimEntity | null> {
    return this.claimService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ClaimEntity | null> {
    return this.claimService.findOneWithRelations({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.claimService.delete({ id });
  }
}
