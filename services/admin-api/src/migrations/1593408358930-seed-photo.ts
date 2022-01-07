import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@gemunion/framework-constants";

export class SeedPhoto1593408358930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.photo (
        title,
        image_url,
        product_id,
        photo_status,
        created_at,
        updated_at
      ) VALUES (
        'Title',
        '${imageUrl}',
        1,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        2,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        3,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        4,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        5,
        'DECLINED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        6,
        'DECLINED',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.photo RESTART IDENTITY CASCADE;`);
  }
}
