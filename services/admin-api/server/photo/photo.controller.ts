import { Controller, Get, Put, Param, Body, UseInterceptors } from "@nestjs/common";
import { ApiCookieAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";
import { UserRole } from "@gemunion/framework-types";

import { PhotoService } from "./photo.service";
import { PhotoEntity } from "./photo.entity";
import { PhotoUpdateDto } from "./dto";
import { Roles } from "../common/decorators";

@ApiCookieAuth()
@Controller("/photos")
export class PhotosController {
  constructor(private readonly photosService: PhotoService) {}

  @Get("/")
  @UseInterceptors(PaginationInterceptor)
  public search(): Promise<[Array<PhotoEntity>, number]> {
    return this.photosService.search();
  }

  @Put("/:id")
  @Roles(UserRole.ADMIN)
  public update(@Param("id") id: number, @Body() body: PhotoUpdateDto): Promise<PhotoEntity> {
    return this.photosService.update({ id }, body);
  }
}
