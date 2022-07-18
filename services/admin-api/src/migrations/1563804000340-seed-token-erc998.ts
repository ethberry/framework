import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc998At1563804000340 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        attributes,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        14101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "14101",
          [TokenAttributes.RARITY]: "0", // TokenRarity.COMMON
        })}',
        100,
        '1',
        'MINTED',
        14101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "14101",
          [TokenAttributes.RARITY]: "1", // TokenRarity.UNCOMMON
        })}',
        100,
        '2',
        'MINTED',
        14101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        14103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "14101",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '3',
        'BURNED',
        14101,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 14103, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
