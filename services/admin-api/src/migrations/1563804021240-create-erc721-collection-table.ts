import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateErc721CollectionTable1563804021240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_collection_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_collection_type_enum AS ENUM (
        'TOKEN',
        'DROPBOX',
        'AIRDROP'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_collection`,
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
          name: "royalty",
          type: "int",
        },
        {
          name: "collection_status",
          type: `${ns}.erc721_collection_status_enum`,
          default: "'ACTIVE'",
        },
        {
          name: "collection_type",
          type: `${ns}.erc721_collection_type_enum`,
          default: "'TOKEN'",
        },
        {
          name: "address",
          type: "varchar",
        },
        {
          name: "permission_type",
          type: `${ns}.oz_permission_type_enum`,
          default: "'UNKNOWN'",
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
    await queryRunner.dropTable(`${ns}.erc721_collection`);
  }
}
