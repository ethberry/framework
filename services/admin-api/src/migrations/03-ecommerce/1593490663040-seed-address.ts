import { MigrationInterface, QueryRunner } from "typeorm";
import { ns } from "@framework/constants";

export class SeedAddress1593490663040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.address (
        address,
        user_id,
        is_default,
        address_status,
        created_at,
        updated_at
      ) VALUES (
        'Ukraine, Kiev, Gongadze ave. 6A, apt 82',
        3,
        true,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Indonesia, Ubud, Tirta Tawar ave. 888, j 2',
        3,
        false,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Indonesia, Bedugul, Atas Awan',
        5,
        true,
        'ACTIVE',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Indonesia, Bedugul, Atas Awan',
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
