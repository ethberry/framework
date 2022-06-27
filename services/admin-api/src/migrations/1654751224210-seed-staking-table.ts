import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";

export class SeedStakingTable1654751224210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.staking (
        title,
        description,
        duration,
        penalty,
        recurrent,
        rule_id,
        staking_status,
        created_at,
        updated_at
      ) VALUES (
        'NATIVE <> ERC721',
        '${simpleFormatting}',
        30,
        1,
        false,
        '0',
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC20 <> ERC721 (dropbox)',
        '${simpleFormatting}',
        30,
        1,
        false,
        '0',
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'ERC721 <> ERC1155',
        '${simpleFormatting}',
        30,
        1,
        false,
        '0',
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.staking`);
  }
}
