import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress } from "ethers";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedBalanceErc721At1563804020430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        target_id,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        1,
        103010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103010201,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103010301,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103050101, -- Cuirass
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103050201, -- Helmet
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103050301, -- Cuisses
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103050401, -- Gauntlets
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103050501, -- Sabatons
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103050601, -- Round Shield
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103050701, -- Heater Shield
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103050801, -- Royal Shield
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103050901, -- Cloak
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103051001, -- Robe
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103051101, -- Mage''s Hat
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103051201, -- Witch''s Hat
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103051301, -- Viking''s Helmet
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103060101, -- Sword #1
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103060102, -- Sword #2
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103060103, -- Sword #3
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103060201, -- Mace
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${ZeroAddress}', -- burned
        1,
        103060301, -- Axe
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103060401, -- Bow
        104060201, -- Rouge
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103060501, -- Staff
        104060301, -- Mage
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103061001, -- Mjölnir
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103070101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103080101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103090101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103800101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        203010101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.balance RESTART IDENTITY CASCADE;`);
  }
}
