import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { NodeEnv } from "@gemunion/constants";
import { ns } from "@framework/constants";
import { TokenMetadata } from "@framework/types";

export class SeedWrapperAt1563804000370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
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
        114010101,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "170101",
        })}',
        100,
        114010101,
        'MINTED',
        1140101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        114010102,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "170101",
        })}',
        100,
        114010102,
        'MINTED',
        1140101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      ), (
        114010103,
        '${JSON.stringify({
          [TokenMetadata.TEMPLATE_ID]: "170101",
        })}',
        100,
        114010103,
        'MINTED',
        1140101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
