import { MigrationInterface, QueryRunner } from "typeorm";

// https://stackoverflow.com/questions/50072618/how-to-create-an-uint256-in-postgresql
export function createDomainUint256() {
  return class CreateDomainUint2561561991000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
        CREATE DOMAIN uint256 AS NUMERIC
          CHECK (VALUE >= 0 AND VALUE < 2^256)
          CHECK (SCALE(VALUE) = 0);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
        DROP DOMAIN uint256;
      `);
    }
  };
}
