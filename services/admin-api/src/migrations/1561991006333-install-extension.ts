import { MigrationInterface, QueryRunner } from "typeorm";

export class InstallExtension1561991006333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`-- do nothing`);
  }
}
