import { MigrationInterface, QueryRunner } from "typeorm";

export function createTokenTypes(ns: string) {
  return class CreateTokenTypes1561991000005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
        CREATE TYPE ${ns}.token_type_enum AS ENUM (
          'NATIVE',
          'ERC20',
          'ERC721',
          'ERC721D',
          'ERC998',
          'ERC998D',
          'ERC1155'
        );
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TYPE ${ns}.token_type_enum;`);
    }
  };
}
