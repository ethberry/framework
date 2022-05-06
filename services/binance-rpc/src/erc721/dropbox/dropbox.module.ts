import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc721DropboxEntity } from "./dropbox.entity";
import { Erc721DropboxService } from "./dropbox.service";

@Module({
  imports: [TypeOrmModule.forFeature([Erc721DropboxEntity])],
  providers: [Erc721DropboxService],
  exports: [Erc721DropboxService],
})
export class Erc721DropboxModule {}
