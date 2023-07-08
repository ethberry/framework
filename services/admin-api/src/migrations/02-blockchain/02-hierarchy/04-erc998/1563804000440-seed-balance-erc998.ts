import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc998At1563804020440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const erc998ContractRandomAddress = process.env.ERC998_RANDOM_ADDR || wallet;
    const erc998ContractUpgradeableAddress = process.env.ERC998_UPGRADEABLE_ADDR || wallet;

    await queryRunner.query(`
      INSERT INTO ${ns}.balance (
        account,
        amount,
        token_id,
        target_id,
        created_at,
        updated_at
      ) VALUES (
        '${erc998ContractRandomAddress}',
        1,
        104010101, -- Physical rune
        104060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        104050101, -- Grimoir #1
        104060301, -- Mage
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        104040101, -- Fireball
        104050101, -- Grimoire #1
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        104040201, -- Frostbite
        104050101, -- Grimoire #1
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        104040301, -- Lightning bolt
        104050101, -- Grimoire #1
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        104040401, -- Slow
        104050102, -- Grimoire #2
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        104040501, -- Fly
        104050102, -- Grimoire #2
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104060201,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104060301,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104070101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104090101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104110101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104120101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104130101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        104800101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        204010101,
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
