import {Controller, Get, Put, Param, Body, UseInterceptors} from "@nestjs/common";
import {ApiCookieAuth} from "@nestjs/swagger";

import {PaginationInterceptor} from "@trejgun/nest-js-providers";
import {UserRole} from "@trejgun/solo-types";

import {PhotoService} from "./photo.service";
import {PhotoEntity} from "./photo.entity";
import {PhotoUpdateSchema} from "./schemas";
import {Roles} from "../common/decorators";

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
  public update(@Param("id") id: number, @Body() body: PhotoUpdateSchema): Promise<PhotoEntity> {
    return this.photosService.update({id}, body);
  }
}
