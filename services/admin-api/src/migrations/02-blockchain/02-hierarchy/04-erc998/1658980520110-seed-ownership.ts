import { MigrationInterface, QueryRunner } from "typeorm";
import { WeiPerEther } from "ethers";

import { ns } from "@framework/constants";

export class SeedOwnershipAt1658980520110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.ownership (
        parent_id,
        child_id,
        amount,
        created_at,
        updated_at
      ) VALUES (
        14060101, -- hero
        14050101, -- Scroll
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14060101, -- hero
        13050101, -- Chain mail
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14060101, -- hero
        13050201, -- Helmet
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14060101, -- hero
        13050301, -- Gloves
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14060101, -- hero
        12010101, -- space credit
        '${WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14060101, -- hero
        15010101, -- gold
        1000,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14090101, -- c-shirt
        13090101, -- t-shirt
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.ownership RESTART IDENTITY CASCADE;`);
  }
}
