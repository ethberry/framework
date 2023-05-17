import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedBalanceErc998At1563804020440 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        14010101, -- physical rune
        14060101, -- Warrior
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractRandomAddress}',
        1,
        14050101, -- Grimoir #1
        14060301, -- Mage
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        14040101, -- Fireball
        14050101, -- Grimoire #1
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        14040201, -- Frostbite
        14050101, -- Grimoire #1
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        14040301, -- Lightbolt
        14050101, -- Grimoire #1
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        14040401, -- Slow
        14050102, -- Grimoire #2
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${erc998ContractUpgradeableAddress}',
        1,
        14040501, -- Fly
        14050102, -- Grimoire #2
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14060201,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14060301,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14070101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14090101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14110101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14120101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        14130101,
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${wallet}',
        1,
        24010101,
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
