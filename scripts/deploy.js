const hre = require('hardhat')
const ethers = hre.ethers

async function main() {
    const [signer] = await ethers.getSigners()
    const Fund = await ethers.getContractFactory('Fund', signer)
    const fund = await Fund.deploy()
    await fund.deployed()
    console.log(fund.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });