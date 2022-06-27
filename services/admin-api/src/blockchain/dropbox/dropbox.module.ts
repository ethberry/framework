import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DropboxEntity } from "./dropbox.entity";
import { Erc998DropboxService } from "./dropbox.service";
import { Erc998DropboxController } from "./dropbox.controller";

@Module({
  imports: [TypeOrmModule.forFeature([DropboxEntity])],
  providers: [Erc998DropboxService],
  controllers: [Erc998DropboxController],
  exports: [Erc998DropboxService],
})
export class Erc998DropboxModule {}
