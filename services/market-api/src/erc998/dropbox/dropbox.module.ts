import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998DropboxEntity } from "./dropbox.entity";
import { Erc998DropboxService } from "./dropbox.service";
import { Erc998DropboxController } from "./dropbox.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Erc998DropboxEntity])],
  providers: [Erc998DropboxService],
  controllers: [Erc998DropboxController],
  exports: [Erc998DropboxService],
})
export class Erc998DropboxModule {}
