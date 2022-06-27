import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { Erc998AirdropService } from "./airdrop.service";
import { AirdropEntity } from "./airdrop.entity";

import { Erc998AirdropSearchDto } from "./dto";

@Public()
@Controller("/erc998-airdrop")
export class Erc998AirdropController {
  constructor(private readonly erc998AirdropService: Erc998AirdropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc998AirdropSearchDto): Promise<[Array<AirdropEntity>, number]> {
    return this.erc998AirdropService.search(dto);
  }
}
