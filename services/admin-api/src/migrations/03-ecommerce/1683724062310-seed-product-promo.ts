import { MigrationInterface, QueryRunner } from "typeorm";

import { imageUrl, ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

export class SeedProductPromo1683724062310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.product_promo (
        title,
        product_id,
        image_url,
        created_at,
        updated_at
      ) VALUES (
        'Promo 1',
        1,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 2',
        2,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        'Promo 3',
        3,
        '${imageUrl}',
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.product_promo RESTART IDENTITY CASCADE;`);
  }
}
