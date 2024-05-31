import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedPredictionQuestion1681273013020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.asset (
        id
      ) VALUES (
        102220101
      );
    `);

    await queryRunner.query(`
      INSERT INTO ${ns}.prediction_question (
        id,
        contract_id,
        title,
        description,
        merchant_id,
        price_id,
        question_status,
        created_at,
        updated_at
      ) VALUES (
        1,
        12701,
        'Yes/No?',
        '${simpleFormatting}',
         1,
         102220101,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);

    await queryRunner.query(`SELECT setval('${ns}.achievement_rule_id_seq', 5000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_rule RESTART IDENTITY CASCADE;`);
  }
}
