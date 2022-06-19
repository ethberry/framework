import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { GameService } from "./game.service";
import { GameController } from "./game.controller";
import { UserModule } from "../user/user.module";

@Module({
  imports: [ConfigModule, UserModule],
  providers: [GameService],
  controllers: [GameController],
  exports: [GameService],
})
export class GameModule {}
