import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";

import { PaginationInterceptor, Public } from "@gemunion/nest-js-utils";
import { Erc721AirdropService } from "./airdrop.service";
import { Erc721AirdropEntity } from "./airdrop.entity";
import { Erc721AirdropSearchDto } from "./dto";

@Public()
@Controller("/erc721-airdrop")
export class Erc721AirdropController {
  constructor(private readonly erc721AirdropService: Erc721AirdropService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: Erc721AirdropSearchDto): Promise<[Array<Erc721AirdropEntity>, number]> {
    return this.erc721AirdropService.search(dto);
  }
}
