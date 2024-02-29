import { MigrationInterface, QueryRunner } from "typeorm";

import { ns } from "@framework/constants";

export class AlterReferralProgram9987519905550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DO $$ BEGIN
          CREATE TYPE ${ns}.referral_program_status_enum AS ENUM ('ACTIVE','INACTIVE');
       EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;`,
    );

    await queryRunner.query(
      `ALTER TABLE ${ns}.referral_program
          ADD COLUMN IF NOT EXISTS referral_program_status ${ns}.referral_program_status_enum 
            DEFAULT 'ACTIVE' NOT NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE IF EXISTS ${ns}.referral_program DROP COLUMN IF EXISTS referral_program_status;`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS ${ns}.referral_program_status_enum;`);
  }
}
