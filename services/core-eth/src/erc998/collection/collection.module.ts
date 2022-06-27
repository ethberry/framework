import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Erc998CollectionService } from "./collection.service";
import { UniContractEntity } from "./collection.entity";
import { Erc998TokenModule } from "../token/token.module";

@Module({
  imports: [TypeOrmModule.forFeature([UniContractEntity]), forwardRef(() => Erc998TokenModule)],
  providers: [Erc998CollectionService],
  exports: [Erc998CollectionService],
})
export class Erc998CollectionModule {}
