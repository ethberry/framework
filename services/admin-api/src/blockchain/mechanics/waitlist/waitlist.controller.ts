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
import { WaitlistGenerateDto, WaitlistItemCreateDto, WaitlistSearchDto } from "./dto";

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

  @Post("/generate")
  public generate(@Body() dto: WaitlistGenerateDto): Promise<{ root: string }> {
    return this.waitlistService.generate(dto);
  }

  @Post("/generate")
  public proof(@Body() dto: WaitlistGenerateDto): Promise<{ proof: Array<string> }> {
    return this.waitlistService.proof(dto);
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.waitlistService.delete({ id });
  }
}
