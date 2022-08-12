import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { IServerSignature } from "@gemunion/types-collection";

import { LotterySignService } from "./sign.service";
import { SignLotteryDto } from "./dto";

@ApiBearerAuth()
@Controller("/lottery/ticket")
export class LotterySignController {
  constructor(private readonly lotterySignService: LotterySignService) {}

  @Post("/sign")
  public sign(@Body() dto: SignLotteryDto): Promise<IServerSignature> {
    return this.lotterySignService.sign(dto);
  }
}
