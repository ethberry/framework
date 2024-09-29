import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenLootAt1563804001360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
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
        112010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120101",
        })}',
        100,
        '1',
        'MINTED',
        1120101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112010102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120101",
        })}',
        100,
        '1',
        'MINTED',
        1120101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112010103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120101",
        })}',
        100,
        '1',
        'MINTED',
        1120101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112010104,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120101",
        })}',
        100,
        '1',
        'MINTED',
        1120101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112010105,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120101",
        })}',
        100,
        '1',
        'MINTED',
        1120101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112040101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120401",
        })}',
        100,
        '1',
        'MINTED',
        1120401,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112050101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120501",
        })}',
        100,
        '1',
        'MINTED',
        1120501,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112060101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1120601",
        })}',
        100,
        '1',
        'MINTED',
        1120601,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        112800101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1128001",
        })}',
        100,
        '1',
        'MINTED',
        1128001,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        212010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "2120101",
        })}',
        100,
        '1',
        'MINTED',
        2120101,
        '${subDays(now, 2).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
