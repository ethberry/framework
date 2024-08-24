import { MigrationInterface, QueryRunner } from "typeorm";

import { simpleFormatting } from "@gemunion/draft-js-utils";
import { ns } from "@framework/constants";
import { NodeEnv } from "@gemunion/constants";

export class SeedPredictionQuestion1681273013020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production || process.env.NODE_ENV === NodeEnv.test) {
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
        start_timestamp,
        end_timestamp,
        max_votes,
        question_status,
        question_result,
        created_at,
        updated_at
      ) VALUES (
        1,
        12701,
        'Yes/No?',
        '${simpleFormatting}',
         1,
         102220101,
         null,
         null,
         0,
        'ACTIVE',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        2,
        12701,
        'Yes/No? (Active)',
        '${simpleFormatting}',
         1,
         102220101,
         '${currentDateTime}',
         null,
         0,
        'ACTIVE',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        3,
        12701,
        'Yes/No? (Finished)',
        '${simpleFormatting}',
         1,
         102220101,
         '${currentDateTime}',
         '${currentDateTime}',
         0,
        'ACTIVE',
        'YES',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.achievement_rule RESTART IDENTITY CASCADE;`);
  }
}
