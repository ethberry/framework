import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor, Roles } from "@gemunion/nest-js-utils";
import { UserRole } from "@framework/types";

import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { UserSearchDto, UserUpdateDto } from "./dto";

@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: UserSearchDto): Promise<[Array<UserEntity>, number]> {
    return this.userService.search(dto);
  }

  @Get("/autocomplete")
  public autocomplete(): Promise<Array<UserEntity>> {
    return this.userService.autocomplete();
  }

  @Put("/:id")
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: UserUpdateDto): Promise<UserEntity> {
    return this.userService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id });
  }
}
