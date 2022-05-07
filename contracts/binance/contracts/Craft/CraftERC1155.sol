// SPDX-License-Identifier: UNLICENSED

// Author: TrejGun
// Email: trejgun+gemunion@gmail.com
// Website: https://gemunion.io/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../Marketplace/interfaces/IEIP712ERC1155.sol";

contract CraftERC1155 is AccessControl, Pausable {
  using Address for address;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

  struct Recipe {
    uint256[] ids;
    uint256[] amounts;
    uint256 tokenId;
    bool active;
  }

  event RecipeCreated(uint256 recipeId, uint256[] ids, uint256[] amounts, uint256 tokenId);

  event RecipeUpdated(uint256 recipeId, bool active);

  event RecipeCrafted(address from, uint256 recipeId, uint256 amount);

  IEIP712ERC1155 private _resources;

  mapping(uint256 => Recipe) private _recipes;

  constructor() {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _setupRole(PAUSER_ROLE, _msgSender());
  }

  function setFactory(address resources) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(resources.isContract(), "CraftERC1155: the factory must be a deployed contract");
    _resources = IEIP712ERC1155(resources);
  }

  function createRecipe(
    uint256 recipeId,
    uint256[] memory ids,
    uint256[] memory amounts,
    uint256 tokenId
  ) public onlyRole(DEFAULT_ADMIN_ROLE) {
    require(ids.length == amounts.length, "CraftERC1155: ids and amounts length mismatch");
    require(tokenId != 0, "CraftERC1155: reserved token id");
    Recipe memory recipe = _recipes[recipeId];
    require(recipe.tokenId == 0, "CraftERC1155: recipe already exist");

    _recipes[recipeId] = Recipe(ids, amounts, tokenId, true);
    emit RecipeCreated(recipeId, ids, amounts, tokenId);
  }

  function updateRecipe(uint256 recipeId, bool active) public onlyRole(DEFAULT_ADMIN_ROLE) {
    Recipe memory recipe = _recipes[recipeId];
    require(recipe.tokenId != 0, "CraftERC1155: recipe does not exist");
    _recipes[recipeId].active = active;
    emit RecipeUpdated(recipeId, active);
  }

  function craft(uint256 recipeId, uint256 amount) public {
    Recipe memory recipe = _recipes[recipeId];

    require(recipe.active, "CraftERC1155: recipe is not active");

    uint256[] memory amounts = new uint256[](recipe.amounts.length);

    for (uint256 i = 0; i < recipe.amounts.length; i++) {
      amounts[i] = recipe.amounts[i] * amount;
    }

    emit RecipeCrafted(_msgSender(), recipeId, amount);

    _resources.burnBatch(_msgSender(), recipe.ids, amounts);
    _resources.mint(_msgSender(), recipe.tokenId, amount, "0x");
  }

  function pause() public virtual onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public virtual onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  receive() external payable {
    revert();
  }
}
