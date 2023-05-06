import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, ZeroAddress, WeiPerEther } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc721PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc721ContractSimpleAddress = process.env.ERC721_RANDOM_ADDR || wallet;

    const now = new Date();
    const currentDateTime = now.toISOString();

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
        1301010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "1"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301011,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010101",
        })}',
        1301010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "2"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301021,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010102",
        })}',
        1301020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1301030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "3"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1301031,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010103",
        })}',
        1301030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1301032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1301040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "4"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1301041,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010104",
        })}',
        1301040,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1301042,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301040,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1301050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "5"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1301051,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010105",
        })}',
        1301050,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1301052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301050,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1301060,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "6"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301061,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "13010106",
        })}',
        1301060,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301062,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301060,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301070,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "7"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301071,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "13010107",
        })}',
        1301070,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301072,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301070,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301080,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[1],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "8"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301081,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[1],
          tokenId: "13010108",
        })}',
        1301080,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301082,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[1],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301080,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1301090,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "9"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1301091,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "13010109",
        })}',
        1301090,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1301092,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301090,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1301100,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[2],
          externalId: "130101",
          item: [2, erc721ContractSimpleAddress, "130101", "10"],
          price: [[1, erc20TokenSimpleAddress, "120101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1301101,
        '${erc721ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[2],
          tokenId: "13010110",
        })}',
        1301100,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1301102,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[2],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1301100,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
