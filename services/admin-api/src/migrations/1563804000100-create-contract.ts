import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";

export class CreateContract1563804000100 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_status_enum AS ENUM (
        'ACTIVE',
        'INACTIVE',
        'NEW'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_module_enum AS ENUM (
        'CORE'
      );
    `);

    // MODULE:LOOTBOX
    await queryRunner.query(`ALTER TYPE ${ns}.contract_module_enum ADD VALUE 'LOOTBOX';`);

    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_template_enum AS ENUM (
        'UNKNOWN',
        'SIMPLE',
        'BLACKLIST',
        'EXTERNAL',
        'NATIVE',
        'UPGRADEABLE',
        'RANDOM'
      );
    `);

    // MODULE:LOOTBOX
    await queryRunner.query(`ALTER TYPE ${ns}.contract_template_enum ADD VALUE 'LOOTBOX';`);

    const table = new Table({
      name: `${ns}.contract`,
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
          default: "''",
        },
        {
          name: "symbol",
          type: "varchar",
          default: "''",
        },
        {
          name: "decimals",
          type: "int",
          default: 0,
        },
        {
          name: "royalty",
          type: "int",
          default: 0,
        },
        {
          name: "base_token_uri",
          type: "varchar",
          default: "''",
        },
        {
          name: "contract_status",
          type: `${ns}.contract_status_enum`,
          default: "'NEW'",
        },
        {
          name: "contract_type",
          type: `${ns}.token_type_enum`,
          default: "'NATIVE'",
        },
        {
          name: "contract_template",
          type: `${ns}.contract_template_enum`,
          default: "'UNKNOWN'",
        },
        {
          name: "contract_module",
          type: `${ns}.contract_module_enum`,
          default: "'CORE'",
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
    await queryRunner.dropTable(`${ns}.contract`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_template_enum;`);
  }
}
