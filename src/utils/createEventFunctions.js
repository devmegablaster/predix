import { PublicKey } from "@solana/web3.js";

export const getAccountAddresses = (uuid, publicKey, ProgramID) => {
  const [eventAccount, eventBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("event"), Buffer.from(uuid)],
    ProgramID
  );

  const [userWalletAddress, userWalletBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-wallet"), publicKey.toBuffer()],
    ProgramID
  );
  const [userVaultAddress, userVaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-vault"), publicKey.toBuffer()],
    ProgramID
  );
  const [vaultAddress, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("usdc-vault"), Buffer.from(uuid)],
    ProgramID
  );
  const [userStateAddress, userStateBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_share"), Buffer.from(uuid), publicKey.toBuffer()],
    ProgramID
  );
  const usdcAddress = "2F3m7HkXbkGPfbUWY2r2cq4quuvkdfhVpN83svGssdhy";
  const usdcPublicKey = new PublicKey(usdcAddress);

  return {
    eventAccount,
    eventBump,
    vaultAddress,
    vaultBump,
    userStateAddress,
    userStateBump,
    usdcAddress,
    usdcPublicKey,
    userWalletAddress,
    userVaultAddress,
    userVaultBump,
  };
};
