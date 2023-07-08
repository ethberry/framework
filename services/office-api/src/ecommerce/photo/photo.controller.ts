import { Body, Controller, Get, Param, ParseIntPipe, Put, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { PaginationInterceptor } from "@gemunion/nest-js-utils";

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
  public update(@Param("id", ParseIntPipe) id: number, @Body() dto: PhotoUpdateDto): Promise<PhotoEntity> {
    return this.photosService.update({ id }, dto);
  }
}
