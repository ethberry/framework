import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseInterceptors,
} from "@nestjs/common";
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
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: UserUpdateDto): Promise<UserEntity> {
    return this.userService.update({ id }, dto);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id", ParseIntPipe) id: number): Promise<UserEntity | null> {
    return this.userService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.userService.delete({ id });
  }
}
