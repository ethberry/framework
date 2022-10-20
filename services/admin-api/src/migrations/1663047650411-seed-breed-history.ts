import { MigrationInterface, QueryRunner } from "typeorm";

import { wallet } from "@gemunion/constants";

import { ns } from "@framework/constants";

export class SeedBreedHistory1663047650411 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
        INSERT INTO ${ns}.breed_history (id,
                                         account,
                                         child_id,
                                         matron_id,
                                         sire_id,
                                         history_id,
                                         created_at,
                                         updated_at)
        VALUES (1,
                '${wallet}',
                3,
                1,
                2,
                406005,
                '${currentDateTime}',
                '${currentDateTime}'),
               (1,
                '${wallet}',
                null,
                2,
                1,
                406005,
                '${currentDateTime}',
                '${currentDateTime}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.breed_history RESTART IDENTITY CASCADE;`);
  }
}
