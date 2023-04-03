import { Module } from "@nestjs/common";

import { BreedModule } from "./breed/breed.module";
import { ClaimModule } from "./claim/claim.module";
import { CollectionContractModule } from "./collection/contract/contract.module";
import { CraftModule } from "./craft/craft.module";
import { DropModule } from "./drop/drop.module";
import { GradeModule } from "./grade/grade.module";
import { LotteryModule } from "./lottery/lottery.module";
import { MysteryModule } from "./mystery/mystery.module";
import { PyramidModule } from "./pyramid/pyramid.module";
import { RentModule } from "./rent/rent.module";
import { StakingModule } from "./staking/staking.module";
import { VestingModule } from "./vesting/vesting.module";
import { WaitlistModule } from "./waitlist/waitlist.module";

@Module({
  imports: [
    BreedModule,
    ClaimModule,
    CollectionContractModule,
    CraftModule,
    DropModule,
    GradeModule,
    LotteryModule,
    MysteryModule,
    RentModule,
    StakingModule,
    PyramidModule,
    VestingModule,
    WaitlistModule,
  ],
})
export class MechanicsModule {}
