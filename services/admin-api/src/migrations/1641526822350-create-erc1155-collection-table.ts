import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc1155CollectionTable1641526822350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc1155_collection_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'NEW'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.erc1155_contract_template_enum AS ENUM (
        'SIMPLE'
      );
    `);

    const table = new Table({
      name: `${ns}.erc1155_collection`,
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
          name: "base_token_uri",
          type: "varchar",
        },
        {
          name: "contract_template",
          type: `${ns}.erc1155_contract_template_enum`,
          default: "'SIMPLE'",
        },
        {
          name: "collection_status",
          type: `${ns}.erc1155_collection_status_enum`,
          default: "'PENDING'",
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
    await queryRunner.dropTable(`${ns}.erc1155_collection`);
    await queryRunner.query(`DROP TYPE ${ns}.erc1155_template_type_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.erc1155_collection_status_enum;`);
  }
}
