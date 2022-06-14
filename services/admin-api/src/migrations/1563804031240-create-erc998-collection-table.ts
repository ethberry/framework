import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc998CollectionTable1563804021240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_collection_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'NEW'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_collection_type_enum AS ENUM (
        'TOKEN',
        'DROPBOX',
        'AIRDROP'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_contract_template_enum AS ENUM (
        'SIMPLE',
        'GRADED',
        'RANDOM'
      );
    `);

    const table = new Table({
      name: `${ns}.erc998_collection`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "title",
          type: "varchar",
        },
        {
          name: "description",
          type: "json",
        },
        {
          name: "image_url",
          type: "varchar",
        },
        {
          name: "name",
          type: "varchar",
        },
        {
          name: "symbol",
          type: "varchar",
        },
        {
          name: "base_token_uri",
          type: "varchar",
        },
        {
          name: "royalty",
          type: "int",
        },
        {
          name: "collection_status",
          type: `${ns}.erc998_collection_status_enum`,
          default: "'NEW'",
        },
        {
          name: "collection_type",
          type: `${ns}.erc998_collection_type_enum`,
          default: "'TOKEN'",
        },
        {
          name: "contract_template",
          type: `${ns}.erc998_contract_template_enum`,
          default: "'SIMPLE'",
        },
        {
          name: "address",
          type: "varchar",
        },
        {
          name: "chain_id",
          type: "int",
        },
        {
          name: "created_at",
          type: "timestamptz",
        },
        {
          name: "updated_at",
          type: "timestamptz",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc998_collection`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_collection_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_collection_type_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_template_type_enum;`);
  }
}
