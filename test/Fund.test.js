const { expect } = require("chai");
const { ethers } = require("hardhat");
const tools = require("../tools/tools") 

describe("Fund", function () {
    let owner;
    let account2;
    let account3;
    let fund;

    beforeEach(async function () {
        [owner, account2, account3] = await ethers.getSigners();
        const Fund = await ethers.getContractFactory("Fund", owner);
        fund = await Fund.deploy();
        await fund.deployed();
    })
    
    it("should be payable", async function () {
        const amount = 1000;
        const tx = await tools.sendMoney(owner, fund.address, amount)
        await expect(() => tx).to.changeEtherBalances([owner, fund], [-amount, amount]);
    });

    it('should not be possible send 0', async function () {
        const amount = 0;
        const zeroSendRevertedMessage = "Donation can not be 0!"
        await expect(tools.sendMoney(owner, fund.address, amount)).to.be.revertedWith(zeroSendRevertedMessage);
    });

    it('should allow owner to withdraw', async function () {
        const amount = 1000;
        const withdrawAmount = 1000;
        await tools.sendMoney(owner, fund.address, amount)
        const tx = await fund.withdraw(account2.address, withdrawAmount)
        await expect(() => tx).to.changeEtherBalances([fund, account2], [-withdrawAmount, withdrawAmount])
    });

    it('should not allow not owner accounts to withdraw', async function () {
        const amount = 1000;
        const withdrawAmount = 1000;
        const notOwnerRevertedMessage = "You are not an owner!"
        await tools.sendMoney(owner, fund.address, amount)
        await expect(fund.connect(account2).withdraw(account2.address, withdrawAmount)).to.be.revertedWith(notOwnerRevertedMessage)
    });

    it('should not allow withdraw 0', async function () {
        const amount = 1000;
        const withdrawAmount = 0;
        const zeroWithdrawRevertedMessage = "Incorrect amount"
        await tools.sendMoney(owner, fund.address, amount)
        await expect(fund.withdraw(account2.address, withdrawAmount)).to.be.revertedWith(zeroWithdrawRevertedMessage)
    });

    it('should get unique donators', async function () {
        const amount = 1000;
        await tools.sendMoney(owner, fund.address, amount)
        await tools.sendMoney(account2, fund.address, amount)
        await tools.sendMoney(account3, fund.address, amount)
        await tools.sendMoney(account3, fund.address, amount)
        await tools.sendMoney(account2, fund.address, amount)
        const donators = await fund.getDonators()

        expect(donators).deep.to.equal([owner.address, account2.address, account3.address])
    });

    it('should get amount donator\'s payments', async function () {
        const firstAmount = 1000;
        const secondAmount = 1500;
        const thirdAmount = 2000;
        await tools.sendMoney(account3, fund.address, firstAmount)
        await tools.sendMoney(account3, fund.address, secondAmount)
        await tools.sendMoney(account3, fund.address, thirdAmount)
        
        const addrDonations = await fund.getDonationAmountByAddr(account3.address)
        expect(addrDonations).to.eq(firstAmount+secondAmount+thirdAmount)
    });
});
