import { MigrationInterface, QueryRunner } from "typeorm";
import { ns } from "@framework/constants";

export class SeedAddress1683724061910 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.address (
        address_line1,
        city,
        country,
        zip,
        user_id,
        is_default,
        address_status,
        created_at,
        updated_at
      ) VALUES (
        'Jl. Raya Ubud, Villa Harmony',
        'Ubud',
        'ID',
        '04208',
        1,
        true,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Tirta Tawar ave. 888, j 2',
        'Ubud',
        'ID',
        '80571',
        3,
        false,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Atas Awan',
        'Bedugul',
        'ID',
        '82191',
        5,
        true,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Atas Awan',
        'Bedugul',
        'ID',
        '82191',
        5,
        false,
        'INACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.address RESTART IDENTITY CASCADE;`);
  }
}
