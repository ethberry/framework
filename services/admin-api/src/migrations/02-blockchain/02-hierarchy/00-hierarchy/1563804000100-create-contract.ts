import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns } from "@framework/constants";
import { NodeEnv } from "@framework/types";

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
        'HIERARCHY',
        'TEST',
        'MYSTERY',
        'WRAPPER',
        'LOTTERY',
        'RAFFLE',
        'STAKING',
        'PYRAMID',
        'WAITLIST',
        'VESTING',
        'POLYGON',
        'COLLECTION'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_features_enum AS ENUM (
        -- SYSTEM
        'WITHDRAW',
        'ALLOWANCE',
        
        -- ERC20
        'EXTERNAL',
        'BLACKLIST',
        'WHITELIST',
        
        -- ERC721
        'RANDOM',
        'DISCRETE',
        'GENES',
        'RENTABLE',
        'SOULBOUND',
        'VOTES',
        'TRAITS',
        
        -- ERC998
        'ERC20OWNER',
        'ERC1155OWNER',
        'STATEHASH',
        
        -- MODULE:MYSTERY
        'PAUSABLE',
        
        -- MODULE:PYRAMID
        'SPLITTER',
        'REFERRAL'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE ${ns}.contract_security_enum AS ENUM (
        'OWNABLE',
        'OWNABLE_2_STEP',
        'ACCESS_CONTROL',
        'ACCESS_CONTROL_ENUMERABLE',
        'ACCESS_CONTROL_DEFAULT_ADMIN_RULES',
        'ACCESS_CONTROL_CROSS_CHAIN'
      );
    `);

    // 01   - CM
    // 02   - exchange
    // 07   - VRF
    // 010x - native
    // 020x - erc20
    // 030x - erc721
    // 040x - erc998
    // 050x - erc1155
    // 011x - mystery
    // 012x - mystery
    // 013x - wrapper
    // 021x - raffle
    // 022x - raffle
    // 023x - lottery
    // 024x - lottery

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
          name: "parameters",
          type: "json",
          default: "'{}'",
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
          name: "contract_security",
          type: `${ns}.contract_security_enum`,
          default: "'ACCESS_CONTROL'",
          isNullable: true,
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
          name: "merchant_id",
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
      foreignKeys: [
        {
          columnNames: ["merchant_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.merchant`,
          onDelete: "CASCADE",
        },
      ],
    });

    await queryRunner.createTable(table, true);

    if (process.env.NODE_ENV === NodeEnv.production) {
      return;
    }

    await queryRunner.query(`SELECT setval('${ns}.contract_id_seq', 50000, true);`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.contract`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_module_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_features_enum;`);
  }
}
