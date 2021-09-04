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
  public autocomplete(@Query() query: UserAutocompleteDto): Promise<Array<UserEntity>> {
    return this.userService.autocomplete(query);
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: UserSearchDto): Promise<[Array<UserEntity>, number]> {
    return this.userService.search(query);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() body: UserUpdateDto): Promise<UserEntity> {
    return this.userService.update({ id }, body);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<UserEntity | undefined> {
    return this.userService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.userService.delete({ id });
  }
}
