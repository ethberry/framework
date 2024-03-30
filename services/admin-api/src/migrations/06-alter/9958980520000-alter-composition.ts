import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class AlterCompositionAt9958980520000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.test) {
      return;
    }

    await queryRunner.query(`
    DO $$ BEGIN
        CREATE TYPE ${ns}.composition_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    `);

    await queryRunner.query(
      `alter table ${ns}.composition add composition_status ${ns}.composition_status_enum default 'ACTIVE' not null;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TYPE ${ns}.composition_status_enum;`);
    await queryRunner.query(`alter table ${ns}.composition DROP COLUMN IF EXISTS  ${ns}.composition_status_enum;`);
  }
}
