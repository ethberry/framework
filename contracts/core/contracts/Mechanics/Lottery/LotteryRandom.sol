// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun@gemunion.io
// Website: https://gemunion.io/

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@gemunion/contracts-mocks/contracts/Wallet.sol";
import "@gemunion/contracts-misc/contracts/constants.sol";

import "../../Exchange/ExchangeUtils.sol";
import "../../utils/constants.sol";
import "./interfaces/ILottery.sol";
import "./interfaces/IERC721LotteryTicket.sol";

abstract contract LotteryRandom is AccessControl, Pausable, Wallet {
  using Address for address;
  using SafeERC20 for IERC20;

  uint256 internal immutable _timeLag; // TODO change in production: release after 2592000 seconds = 30 days (dev: 2592)
  uint256 internal immutable comm; // commission 30%

  event RoundStarted(uint256 roundId, uint256 startTimestamp, uint256 maxTicket, Asset ticket, Asset price);
  event RoundEnded(uint256 round, uint256 endTimestamp);
  event RoundFinalized(uint256 round, uint8[6] winValues);
  event Released(uint256 round, uint256 amount);
  event Prize(address account, uint256 roundId, uint256 ticketId, uint256 amount);
  event PaymentEthReceived(address from, uint256 amount);

  // LOTTERY

  // TODO optimize struct
  struct Round {
    uint256 roundId;
    uint256 startTimestamp;
    uint256 endTimestamp;
    uint256 balance; // left after get prize
    uint256 total; // max money before
    uint256 maxTicket;
    // TODO Asset[]?
    Asset acceptedAsset;
    Asset ticketAsset;
    bytes32[] tickets; // all round tickets
    uint8[6] values; // prize numbers
    uint8[7] aggregation; // prize counts
    uint256 requestId;
  }

  Round[] internal _rounds;

  constructor(LotteryConfig memory config) {
    address account = _msgSender();
    _grantRole(DEFAULT_ADMIN_ROLE, account);
    _grantRole(PAUSER_ROLE, account);
    _grantRole(MINTER_ROLE, account);

    // SET Lottery Config
    _timeLag = config.timeLagBeforeRelease;
    comm = config.commission;

    Round memory rootRound;
    rootRound.startTimestamp = block.timestamp;
    // rootRound.endTimestamp = 0;
    rootRound.endTimestamp = block.timestamp;
    _rounds.push(rootRound);
  }

  // TICKET
  function printTicket(
    uint256 externalId,
    address account,
    bytes32 numbers
  ) external onlyRole(MINTER_ROLE) whenNotPaused returns (uint256 tokenId, uint256 roundId) {
    // get current round
    roundId = _rounds.length - 1;
    Round storage currentRound = _rounds[roundId];

    if (currentRound.endTimestamp != 0) {
      revert WrongRound();
    }

    if (currentRound.maxTicket > 0 && currentRound.tickets.length >= currentRound.maxTicket) {
      revert LimitExceed();
    }

    currentRound.tickets.push(numbers);

    currentRound.balance += currentRound.acceptedAsset.amount;
    currentRound.total += currentRound.acceptedAsset.amount;

    tokenId = IERC721LotteryTicket(currentRound.ticketAsset.token).mintTicket(account, roundId, externalId, numbers);
  }

  // ROUND
  function startRound(Asset memory ticket, Asset memory price, uint256 maxTicket) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Round memory prevRound = _rounds[_rounds.length - 1];
    // TODO custom error
    if (prevRound.endTimestamp == 0) {
      revert NotComplete();
    }

    Round memory nextRound;
    _rounds.push(nextRound);

    uint256 roundId = _rounds.length - 1;

    Round storage currentRound = _rounds[roundId];
    currentRound.roundId = roundId;
    currentRound.startTimestamp = block.timestamp;
    currentRound.maxTicket = maxTicket;
    currentRound.ticketAsset = ticket;
    currentRound.acceptedAsset = price;

    emit RoundStarted(roundId, block.timestamp, maxTicket, ticket, price);
  }

  function endRound() external onlyRole(DEFAULT_ADMIN_ROLE) {
    uint256 roundNumber = _rounds.length - 1;
    Round storage currentRound = _rounds[roundNumber];

    // TODO should never happen?
    if (currentRound.roundId != roundNumber) {
      revert WrongRound();
    }

    if (currentRound.endTimestamp != 0) {
      revert NotActive();
    }

    currentRound.endTimestamp = block.timestamp;
    currentRound.requestId = getRandomNumber();

    uint256 commission = (currentRound.total * comm) / 100;
    currentRound.total -= commission;

    emit RoundEnded(roundNumber, block.timestamp);
  }

  // GET INFO
  function getCurrentRoundInfo() public view returns (LotteryRoundInfo memory) {
    Round storage round = _rounds[_rounds.length - 1];
    return
      LotteryRoundInfo(
        round.roundId,
        round.startTimestamp,
        round.endTimestamp,
        round.maxTicket,
        round.balance,
        round.total,
        round.values,
        round.aggregation,
        round.acceptedAsset,
        round.ticketAsset
      );
  }

  function getLotteryInfo() public view returns (LotteryConfig memory) {
    return LotteryConfig(_timeLag, comm);
  }

  // RANDOM
  function fulfillRandomWords(uint256, uint256[] memory randomWords) internal virtual {
    Round storage currentRound = _rounds[_rounds.length - 1];

    // calculate wining numbers
    bool[36] memory tmp1;
    uint8 i = 0;
    while (i < 6) {
      uint256 number = randomWords[0] % 36;
      randomWords[0] = randomWords[0] / 37;
      if (!tmp1[number]) {
        currentRound.values[i] = uint8(number);
        tmp1[number] = true;
        i++;
        // TODO unchecked
      }
    }

    // aggregate data
    uint256 len = currentRound.tickets.length;
    for (uint8 l = 0; l < len; l++) {
      uint8 tmp2 = 0;
      for (uint8 j = 0; j < 6; j++) {
        // TODO fixme bitwise operations
        // if (currentRound.tickets[l][currentRound.values[j]]) {
        tmp2++;
        // }
      }
      currentRound.aggregation[tmp2]++;
    }

    emit RoundFinalized(currentRound.roundId, currentRound.values);
  }

  function getRandomNumber() internal virtual returns (uint256 requestId);

  // PRIZE
  function getPrize(uint256 tokenId, uint256 roundId) external {
    if (roundId > _rounds.length - 1) {
      revert WrongRound();
    }

    Round storage ticketRound = _rounds[roundId];

    if (ticketRound.endTimestamp == 0) {
      revert NotComplete();
    }

    if (block.timestamp > ticketRound.endTimestamp + _timeLag) {
      revert Expired();
    }

    IERC721LotteryTicket ticketFactory = IERC721LotteryTicket(ticketRound.ticketAsset.token);

    Ticket memory data = ticketFactory.getTicketData(tokenId);

    // revert if prize already set
    if (data.prize) {
      revert WrongToken();
    }

    // revert if token's roundId differs
    if (data.round != roundId) {
      revert WrongRound();
    }

    // ticketFactory.burn(tokenId);
    // set prize status
    ticketFactory.setTicketData(tokenId);

    uint8[] memory coefficient = new uint8[](7);
    coefficient[0] = 0;
    coefficient[1] = 15;
    coefficient[2] = 50;
    coefficient[3] = 70;
    coefficient[4] = 110;
    coefficient[5] = 140;
    coefficient[6] = 220;

    uint8[7] memory aggregation = ticketRound.aggregation;

    uint256 sumc;
    for (uint8 l = 0; l < 7; l++) {
      uint256 ag = aggregation[l];
      uint256 co = coefficient[l];
      sumc = sumc + (ag * co);
    }

    uint256 point = ticketRound.total / sumc;

    uint8 result = 0;

    for (uint8 j = 0; j < 6; j++) {
      for (uint8 k = 0; k < 6; k++) {
        if (uint8(data.numbers[31 - k]) == ticketRound.values[j]) {
          result++;
          break;
        }
      }
    }

    uint256 amount = point * coefficient[result];

    if (amount > ticketRound.total) {
      revert BalanceExceed();
    }

    ticketRound.balance -= amount;

    ticketRound.acceptedAsset.amount = amount;
    ExchangeUtils.spend(
      ExchangeUtils._toArray(ticketRound.acceptedAsset),
      _msgSender(),
      DisabledTokenTypes(false, false, false, false, false)
    );

    emit Prize(_msgSender(), roundId, tokenId, amount);
  }

  // RELEASE BALANCE
  function releaseFunds(uint256 roundNumber) external onlyRole(DEFAULT_ADMIN_ROLE) {
    if (roundNumber > _rounds.length - 1) {
      revert WrongRound();
    }

    Round storage currentRound = _rounds[roundNumber];

    if (block.timestamp < currentRound.endTimestamp + _timeLag) {
      revert NotComplete();
    }

    if (currentRound.balance == 0) {
      revert ZeroBalance();
    }

    uint256 roundBalance = currentRound.total;
    currentRound.balance = 0;

    currentRound.acceptedAsset.amount = roundBalance;
    ExchangeUtils.spend(
      ExchangeUtils._toArray(currentRound.acceptedAsset),
      _msgSender(),
      DisabledTokenTypes(false, false, false, false, false)
    );

    emit Released(roundNumber, roundBalance);
  }

  // PAUSABLE

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  // COMMON
  receive() external payable override {
    emit PaymentEthReceived(_msgSender(), msg.value);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, Wallet) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
