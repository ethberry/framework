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

import { AirdropService } from "./airdrop.service";
import { AirdropEntity } from "./airdrop.entity";
import { AirdropItem, AirdropItemUpdateDto, AirdropSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/airdrops")
export class AirdropController {
  constructor(private readonly airdropService: AirdropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: AirdropSearchDto): Promise<[Array<AirdropEntity>, number]> {
    return this.airdropService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: AirdropItem): Promise<AirdropEntity> {
    return this.airdropService.create(dto);
  }

  @Put("/:id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AirdropItemUpdateDto,
  ): Promise<AirdropEntity | null> {
    return this.airdropService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<AirdropEntity | null> {
    return this.airdropService.findOne(
      { id },
      {
        join: {
          alias: "asset",
          leftJoinAndSelect: {
            price: "asset.item",
            components: "price.components",
          },
        },
      },
    );
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.airdropService.delete({ id });
  }
}
