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
        301001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "301001",
        })}',
        100,
        '1',
        'MINTED',
        301001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301002,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "301002",
        })}',
        100,
        '1',
        'MINTED',
        301002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        301003,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "301003",
        })}',
        100,
        '1',
        'MINTED',
        301003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305001",
          [TokenAttributes.GRADE]: "1",
        })}',
        100,
        '1',
        'MINTED',
        305001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305002,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305002",
          [TokenAttributes.GRADE]: "5",
        })}',
        100,
        '2',
        'MINTED',
        305002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        305003,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305003",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '3',
        'MINTED',
        305003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "306001",
          [TokenAttributes.GRADE]: "1",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '1',
        'MINTED',
        306001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306002,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "306002",
          [TokenAttributes.GRADE]: "5",
          [TokenAttributes.RARITY]: "2", // TokenRarity.RARE
        })}',
        100,
        '2',
        'MINTED',
        306002,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        306003,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "306003",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        100,
        '3',
        'MINTED',
        306003,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        307001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "307001",
        })}',
        100,
        '1',
        'MINTED',
        307001,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        311001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "311001",
        })}',
        100,
        '1',
        'MINTED',
        311001,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 13603, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
