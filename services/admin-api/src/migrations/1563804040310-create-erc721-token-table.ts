import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateErc721TokenTable1563804040310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_token_status_enum AS ENUM (
        'MINTED',
        'BURNED'
      );
    `);
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc721_token_rarity_enum AS ENUM (
        'UNKNOWN',
        'COMMON',
        'UNCOMMON',
        'RARE',
        'EPIC',
        'LEGENDARY'
      );
    `);

    const table = new Table({
      name: `${ns}.erc721_token`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
        },
        {
          name: "attributes",
          type: "json",
        },
        {
          name: "rarity",
          type: `${ns}.erc721_token_rarity_enum`,
          default: "'UNKNOWN'",
        },
        {
          name: "owner",
          type: "varchar",
        },
        {
          name: "token_id",
          type: "uint256",
        },
        {
          name: "token_status",
          type: `${ns}.erc721_token_status_enum`,
          default: "'MINTED'",
        },
        {
          name: "erc721_template_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "erc721_dropbox_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "erc721_token_id",
          type: "int",
          isNullable: true,
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
          columnNames: ["erc721_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_template`,
        },
        {
          columnNames: ["erc721_dropbox_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_dropbox`,
        },
        {
          columnNames: ["erc721_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc721_token`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc721_token`);
    await queryRunner.query(`DROP TYPE ${ns}.erc721_token_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.erc721_token_rarity_enum;`);
  }
}
