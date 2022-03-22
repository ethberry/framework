import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, PaginationInterceptor } from "@gemunion/nest-js-utils";

import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { UserAutocompleteDto, UserSearchDto, UserUpdateDto } from "./dto";

@ApiBearerAuth()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() dto: UserAutocompleteDto): Promise<Array<UserEntity>> {
    return this.userService.autocomplete(dto);
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() dto: UserSearchDto): Promise<[Array<UserEntity>, number]> {
    return this.userService.search(dto);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() dto: UserUpdateDto): Promise<UserEntity> {
    return this.userService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.userService.delete({ id });
  }
}
