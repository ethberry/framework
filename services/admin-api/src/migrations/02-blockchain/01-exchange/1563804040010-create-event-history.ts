import { MigrationInterface, QueryRunner, Table } from "typeorm";

import { ns, testChainId } from "@framework/constants";

export class CreateEventHistory1563804040010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TYPE ${ns}.event_history_event_enum AS ENUM (
        -- MODULE:CONTRACT-MANAGER
        'CollectionDeployed',
        'VestingDeployed',
        'MysteryboxDeployed',
        'StakingDeployed',
        'PyramidDeployed',
        'ERC20TokenDeployed',
        'ERC721TokenDeployed',
        'ERC998TokenDeployed',
        'ERC1155TokenDeployed',

        -- MODULE:ERC20
        'Snapshot',

        -- MODULE:ERC1363
        'TransferReceived',

        -- MODULE:ERC4907 RENT
        'UpdateUser',
        'Lend',

        -- MODULE:ERC721
        'Approval',
        'ApprovalForAll',
        'DefaultRoyaltyInfo',
        'MintRandom',
        'TokenRoyaltyInfo',
        'Transfer',
        'ConsecutiveTransfer',

        -- MODULE:ERC998
        'BatchReceivedChild',
        'BatchTransferChild',
        'WhitelistedChild',
        'UnWhitelistedChild',
        'ReceivedChild',
        'TransferChild',
        'SetMaxChild',

        -- MODULE:ERC1155
        'TransferBatch',
        'TransferSingle',
        'URI',

        -- MODULE:CLAIM
        'RedeemClaim',
        'UnpackClaim',

        -- MODULE:WRAPPER
        'UnpackWrapper',

        -- MODULE MYSTERY
        'UnpackMysterybox',

        -- MODULE:PAUSE
        'Paused',
        'Unpaused',

        -- MODULE:VESTING
        'EtherReleased',
        'ERC20Released',
        'EtherReceived',

        -- MODULE:ACCESS_LIST
        'Blacklisted',
        'UnBlacklisted',
        'Whitelisted',
        'UnWhitelisted',

        -- MODULE:ACCESS_CONTROL
        'RoleGranted',
        'RoleRevoked',
        'RoleAdminChanged',
        'OwnershipTransferred',

        -- MODULE:STAKING
        'RuleCreated',
        'RuleUpdated',
        'StakingStart',
        'StakingWithdraw',
        'StakingFinish',
        'WithdrawBalance',
        'ReturnDeposit',

        -- MODULE:EXCHANGE
        -- MODULE:CORE
        'Purchase',
        -- MODULE:CLAIM
        'Claim',
        -- MODULE:CRAFT
        'Craft',
        -- MODULE:MYSTERY
        'Mysterybox',
        -- MODULE:GRADE
        'Upgrade',
        -- MODULE:WAITLIST
        'RewardSet',
        'ClaimReward',
        -- MODULE:BREEDING
        'Breed',
         -- MODULE:GRADE
        'LevelUp',
        'MetadataUpdate',
        
        -- MODULE:LOTTERY
        -- MODULE:RAFFLE
        'RoundFinalized',
        'RoundStarted',
        'RoundEnded',
        'Released',
        'Prize',
        'PurchaseLottery',
        'PurchaseRaffle',

        -- MODULE:PAYMENT_SPLITTER
        'PayeeAdded',
        'PaymentReleased',
        'ERC20PaymentReleased',
        'PaymentReceived',
        'PaymentEthReceived',
        'PaymentEthSent',

        -- MODULE:CHAINLINK
        'RandomnessRequest',
        'RandomnessRequestId',

        -- MODULE:CHAINLINKV2
        'RandomWordsRequested',
        'RandomWordsFulfilled'
      );
    `);

    const table = new Table({
      name: `${ns}.event_history`,
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
          default: testChainId,
        },
        {
          name: "transaction_hash",
          type: "varchar",
        },
        {
          name: "event_type",
          type: `${ns}.event_history_event_enum`,
        },
        {
          name: "event_data",
          type: "json",
        },
        {
          name: "token_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "contract_id",
          type: "int",
          isNullable: true,
        },
        {
          name: "parent_id",
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
          columnNames: ["token_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.token`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["contract_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.contract`,
          onDelete: "CASCADE",
        },
        {
          columnNames: ["parent_id"],
          referencedColumnNames: ["id"],
          referencedTableName: `${ns}.event_history`,
          onDelete: "SET NULL",
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(`${ns}.event_history`);
    await queryRunner.query(`DROP TYPE ${ns}.event_history_event_enum;`);
  }
}
