import { MigrationInterface, QueryRunner } from "typeorm";
import { constants } from "ethers";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721ClaimAt1563804040330 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_RANDOM_ADDR || wallet;
    const currentDateTime = new Date().toISOString();

    await queryRunner.query(`
      INSERT INTO ${ns}.event_history (
        id,
        address,
        transaction_hash,
        event_type,
        event_data,
        parent_id,
        created_at,
        updated_at
      ) VALUES (
        1302010,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130201",
          items: [[2, erc721ContractSimpleAddress, "130101", "1"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302011,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010101",
        })}',
        1302010,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302020,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130202",
          items: [[2, erc721ContractSimpleAddress, "130101", "2"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302021,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010102",
        })}',
        1302020,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302030,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130203",
          items: [[2, erc721ContractSimpleAddress, "130101", "3"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302031,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010103",
        })}',
        1302030,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302040,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130204",
          items: [[2, erc721ContractSimpleAddress, "130101", "4"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302041,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010104",
        })}',
        1302040,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302050,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130205",
          items: [
            [2, erc721ContractSimpleAddress, "130101", "5"],
            [2, erc721ContractSimpleAddress, "130101", "1"],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302051,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010105",
        })}',
        1302050,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302052,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010101",
        })}',
        1302050,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302060,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130206",
          items: [
            [2, erc721ContractSimpleAddress, "130101", "6"],
            [2, erc721ContractSimpleAddress, "130101", "1"],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302061,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010106",
        })}',
        1302060,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302062,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[0],
          tokenId: "13010101",
        })}',
        1302060,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302070,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130207",
          items: [[2, erc721ContractSimpleAddress, "130101", "7"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302071,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[1],
          tokenId: "13010107",
        })}',
        1302070,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302080,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130208",
          items: [
            [2, erc721ContractSimpleAddress, "130101", "8"],
            [2, erc721ContractSimpleAddress, "130101", "1"],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302081,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[1],
          tokenId: "13010108",
        })}',
        1302080,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302082,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[1],
          tokenId: "13010101",
        })}',
        1302080,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302090,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130209",
          items: [[2, erc721ContractSimpleAddress, "130101", "9"]],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302091,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[2],
          tokenId: "13010109",
        })}',
        1302090,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302100,
        '${exchangeAddress}',
        '${constants.HashZero}',
        'Claim',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130210",
          items: [
            [2, erc721ContractSimpleAddress, "130101", "10"],
            [2, erc721ContractSimpleAddress, "130101", "1"],
          ],
        })}',
        null,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302101,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[2],
          tokenId: "13010110",
        })}',
        1302100,
        '${currentDateTime}',
        '${currentDateTime}'
      ), (
        1302102,
        '${erc721ContractSimpleAddress}',
        '${constants.HashZero}',
        'Transfer',
        '${JSON.stringify({
          from: constants.AddressZero,
          to: wallets[2],
          tokenId: "13010101",
        })}',
        1302100,
        '${currentDateTime}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
