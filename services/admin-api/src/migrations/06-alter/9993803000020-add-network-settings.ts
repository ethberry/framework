import { MigrationInterface, QueryRunner } from "typeorm";

import { ns, networks } from "@framework/constants";

export class AddNetworkSettings9993803000020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO ${ns}.settings (
        key,
        value
      ) VALUES (
        'NETWORKS',
        '${JSON.stringify(networks)}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.rollbackTransaction();
  }
}
