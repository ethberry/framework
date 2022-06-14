import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { ns } from "@framework/constants";

export class CreateErc998TokenTable1563804030310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_token_status_enum AS ENUM (
        'MINTED',
        'BURNED'
      );
    `);
    await queryRunner.query(`
      CREATE TYPE ${ns}.erc998_token_rarity_enum AS ENUM (
        'UNKNOWN',
        'COMMON',
        'UNCOMMON',
        'RARE',
        'EPIC',
        'LEGENDARY'
      );
    `);

    const table = new Table({
      name: `${ns}.erc998_token`,
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
          type: `${ns}.erc998_token_rarity_enum`,
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
          type: `${ns}.erc998_token_status_enum`,
          default: "'MINTED'",
        },
        {
          name: "erc998_template_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "erc998_dropbox_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "erc998_token_id",
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
          columnNames: ["erc998_template_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc998_template`,
        },
        {
          columnNames: ["erc998_dropbox_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc998_dropbox`,
        },
        {
          columnNames: ["erc998_token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.erc998_token`,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.erc998_token`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_token_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.erc998_token_rarity_enum;`);
  }
}
