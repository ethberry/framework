import { Controller, Get, Param, ParseIntPipe, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor } from "@gemunion/nest-js-utils";

import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";

@ApiBearerAuth()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id });
  }
}
