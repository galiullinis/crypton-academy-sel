const FundArtifact = require('../artifacts/contracts/Fund.sol/Fund.json')

task("withdraw", "Withdraw fund")
    .addParam("contract", "Contract address")
    .addParam("address", "Reciever's address")
    .addParam("amount", "Withdraw amount")
    .setAction(async (taskArgs) => {
        const contractAddr = taskArgs.contract
        const withdrawAddr = taskArgs.address
        const amount = BigInt(taskArgs.amount)
        const [signer] = await ethers.getSigners()

        const fund = new ethers.Contract(
            contractAddr,
            FundArtifact.abi,
            signer
        )
        
        const tx = await fund.withdraw(withdrawAddr, amount)
        console.log(tx)
    })

module.exports = {}