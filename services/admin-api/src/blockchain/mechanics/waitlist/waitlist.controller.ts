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

import { WaitlistService } from "./waitlist.service";
import { WaitlistEntity } from "./waitlist.entity";
import { WaitlistItemCreateDto, WaitlistSearchDto } from "./dto";

@ApiBearerAuth()
@Controller("/waitlist")
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: WaitlistSearchDto): Promise<[Array<WaitlistEntity>, number]> {
    return this.waitlistService.search(dto);
  }

  @Post("/")
  public create(@Body() dto: WaitlistItemCreateDto): Promise<WaitlistEntity> {
    return this.waitlistService.create(dto);
  }

  @Get("/generate")
  public generate(): Promise<{ proof: string }> {
    return this.waitlistService.generate();
  }

  @Get("/proof")
  public proof(): Promise<{ proof: string }> {
    return this.waitlistService.proof();
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.waitlistService.delete({ id });
  }
}
