import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
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
        20101,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "20101",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '1',
        'MINTED',
        20101,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20102,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "20102",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '2',
        'MINTED',
        20102,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20103,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "20103",
          [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        100,
        '3',
        'MINTED',
        20103,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20201,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "20201",
        })}',
        100,
        '1',
        'MINTED',
        20201,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20202,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "20202",
        })}',
        100,
        '2',
        'MINTED',
        20202,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        20203,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "20203",
        })}',
        100,
        '3',
        'MINTED',
        20203,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 20203, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
