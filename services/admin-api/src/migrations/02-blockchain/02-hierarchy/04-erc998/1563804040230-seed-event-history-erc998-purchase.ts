import { MigrationInterface, QueryRunner } from "typeorm";
import { ZeroHash, WeiPerEther, ZeroAddress } from "ethers";
import { subDays } from "date-fns";

import { wallet, wallets } from "@gemunion/constants";
import { ns } from "@framework/constants";

export class SeedEventHistoryErc998PurchaseAt1563804040230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const exchangeAddress = process.env.EXCHANGE_ADDR || wallet;
    const erc20TokenSimpleAddress = process.env.ERC20_SIMPLE_ADDR || wallet;
    const erc998ContractSimpleAddress = process.env.ERC998_RANDOM_ADDR || wallet;

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
        1401010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040101",
          item: [2, erc998ContractSimpleAddress, "1040101", "1"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401011,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010101",
        })}',
        1401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401010,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040101",
          item: [2, erc998ContractSimpleAddress, "1040101", "2"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401021,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010201",
        })}',
        1401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401020,
        '${subDays(now, 9).toISOString()}',
        '${currentDateTime}'
      ), (
        1401030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040101",
          item: [2, erc998ContractSimpleAddress, "1040101", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401031,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104010301",
        })}',
        1401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1401032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1401030,
        '${subDays(now, 8).toISOString()}',
        '${currentDateTime}'
      ), (
        1404010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040401",
          item: [2, erc998ContractSimpleAddress, "1040401", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404011,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040101",
        })}',
        1404010,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1404010,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040402",
          item: [2, erc998ContractSimpleAddress, "1040402", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404021,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040201",
        })}',
        1404020,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1404020,
        '${subDays(now, 7).toISOString()}',
        '${currentDateTime}'
      ), (
        1404030,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040403",
          item: [2, erc998ContractSimpleAddress, "1040403", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404031,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040301",
        })}',
        1404030,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404032,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1404030,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404040,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040404",
          item: [2, erc998ContractSimpleAddress, "1040404", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404041,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040401",
        })}',
        1404040,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404042,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1404040,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404050,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040405",
          item: [2, erc998ContractSimpleAddress, "1040405", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404051,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104040501",
        })}',
        1404050,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1404052,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1404050,
        '${subDays(now, 5).toISOString()}',
        '${currentDateTime}'
      ), (
        1405010,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040501",
          item: [2, erc998ContractSimpleAddress, "1040501", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405011,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104050101",
        })}',
        1405010,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405012,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1405010,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405020,
        '${exchangeAddress}',
        '${ZeroHash}',
        'Purchase',
        '${JSON.stringify({
          from: wallets[0],
          externalId: "1040502",
          item: [2, erc998ContractSimpleAddress, "1040502", "3"],
          price: [[1, erc20TokenSimpleAddress, "1020101", WeiPerEther.toString()]],
        })}',
        null,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405021,
        '${erc998ContractSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: ZeroAddress,
          to: wallets[0],
          tokenId: "104050201",
        })}',
        1405020,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      ), (
        1405022,
        '${erc20TokenSimpleAddress}',
        '${ZeroHash}',
        'Transfer',
        '${JSON.stringify({
          from: wallets[0],
          to: exchangeAddress,
          value: WeiPerEther.toString(),
        })}',
        1405020,
        '${subDays(now, 4).toISOString()}',
        '${currentDateTime}'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE ${ns}.event_history RESTART IDENTITY CASCADE;`);
  }
}
