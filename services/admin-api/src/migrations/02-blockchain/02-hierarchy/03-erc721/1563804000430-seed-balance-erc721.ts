import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroAddress } from "ethers";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc721At1563804020430 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        103050601, -- Shield
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        103060101, -- Sword
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        103060102, -- Sword
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
