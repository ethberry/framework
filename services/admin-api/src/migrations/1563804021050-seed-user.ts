import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { wallet } from "@gemunion/constants";

export class SeedUser1563804021050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.user (
        email,
        sub,
        display_name,
        image_url,
        language,
        comment,
        user_status,
        user_roles,
        wallet,
        created_at,
        updated_at
      ) VALUES (
        'trejgun@gmail.com',
        'E5PnxZDsjEZcDzS9o2HlDGfmNzW2',
        'Trej Gun',
        '${imageUrl}',
        'EN',
        '',
        'ACTIVE',
        '{ADMIN}',
        '${wallet}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.user RESTART IDENTITY CASCADE;`);
  }
}
