import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {NotFoundInterceptor, PaginationInterceptor} from "@trejgun/nest-js-providers";

import {UserService} from "./user.service";
import {UserEntity} from "./user.entity";
import {UserAutocompleteSchema, UserQuickSchema, UserSearchSchema, UserUpdateSchema} from "./schemas";

@ApiCookieAuth()
@Controller("/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/autocomplete")
  public autocomplete(@Query() query: UserAutocompleteSchema): Promise<Array<UserEntity>> {
    return this.userService.autocomplete(query);
  }

  @Post("/quick")
  @UseInterceptors(ClassSerializerInterceptor)
  public quick(@Body() body: UserQuickSchema): Promise<UserEntity> {
    return this.userService.quick(body);
  }

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(@Query() query: UserSearchSchema): Promise<[Array<UserEntity>, number]> {
    return this.userService.search(query);
  }

  @Put("/:id")
  public update(@Param("id") id: number, @Body() body: UserUpdateSchema): Promise<UserEntity> {
    return this.userService.update({id}, body);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: number): Promise<UserEntity | undefined> {
    return this.userService.findOne({id});
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: number): Promise<void> {
    await this.userService.delete({id});
  }
}
