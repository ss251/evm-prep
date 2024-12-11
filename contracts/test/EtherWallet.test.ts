import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("EtherWallet", function () {
    async function deployWalletFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("EtherWallet");
        const wallet = await Wallet.deploy();

        return { wallet, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right owner", async function ()  {
            const { wallet, owner }  = await loadFixture(deployWalletFixture);
            expect(await wallet.owner()).to.equal(owner.address);
        });

        it("Should start with 0 balance",  async function () {
            const { wallet }  = await loadFixture(deployWalletFixture);
            expect(await wallet.getBalance()).to.equal(0);
        })
    });

    describe("Deposits", function () {
        it("Should accept deposits", async function () {
            const {wallet, otherAccount} = await loadFixture(deployWalletFixture);
            const depositAmount = ethers.parseEther("1");

            await otherAccount.sendTransaction({
                to: await wallet.getAddress(),
                value: depositAmount
            });

            expect(await wallet.getBalance()).to.equal(depositAmount);
        });
    });

    describe("Withdrawals", function () {
        it("Should allow owner to withdraw", async function () {
            const { wallet, owner } = await loadFixture(deployWalletFixture);
            const depositAmount = ethers.parseEther("1");

            await owner.sendTransaction({
                to: await wallet.getAddress(),
                value: depositAmount
            });

            const withdrawAmount = ethers.parseEther("0.5");
            await wallet.withdraw(withdrawAmount);

            expect(await wallet.getBalance()).to.equal(depositAmount - withdrawAmount);
        })

        it("Should prevent non-owner from withdrawing", async function () {
            const { wallet, otherAccount } = await loadFixture(deployWalletFixture);
            const depositAmount = ethers.parseEther("1");

            await otherAccount.sendTransaction({
                to: await wallet.getAddress(),
                value: depositAmount
            });

            await expect(
                wallet.connect(otherAccount).withdraw(depositAmount)
            ).to.be.revertedWith("caller is not owner");
        })
    })
});
