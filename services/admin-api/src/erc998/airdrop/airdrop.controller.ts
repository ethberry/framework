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

import { Erc998AirderopService } from "./airdrop.service";
import { Erc998AirdropEntity } from "./airdrop.entity";
import { Erc998AirdropCreateDto, Erc998AirdropItemUpdateDto, Erc998AirdropSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/erc998-airdrops")
export class Erc998AirdropController {
  constructor(private readonly erc998CollectionService: Erc998AirderopService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998AirdropSearchDto): Promise<[Array<Erc998AirdropEntity>, number]> {
    return this.erc998CollectionService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: Erc998AirdropCreateDto): Promise<Array<Erc998AirdropEntity | null>> {
    return this.erc998CollectionService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Erc998AirdropItemUpdateDto,
  ): Promise<Erc998AirdropEntity | null> {
    return this.erc998CollectionService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<Erc998AirdropEntity | null> {
    return this.erc998CollectionService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.erc998CollectionService.delete({ id });
  }
}
