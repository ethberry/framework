import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { NodeEnv } from "@ethberry/constants";
import { ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedTokenVestingAt1563804100360 implements MigrationInterface {
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
        128010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1280101",
        })}',
        100,
        '1',
        'MINTED',
        1280101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        128010102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1280101",
        })}',
        100,
        '2',
        'MINTED',
        1280101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        128010103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "1280101",
        })}',
        100,
        '3',
        'MINTED',
        1280101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
