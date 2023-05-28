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

import { AddressPipe, ApiAddress, NotFoundInterceptor, PaginationInterceptor, User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { ContractSearchDto, ContractUpdateDto } from "../../../hierarchy/contract/dto/";
import { ContractEntity } from "../../../hierarchy/contract/contract.entity";
import { TokenEntity } from "../../../hierarchy/token/token.entity";
import { CollectionContractService } from "./contract.service";
import { CollectionUploadDto } from "./dto";

@ApiBearerAuth()
@Controller("/collection/contracts")
export class CollectionContractController {
  constructor(private readonly collectionCollectionService: CollectionContractService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public searchContracts(
    @Query() dto: ContractSearchDto,
    @User() userEntity: UserEntity,
  ): Promise<[Array<ContractEntity>, number]> {
    return this.collectionCollectionService.search(dto, userEntity);
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: ContractUpdateDto): Promise<ContractEntity> {
    return this.collectionCollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<ContractEntity | null> {
    return this.collectionCollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.collectionCollectionService.delete({ id });
  }

  @ApiAddress("address")
  @Post("/:address/upload")
  public upload(
    @Param("address", AddressPipe) address: string,
    @Body() dto: CollectionUploadDto,
  ): Promise<Array<TokenEntity>> {
    return this.collectionCollectionService.upload(address, dto);
  }
}
