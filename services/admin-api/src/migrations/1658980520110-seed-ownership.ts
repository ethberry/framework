import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

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
        406001, -- hero
        405001, -- Scroll
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406001, -- hero
        305001, -- Chain mail
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406001, -- hero
        305002, -- Helmet
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406001, -- hero
        305003, -- Gloves
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406001, -- hero
        201001, -- space credit
        '${constants.WeiPerEther.toString()}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        406001, -- hero
        501001, -- gold
        '1000',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.ownership RESTART IDENTITY CASCADE;`);
  }
}
