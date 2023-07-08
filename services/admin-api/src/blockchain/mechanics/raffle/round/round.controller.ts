import {
  Body,
  Controller,
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

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";
import { PaginationDto } from "@gemunion/collection";

import { RaffleRoundService } from "./round.service";
import { RaffleRoundEntity } from "./round.entity";
import { RaffleScheduleUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/raffle/rounds")
export class RaffleRoundController {
  constructor(private readonly raffleRoundService: RaffleRoundService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: PaginationDto): Promise<[Array<RaffleRoundEntity>, number]> {
    return this.raffleRoundService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<RaffleRoundEntity>> {
    return this.raffleRoundService.autocomplete();
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<RaffleRoundEntity | null> {
    return this.raffleRoundService.findOne({ id }, { relations: { contract: true } });
  }

  @Post("/schedule")
  @HttpCode(HttpStatus.NO_CONTENT)
  public update(@Body() dto: RaffleScheduleUpdateDto): Promise<any> {
    return this.raffleRoundService.updateSchedule(dto);
  }
}
