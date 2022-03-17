const tools = require('../tools/tools')

task("donate", "Send donate to the fund")
    .addParam("contract", "Contract address")
    .addParam("amount", "Donation amount")
    .setAction(async (taskArgs) => {
        const [signer] = await ethers.getSigners()
        const tx = await tools.sendMoney(signer, taskArgs.contract, BigInt(taskArgs.amount))
        console.log(tx)
    })

module.exports = {}