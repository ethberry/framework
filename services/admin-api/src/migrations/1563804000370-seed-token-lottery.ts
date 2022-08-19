import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class SeedTokenLotteryAt1563804000370 implements MigrationInterface {
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
        701001,
        '${JSON.stringify({})}',
        100,
        '1',
        'MINTED',
        701001,
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
