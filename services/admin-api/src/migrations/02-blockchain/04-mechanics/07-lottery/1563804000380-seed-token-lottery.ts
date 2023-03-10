import { MigrationInterface, QueryRunner } from "typeorm";
import { subDays } from "date-fns";

import { ns } from "@framework/constants";

export class SeedTokenLotteryAt1563804000380 implements MigrationInterface {
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
        18010101,
        '${JSON.stringify({})}',
        100,
        '1',
        'MINTED',
        180101,
        '${subDays(now, 1).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.token RESTART IDENTITY CASCADE;`);
  }
}
