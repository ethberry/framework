import { forwardRef, Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractModule } from "../../../../hierarchy/contract/contract.module";
import { TemplateModule } from "../../../../hierarchy/template/template.module";
import { TemplateDeleteModule } from "../../../../hierarchy/template/template.delete.module";
import { TokenModule } from "../../../../hierarchy/token/token.module";
import { AssetModule } from "../../../../exchange/asset/asset.module";
import { VestingBoxEntity } from "./box.entity";
import { VestingBoxService } from "./box.service";
import { VestingBoxController } from "./box.controller";

@Module({
  imports: [
    ContractModule,
    TokenModule,
    forwardRef(() => AssetModule),
    forwardRef(() => TemplateModule),
    forwardRef(() => TemplateDeleteModule),
    TypeOrmModule.forFeature([VestingBoxEntity]),
  ],
  providers: [VestingBoxService],
  controllers: [VestingBoxController],
  exports: [VestingBoxService],
})
export class VestingBoxModule {}
