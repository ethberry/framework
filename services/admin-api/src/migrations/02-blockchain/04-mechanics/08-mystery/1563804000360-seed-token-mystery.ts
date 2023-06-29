import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenMysteryAt1563804000360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();
    const now = new Date();

    await queryRunner.query(`
      INSERT INTO ${ns}.token (
        id,
        metadata,
        royalty,
        token_id,
        token_status,
        template_id,
        created_at,
        updated_at
      ) VALUES (
        111010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110101",
        })}',
        100,
        '1',
        'MINTED',
        1110101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111010102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110101",
        })}',
        100,
        '1',
        'MINTED',
        1110101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111010103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110101",
        })}',
        100,
        '1',
        'MINTED',
        1110101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111010104,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110101",
        })}',
        100,
        '1',
        'MINTED',
        1110101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111010105,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110101",
        })}',
        100,
        '1',
        'MINTED',
        1110101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111040101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110401",
        })}',
        100,
        '1',
        'MINTED',
        1110401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111050101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110501",
        })}',
        100,
        '1',
        'MINTED',
        1110501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111060101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1110601",
        })}',
        100,
        '1',
        'MINTED',
        1110601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        111800101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1118001",
        })}',
        100,
        '1',
        'MINTED',
        1118001,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        211010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "2110101",
        })}',
        100,
        '1',
        'MINTED',
        2110101,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
