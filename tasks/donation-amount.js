const FundArtifact = require('../artifacts/contracts/Fund.sol/Fund.json')

task("donation-amount", "Get donator donation amount")
    .addParam("contract", "Contract address")
    .addParam("address", "Donator's address")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        const donatorAddr = taskArgs.address
        const [signer] = await ethers.getSigners()

        const fund = new ethers.Contract(
            contractAddr,
            FundArtifact.abi,
            signer
        )
        
        const donationAmountWei = await fund.getDonationAmountByAddr(donatorAddr)
        const donationAmountEth = ethers.utils.formatEther(donationAmountWei)
        console.log(`\nAccount address: ${donatorAddr},\nDonation amount: ${donationAmountWei} Wei (${donationAmountEth} ETH)\n`)
})

module.exports = {}