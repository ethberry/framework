import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedErc998Token1563804030320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const defaultJSON = JSON.stringify({});

    await queryRunner.query(`
      INSERT INTO ${ns}.erc998_token (
        attributes,
        rarity,
        owner,
        token_id,
        token_status,
        erc998_template_id,
        created_at,
        updated_at
      ) VALUES (
        '${defaultJSON}',
        'COMMON',
        '${wallet}',
        '1',
        'MINTED',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${defaultJSON}',
        'RARE',
        '${wallet}',
        '2',
        'MINTED',
        2,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc998_token RESTART IDENTITY CASCADE;`);
  }
}
