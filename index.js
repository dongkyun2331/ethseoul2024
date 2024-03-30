const ic = require("ic0");

async function main() {
  const ledger = ic("ryjl3-tyaaa-aaaaa-aaaba-cai"); // Principal for the IC ledger
  const accountIdentifier =
    "0b24fcf73d2ec2e6b2c151b3700c8c0e303855208d21896dd69fd8ddf1d701d8";
  const accountIdentifierBytes = Buffer.from(accountIdentifier, "hex");

  console.log(
    await ledger.call("account_balance", {
      account: accountIdentifierBytes,
    })
  );
}
main();
