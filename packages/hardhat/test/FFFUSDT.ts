import { FFFUSDT } from "../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("tokenContract", function () {
  // We define a fixture to reuse the same setup in every test.

  let tokenContract: FFFUSDT;
  before(async () => {
    // const [owner, burnedWallet] = await ethers.getSigners();
    const tokenContractFactory = await ethers.getContractFactory("FFFUSDT");
    tokenContract = (await tokenContractFactory.deploy()) as FFFUSDT;
    await tokenContract.waitForDeployment();
  });

  describe("Total Supply", function () {
    it("This is the total supply on deploy", async function () {
      const totalSupply = await tokenContract.totalSupply();
      expect(totalSupply).to.equal(BigInt("100000000000"));
    });

    it("To mint x quantity of tokens", async function () {
      const [owner] = await ethers.getSigners();
      const mintAmount = BigInt("10000000000000000"); // 16 decimals
      await tokenContract.mint(owner.address, mintAmount);
      console.log(owner.address);
      console.log(await tokenContract.getAddress());

      const ownerBalance = await tokenContract.balanceOf(owner.address);
      console.log(ownerBalance);
      expect(ownerBalance).to.equal(mintAmount);
    });
  });
});
