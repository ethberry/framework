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
        'SYSTEM',
        'HIERARCHY'
      );
    `);

    // MODULE:MYSTERY
    await queryRunner.query(`ALTER TYPE ${ns}.contract_module_enum ADD VALUE 'MYSTERY';`);

    // MODULE:WRAPPER
    await queryRunner.query(`ALTER TYPE ${ns}.contract_module_enum ADD VALUE 'WRAPPER';`);

    // MODULE:LOTTERY
    await queryRunner.query(`ALTER TYPE ${ns}.contract_module_enum ADD VALUE 'LOTTERY';`);

    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_features_enum AS ENUM (
        'ALLOWANCE',
        'BLACKLIST',
        'EXTERNAL',
        'NATIVE',
        'SOULBOUND'
      );
    `);

    // MODULE:GRADE
    await queryRunner.query(`ALTER TYPE ${ns}.contract_features_enum ADD VALUE 'UPGRADEABLE';`);

    // MODULE:RARITY
    await queryRunner.query(`ALTER TYPE ${ns}.contract_features_enum ADD VALUE 'RANDOM';`);

    // MODULE:GENES
    await queryRunner.query(`ALTER TYPE ${ns}.contract_features_enum ADD VALUE 'GENES';`);

    // MODULE:MYSTERY
    await queryRunner.query(`ALTER TYPE ${ns}.contract_features_enum ADD VALUE 'PAUSABLE';`);

    // MODULE:ERC998
    await queryRunner.query(`ALTER TYPE ${ns}.contract_features_enum ADD VALUE 'ERC20OWNER';`);
    await queryRunner.query(`ALTER TYPE ${ns}.contract_features_enum ADD VALUE 'ERC1155OWNER';`);

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
          isNullable: true,
        },
        {
          name: "contract_features",
          type: `${ns}.contract_features_enum`,
          isArray: true,
        },
        {
          name: "contract_module",
          type: `${ns}.contract_module_enum`,
          default: "'HIERARCHY'",
        },
        {
          name: "is_paused",
          type: "boolean",
          default: false,
        },
        {
          name: "from_block",
          type: "int",
          default: 0,
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
    await queryRunner.query(`DROP TYPE ${ns}.contract_features_enum;`);
  }
}
