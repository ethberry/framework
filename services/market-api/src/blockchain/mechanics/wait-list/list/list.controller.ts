import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { User } from "@gemunion/nest-js-utils";

import { UserEntity } from "../../../../infrastructure/user/user.entity";
import { WaitListListService } from "./list.service";
import { WaitListListEntity } from "./list.entity";

@ApiBearerAuth()
@Controller("/wait-list/list")
export class WaitListListController {
  constructor(private readonly waitListListService: WaitListListService) {}

  @Get("/autocomplete")
  public autocomplete(@User() userEntity: UserEntity): Promise<Array<WaitListListEntity>> {
    return this.waitListListService.autocomplete(userEntity);
  }
}
