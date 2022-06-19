import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateErc721DropboxTable1563804040210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_dropbox_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_dropbox`,
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
          name: "price",
          type: "uint256",
        },
        {
          name: "erc721_collection_id",
          type: "int",
        },
        {
          name: "erc721_template_id",
          type: "int",
        },
        {
          name: "dropbox_status",
          type: `${ns}.erc721_dropbox_status_enum`,
          default: "'ACTIVE'",
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
      foreignKeys: [
        {
          columnNames: ["erc721_collection_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_collection`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["erc721_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_template`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc721_dropbox`);
    await queryRunner.query(`DROP TYPE ${ns}.erc721_dropbox_status_enum;`);
  }
}
