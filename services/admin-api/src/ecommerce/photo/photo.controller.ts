import { Body, Controller, Get, Param, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor, Roles } from "@gemunion/nest-js-utils";
import { UserRole } from "@framework/types";

import { PhotoService } from "./photo.service";
import { PhotoEntity } from "./photo.entity";
import { PhotoUpdateDto } from "./dto";

@ApiBearerAuth()
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
  public update(@Param("id") id: number, @Body() dto: PhotoUpdateDto): Promise<PhotoEntity> {
    return this.photosService.update({ id }, dto);
  }
}
