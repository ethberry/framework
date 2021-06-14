import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";

import {PhotoService} from "./photo.service";
import {PhotoEntity} from "./photo.entity";
import {PhotosController} from "./photo.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PhotoEntity])],
  providers: [PhotoService],
  controllers: [PhotosController],
  exports: [PhotoService],
})
export class PhotoModule {}
