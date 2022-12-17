import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";
import type { IServerSignature } from "@gemunion/types-blockchain";

import { DropService } from "./drop.service";
import { DropEntity } from "./drop.entity";
import { SignDropDto } from "./dto";

@Public()
@ApiBearerAuth()
@Controller("/drops")
export class DropController {
  constructor(private readonly dropService: DropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<DropEntity>, number]> {
    return this.dropService.search(dto);
  }

  @Get("/new")
  @UseInterceptors(PaginationInterceptor)
  public getNewTemplates(): Promise<[Array<DropEntity>, number]> {
    return this.dropService.search({ take: 10 });
  }

  @Post("/sign")
  public sign(@Body() dto: SignDropDto): Promise<IServerSignature> {
    return this.dropService.sign(dto);
  }
}
