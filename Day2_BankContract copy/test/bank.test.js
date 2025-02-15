const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SingleUserBank", function () {
  let bank, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("SingleUserBank");
    bank = await Bank.deploy();
    await bank.waitForDeployment();
  });

  it("should allow deposits", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
    expect(await ethers.provider.getBalance(bank.target)).to.equal(ethers.parseEther("1"));
  });

  it("should allow withdrawals", async function () {
    await bank.connect(addr1).deposit({ value: ethers.parseEther("1") });
    await bank.connect(addr1).withdrawal(ethers.parseEther("0.5"));

    expect(await ethers.provider.getBalance(bank.target)).to.equal(ethers.parseEther("0.5"));
  });

  it("should prevent withdrawing more than the balance", async function () {
    await expect(bank.connect(addr1).withdrawal(ethers.parseEther("1"))).to.be.revertedWith(
      "Insufficient balance"
    );
  });
});
