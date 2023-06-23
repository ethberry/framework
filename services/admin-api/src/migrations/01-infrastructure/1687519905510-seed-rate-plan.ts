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
        10
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.page RESTART IDENTITY CASCADE;`);
  }
}
