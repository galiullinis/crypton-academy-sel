const FundArtifact = require('../artifacts/contracts/Fund.sol/Fund.json')

task("donators", "Get all donators list")
    .addParam("contract", "Contract address")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        const [signer] = await ethers.getSigners()

        const fund = new ethers.Contract(
            contractAddr,
            FundArtifact.abi,
            signer
        )
        
        const donators = await fund.getDonators()
        console.log(donators)
})

module.exports = {}