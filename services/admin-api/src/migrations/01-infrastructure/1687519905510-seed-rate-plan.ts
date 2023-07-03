import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedRatePlan1687519905500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.rate_plan (
        rate_plan,
        contract_module,
        contract_type,
        amount
      ) VALUES (
        'BRONZE',
        'HIERARCHY',
        'NATIVE',
        1
      ), (
        'BRONZE',
        'HIERARCHY',
        'ERC20',
        1
      ), (
        'BRONZE',
        'HIERARCHY',
        'ERC721',
        10
      ), (
        'BRONZE',
        'HIERARCHY',
        'ERC998',
        0
      ), (
        'BRONZE',
        'HIERARCHY',
        'ERC1155',
        2
      ), (
        'BRONZE',
        'WAITLIST',
        null,
        1
      ), (
        'BRONZE',
        'VESTING',
        null,
        1000
      ), (
        'BRONZE',
        'MYSTERY',
        'ERC721',
        1
      ), (
        'BRONZE',
        'LOTTERY',
        null,
        1
      ), (
        'BRONZE',
        'LOTTERY',
        'ERC721',
        1
      ), (
        'BRONZE',
        'RAFFLE',
        null,
        1
      ), (
        'BRONZE',
        'RAFFLE',
        'ERC721',
        1
      ), (
        'BRONZE',
        'COLLECTION',
        'ERC721',
        10
      ), (
        'BRONZE',
        'STAKING',
        null,
        1
      ), (
        'SILVER',
        'HIERARCHY',
        'NATIVE',
        1
      ), (
        'SILVER',
        'HIERARCHY',
        'ERC20',
        1
      ), (
        'SILVER',
        'HIERARCHY',
        'ERC721',
        10
      ), (
        'SILVER',
        'HIERARCHY',
        'ERC998',
        0
      ), (
        'SILVER',
        'HIERARCHY',
        'ERC1155',
        2
      ), (
        'SILVER',
        'WAITLIST',
        null,
        1
      ), (
        'SILVER',
        'VESTING',
        null,
        1000
      ), (
        'SILVER',
        'MYSTERY',
        'ERC721',
        1
      ), (
        'SILVER',
        'LOTTERY',
        null,
        1
      ), (
        'SILVER',
        'LOTTERY',
        'ERC721',
        1
      ), (
        'SILVER',
        'RAFFLE',
        null,
        1
      ), (
        'SILVER',
        'RAFFLE',
        'ERC721',
        1
      ), (
        'SILVER',
        'COLLECTION',
        'ERC721',
        10
      ), (
        'SILVER',
        'STAKING',
        null,
        1
      ), (
        'GOLD',
        'HIERARCHY',
        'NATIVE',
        1
      ), (
        'GOLD',
        'HIERARCHY',
        'ERC20',
        1
      ), (
        'GOLD',
        'HIERARCHY',
        'ERC721',
        10
      ), (
        'GOLD',
        'HIERARCHY',
        'ERC998',
        0
      ), (
        'GOLD',
        'HIERARCHY',
        'ERC1155',
        2
      ), (
        'GOLD',
        'WAITLIST',
        null,
        1
      ), (
        'GOLD',
        'VESTING',
        null,
        1000
      ), (
        'GOLD',
        'MYSTERY',
        'ERC721',
        1
      ), (
        'GOLD',
        'LOTTERY',
        null,
        1
      ), (
        'GOLD',
        'LOTTERY',
        'ERC721',
        1
      ), (
        'GOLD',
        'RAFFLE',
        null,
        1
      ), (
        'GOLD',
        'RAFFLE',
        'ERC721',
        1
      ), (
        'GOLD',
        'COLLECTION',
        'ERC721',
        10
      ), (
        'GOLD',
        'STAKING',
        null,
        1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.page RESTART IDENTITY CASCADE;`);
  }
}
