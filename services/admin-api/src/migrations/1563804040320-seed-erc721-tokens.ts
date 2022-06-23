import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedErc721Token1563804040320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.erc721_token (
        attributes,
        rarity,
        owner,
        token_id,
        token_status,
        erc721_template_id,
        created_at,
        updated_at
      ) VALUES (
        '${JSON.stringify({
          rarity: 1,
        })}',
        'COMMON',
        '${wallet}',
        '1',
        'MINTED',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${JSON.stringify({
          rarity: 1,
        })}',
        'COMMON',
        '${wallet}',
        '2',
        'MINTED',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        '${JSON.stringify({
          rarity: 5,
        })}',
        'LEGENDARY',
        '${wallet}',
        '3',
        'MINTED',
        1,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.erc721_token RESTART IDENTITY CASCADE;`);
  }
}
