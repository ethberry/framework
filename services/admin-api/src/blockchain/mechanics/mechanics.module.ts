import { Module } from "@nestjs/common";

import { ClaimModule } from "./claim/claim.module";
import { MysteryModule } from "./mystery/mystery.module";
import { CraftModule } from "./craft/craft.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { GradeModule } from "./grade/grade.module";
import { DropModule } from "./drop/drop.module";
import { LotteryModule } from "./lottery/lottery.module";
import { PyramidModule } from "./pyramid/pyramid.module";
import { WaitlistModule } from "./waitlist/waitlist.module";
import { BreedModule } from "./breed/breed.module";
import { Erc721CollectionModule } from "./collection/contract/collection.module";

@Module({
  imports: [
    ClaimModule,
    MysteryModule,
    CraftModule,
    StakingModule,
    VestingModule,
    GradeModule,
    DropModule,
    LotteryModule,
    PyramidModule,
    WaitlistModule,
    BreedModule,
    Erc721CollectionModule,
  ],
})
export class MechanicsModule {}
