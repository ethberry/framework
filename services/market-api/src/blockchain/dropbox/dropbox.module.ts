import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropboxEntity } from "./dropbox.entity";
import { DropboxService } from "./dropbox.service";
import { DropboxController } from "./dropbox.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DropboxEntity])],
  providers: [DropboxService],
  controllers: [DropboxController],
  exports: [DropboxService],
})
export class DropboxModule {}
