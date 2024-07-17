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
        'CONTRACT_MANAGER',
        'COLLECTION',
        'CHAIN_LINK',
        'DISPENSER',
        'EXCHANGE',
        'HIERARCHY',
        'LOOT',
        'LOTTERY',
        'MYSTERY',
        'PAYMENT_SPLITTER',
        'PONZI',
        'PREDICTION',
        'RAFFLE',
        'STAKING',
        'TEST',
        'VESTING',
        'WAIT_LIST',
        'WRAPPER'
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
        
        -- MODULE:PONZI
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

    // networks
    // 1 - besu
    // 2 - binance
    // 3 - mainnet
    // 4 - polygon
    // 5 - binance test
    // 6 - polygon amoy

    // mechanics
    // 01   - CM
    // 02   - exchange
    // 07   - VRF
    // 08   - dispenser
    // 01x - native
    // 02x - erc20
    // 03x - erc721
    // 04x - erc998
    // 05x - erc1155
    // 11x - mystery
    // 12x - loot
    // 13x - wrapper
    // 21x - raffle
    // 22x - raffle
    // 23x - lottery
    // 24x - lottery
    // 25x - staking
    // 26x - ponzi
    // 27x - prediction

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

    await queryRunner.query(
      `SELECT setval('${ns}.contract_id_seq', ${process.env.NODE_ENV === NodeEnv.production ? 50 : 50000}, true);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.contract`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_status_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_module_enum;`);
    await queryRunner.query(`DROP TYPE ${ns}.contract_features_enum;`);
  }
}
