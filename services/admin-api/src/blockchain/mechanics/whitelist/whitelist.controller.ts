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
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

import { WhitelistService } from "./whitelist.service";
import { WhitelistEntity } from "./whitelist.entity";
import { WhitelistItemCreateDto, WhitelistSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/whitelist")
export class WhitelistController {
  constructor(private readonly whitelistService: WhitelistService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: WhitelistSearchDto): Promise<[Array<WhitelistEntity>, number]> {
    return this.whitelistService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: WhitelistItemCreateDto): Promise<WhitelistEntity> {
    return this.whitelistService.create(dto);
  }

  @Get("/generate")
  public generate(): Promise<{ proof: string }> {
    return this.whitelistService.generate();
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.whitelistService.delete({ id });
  }
}
