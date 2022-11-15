import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { EthLoggerService } from "./eth-logger.service";
import { EthLoggerInOutDto } from "./dto";

@ApiBearerAuth()
@Controller("/eth-logger")
export class EthLoggerController {
  constructor(private readonly ethLoggerService: EthLoggerService) {}

  @Post("/add")
  @HttpCode(HttpStatus.NO_CONTENT)
  public addListener(@Body() dto: EthLoggerInOutDto): Promise<any> {
    return this.ethLoggerService.addListener(dto);
  }

  @Post("/remove")
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeListener(@Body() dto: EthLoggerInOutDto): Promise<any> {
    return this.ethLoggerService.removeListener(dto);
  }
}
