import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateUniContract1563804000110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.uni_contract_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'NEW'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.uni_contract_type_enum AS ENUM (
        'TOKEN',
        'DROPBOX',
        'AIRDROP'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.uni_contract_template_enum AS ENUM (
        'UNKNOWN',
        'ERC20_SIMPLE',
        'ERC20_BLACKLIST',
        'ERC20_EXTERNAL',
        'ERC20_NATIVE',
        'ERC721_SIMPLE',
        'ERC721_GRADED',
        'ERC721_RANDOM',
        'ERC998_SIMPLE',
        'ERC998_GRADED',
        'ERC998_RANDOM',
        'ERC1155_SIMPLE'
      );
    `);

    const table = new Table({
      name: `${ns}.uni_contract`,
      columns: [
        {
          name: "id",
          type: "serial",
          isPrimary: true,
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
          name: "royalty",
          type: "int",
        },
        {
          name: "base_token_uri",
          type: "varchar",
          default: "''",
        },
        {
          name: "contract_status",
          type: `${ns}.uni_contract_status_enum`,
          default: "'NEW'",
        },
        {
          name: "contract_type",
          type: `${ns}.uni_contract_type_enum`,
          default: "'TOKEN'",
        },
        {
          name: "contract_template",
          type: `${ns}.uni_contract_template_enum`,
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
    await queryRunner.dropTable(`${ns}.uni_contract`);
    await queryRunner.query(`DROP TYPE ${ns}.uni_contract_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.uni_contract_type_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.uni_contract_template_enum;`);
  }
}
