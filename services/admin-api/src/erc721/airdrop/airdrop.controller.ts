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

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { Erc721AirderopService } from "./airdrop.service";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropCreateDto, Erc721AirdropItemUpdateDto, Erc721AirdropSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc721-airdrops")
export class Erc721AirdropController {
  constructor(private readonly erc721CollectionService: Erc721AirderopService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721AirdropSearchDto): Promise<[Array<Erc721AirdropEntity>, number]> {
    return this.erc721CollectionService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc721AirdropCreateDto): Promise<Array<Erc721AirdropEntity | null>> {
    return this.erc721CollectionService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc721AirdropItemUpdateDto,
  ): Promise<Erc721AirdropEntity | null> {
    return this.erc721CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc721AirdropEntity | null> {
    return this.erc721CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc721CollectionService.delete({ id });
  }
}
