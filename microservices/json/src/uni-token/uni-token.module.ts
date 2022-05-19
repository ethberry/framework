import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UniTokenService } from "./uni-token.service";
import { UniTokenEntity } from "./uni-token.entity";
import { UniTokenController } from "./uni-token.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UniTokenEntity])],
  providers: [UniTokenService],
  controllers: [UniTokenController],
  exports: [UniTokenService],
})
export class UniTokenModule {}
