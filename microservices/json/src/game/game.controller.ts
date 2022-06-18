import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { GameService } from "./game.service";
import { UserEntity } from "../user/user.entity";

@ApiBearerAuth()
@Controller("/game")
export class GameController {
  constructor(private readonly tokenService: GameService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get("/:sub/profile")
  public getProfileBySub(@Param("sub") sub: string): Promise<UserEntity> {
    return this.tokenService.getProfileBySub(sub);
  }
}
