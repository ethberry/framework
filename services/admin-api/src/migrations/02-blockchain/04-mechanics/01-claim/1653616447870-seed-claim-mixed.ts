import { MigrationInterface, QueryRunner } from "typeorm";
import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedClaimMixedAt1653616447870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const zeroDateTime = new Date(0).toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        17001
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.asset_component (
        token_type,
        contract_id,
        template_id,
        amount,
        asset_id
      ) VALUES (
        'ERC721',
        1306,
        130601, -- sword
        '1',
        17001
      ), (
        'ERC998',
        1406,
        140601, -- warrior
        '1',
        17001
      ), (
        'ERC1155',
        1501,
        150101, -- gold
        '1000',
        17001
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.claim (
        account,
        item_id,
        claim_status,
        signature,
        nonce,
        end_timestamp,
        created_at,
        updated_at
      ) VALUES (
        '${wallet}',
        17001,
        'NEW',
        '0xcd1b1a4803b8d01757eabff41348275fdda5acf9f45511fd275e5d3076f0169549507eef804244d2a97eade4d93fd20d3f6c5aaaf1deafe97bcd01a4522deb0f1c',
        '0x01252ba107b2da38c6b1ba1dce277f777daa3f86ef63a32a59904c3db5baedc0',
        '${zeroDateTime}',
        '${currentDateTime}',
        '${currentDateTime}'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.claim RESTART IDENTITY CASCADE;`);
  }
}
