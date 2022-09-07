import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenAttributes } from "@framework/types";

export class SeedTokenErc721At1563804000330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();
    const now = new Date();

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
        '${subDays(now, 1).toISOString()}',
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
        '${subDays(now, 2).toISOString()}',
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
        '${subDays(now, 3).toISOString()}',
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
        '${subDays(now, 1).toISOString()}',
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
        '${subDays(now, 2).toISOString()}',
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
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        305004,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305003",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '4',
        'MINTED',
        305004,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        305005,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305003",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '5',
        'MINTED',
        305005,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        305006,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305003",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '6',
        'MINTED',
        305006,
        '${subDays(now, 6).toISOString()}',
        '${currentDateTime}'
      ), (
        305007,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305003",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '7',
        'MINTED',
        305007,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        305008,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "305003",
          [TokenAttributes.GRADE]: "10",
        })}',
        100,
        '8',
        'MINTED',
        305008,
        '${subDays(now, 8).toISOString()}',
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
        '${subDays(now, 1).toISOString()}',
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
        '${subDays(now, 2).toISOString()}',
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
        '${subDays(now, 3).toISOString()}',
        '${currentDateTime}'
      ), (
        306004,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "306001",
          [TokenAttributes.GRADE]: "10",
          [TokenAttributes.RARITY]: "4", // TokenRarity.LEGENDARY
        })}',
        100,
        '3',
        'BURNED',
        306001,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        307001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "307001",
          [TokenAttributes.GENES]: "1461501638011467653471668687260973553737594307584", // 1,2,18,128,256,1024
        })}',
        100,
        '1',
        'MINTED',
        307001,
        '${subDays(now, 0).toISOString()}',
        '${currentDateTime}'
      ), (
        308001,
        '${JSON.stringify({
          [TokenAttributes.TEMPLATE_ID]: "308001",
        })}',
        100,
        '1',
        'MINTED',
        308001,
        '${subDays(now, 0).toISOString()}',
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
        '${subDays(now, 30).toISOString()}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.token_id_seq', 13603, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
