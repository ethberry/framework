import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";

export class SeedPhoto1683724061810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.photo (
        title,
        image_url,
        product_id,
        product_item_id,
        photo_status,
        created_at,
        updated_at
      ) VALUES (
        'Title',
        '${imageUrl}',
        1,
        null,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        2,
        null,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        3,
        null,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        4,
        null,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        5,
        null,
        'DECLINED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        6,
        null,
        'DECLINED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        1,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        1,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        2,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        3,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        4,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        5,
        'NEW',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        6,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        7,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        8,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Title',
        '${imageUrl}',
        null,
        9,
        'APPROVED',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.photo RESTART IDENTITY CASCADE;`);
  }
}
