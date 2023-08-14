import { PublicKey } from "@solana/web3.js";

export const getAccountAddresses = ( publicKey, ProgramID) => {


  const [userWalletAddress, userWalletBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-wallet"), publicKey.toBuffer()],
    ProgramID
  );
  const [userVaultAddress, userVaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-vault"), publicKey.toBuffer()],
    ProgramID
  );

  const usdcAddress = "2F3m7HkXbkGPfbUWY2r2cq4quuvkdfhVpN83svGssdhy";
  const usdcPublicKey = new PublicKey(usdcAddress);

  return {
    usdcAddress,
    usdcPublicKey,
    userWalletAddress,
    userVaultAddress,
    userVaultBump,
  };
};
