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
import { ApiBearerAuth } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { AddressPipe, ApiAddress, NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { Erc721CollectionService } from "./collection.service";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { ContractSearchDto, ContractUpdateDto } from "../../../hierarchy/contract/dto/";
import { UserEntity } from "../../../../user/user.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { TemplateEntity } from "../../../hierarchy/template/template.entity";
import { TemplateSearchDto } from "../../../hierarchy/template/dto";
import { TokenSearchDto } from "../../../hierarchy/token/dto";

@ApiBearerAuth()
@Controller("/collections")
export class Erc721CollectionController {
  constructor(private readonly erc721CollectionService: Erc721CollectionService) {}

  @Get("/contracts/")
  @UseInterceptors(PaginationInterceptor)
  public searchContracts(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.erc721CollectionService.searchContracts(dto, userEntity);
  }

  @Get("/templates/")
  @UseInterceptors(PaginationInterceptor)
  public searchTemplates(
    @Query() dto: TemplateSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TemplateEntity>, number]> {
    return this.erc721CollectionService.searchTemplates(dto, userEntity);
  }

  @Get("/tokens/")
  @UseInterceptors(PaginationInterceptor)
  public searchTokens(
    @Query() dto: TokenSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<TokenEntity>, number]> {
    return this.erc721CollectionService.searchTokens(dto, userEntity);
  }

  @Put("/contracts/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ContractUpdateDto): Promise<ContractEntity> {
    return this.erc721CollectionService.update({ id }, dto);
  }

  @Get("/contracts/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.erc721CollectionService.findOne({ id });
  }

  @Get("/templates/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneTemplate(@Param("id", ParseIntPipe) id: number): Promise<TemplateEntity | null> {
    return this.erc721CollectionService.findOneTemplate({ id });
  }

  @Get("/tokens/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOneToken(@Param("id", ParseIntPipe) id: number): Promise<TokenEntity | null> {
    return this.erc721CollectionService.findOneToken({ id }, { relations: { template: true } });
  }

  @Delete("/contracts/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc721CollectionService.delete({ id });
  }

  @ApiAddress("address")
  @Post("/contracts/:address/upload")
  @UseInterceptors(FileInterceptor("file"))
  public upload(
    @Param("address", AddressPipe) address: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Array<TokenEntity>> {
    return this.erc721CollectionService.upload(address, file);
  }
}
