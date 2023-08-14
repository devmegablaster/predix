import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { Idl, Program, web3, BN, AnchorProvider } from "@project-serum/anchor";
import ProgramIDL from "../../contracts/programIDL.json";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getAccountAddresses } from "../../utils/fundsFunctions.js";

const IncrementButton = ({ value, amount, setAmount }) => {
  return (
    <button
      onClick={() => {
        setAmount(amount + value);
      }}
      className="w-full py-2 bg-[#1D1D1D] text-white rounded-lg"
    >
      +${value}
    </button>
  );
};

export default function Deposit() {
  const [amount, setAmount] = useState(0);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [userBalance, setUserBalance] = useState(null);
  const { publicKey, sendTransaction } = useWallet();
  const ProgramID = new PublicKey(ProgramIDL.metadata.address);
  const [provider, setProvider] = useState(
    new AnchorProvider(connection, wallet, {})
  );
  const buttonValues = [100, 250, 450, 900];
  useEffect(() => {
    if (wallet) {
      const _provider = new AnchorProvider(connection, wallet, {});
      const program = new Program(ProgramIDL, ProgramID, _provider);
      setProvider(_provider);

      fetchUserBalance(program);
    }
  }, [wallet]);
  const lamportsToAmount = (sol) => {
    const LAMPORTS_PER_SOL = new BN(1000000000);
    return new BN(sol).div(LAMPORTS_PER_SOL);
  };
  const fetchUserBalance = async (program) => {
    try {
      const [userWalletAddress, userWalletBump] =
        PublicKey.findProgramAddressSync(
          [Buffer.from("user-wallet"), publicKey.toBuffer()],
          ProgramID
        );
      console.log(program, userWalletAddress);
      const walletExists = await checkUserWalletExists(
        program,
        userWalletAddress
      );

      if (walletExists) {
        const walletData = await program.account.userWallet.fetch(
          userWalletAddress
        );
        setUserBalance(lamportsToAmount(walletData.balance).toString());
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };
  const checkUserWalletExists = async (program, userWalletAddress) => {
    try {
      const walletData = await program.account.userWallet.fetch(
        userWalletAddress
      );
      console.log(walletData, "user");

      if (walletData.balance) {
        console.log(walletData.balance.toString());
        return true;
      }
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("Account does not exist")) return false;
      else return true;
    }
  };

  const tryDeposit = async () => {
    const program = new Program(ProgramIDL, ProgramID, provider);
    const {
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
    } = getAccountAddresses(publicKey, ProgramID);
    const token_ata = await getAssociatedTokenAddress(
      usdcPublicKey,
      publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    const amountToLamports = (sol) => {
      const LAMPORTS_PER_SOL = new BN(1000000000);
      return new BN(sol).mul(LAMPORTS_PER_SOL);
    };
    let walletExists = await checkUserWalletExists(program, userWalletAddress);
    let depositAmount = amountToLamports(amount);
    try {
      if (walletExists) {
        const dm = await program.methods
          .tokenDeposit(userVaultBump, depositAmount)
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            tokenAta: token_ata,
            userWallet: userWalletAddress,
            userVault: userVaultAddress,
            tokenMint: usdcPublicKey,
          })
          .instruction();
        const tx_add = new Transaction().add(dm);
        const tx_final_add = await provider.sendAndConfirm(tx_add);
      } else {
        const id = await program.methods
          .initializeTokenDeposit(wallet.publicKey)
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            userWallet: userWalletAddress,
            userVault: userVaultAddress,
            tokenMint: usdcPublicKey,
          })
          .instruction();

        const dm = await program.methods
          .tokenDeposit(userVaultBump, depositAmount)
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            tokenAta: token_ata,
            userWallet: userWalletAddress,
            userVault: userVaultAddress,
            tokenMint: usdcPublicKey,
          })
          .instruction();
        const tx_add = new Transaction().add(id).add(dm);
        const tx_final_add = await provider.sendAndConfirm(tx_add);
      }
    } catch (err) {
      console.log(err);
    }
    fetchUserBalance(provider);
  };

  return (
    <div className="flex flex-col space-y-3 w-full h-full">
      <div className="w-full h-full flex flex-col space-y-3 p-2 border-[#333333] rounded-lg border">
        <input
          type="text"
          className="w-full py-20 bg-[#1D1D1D] text-[#646464] text-3xl font-bold text-center outline-none rounded-lg"
          placeholder="Enter an Amount"
          value={amount}
          onChange={(e) => {
            const newValue =
              e.target.value.trim() === "" ? "" : parseFloat(e.target.value);
            setAmount(newValue);
          }}
        />
        <div className="grid grid-cols-4 gap-3">
          {buttonValues.map((value) => {
            return (
              <IncrementButton
                value={value}
                amount={amount}
                setAmount={setAmount}
              />
            );
          })}
        </div>
        <div className="w-full h-1 bg-[#646464] rounded-xl" />
        <div className="flex justify-between items-center bg-[#1D1D1D] px-3 py-3 rounded-lg">
          <div className="flex space-x-2 items-start">
            <img src="/crypto.png" />
            <div className="flex flex-col justify-between">
              <h2 className="font-semibold text-white">USDC</h2>
              <p className="text-sm text-[#646464]">Solana Devnet</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <p className="text-[#8C8C8C]">{userBalance} USDC</p>
          </div>
        </div>
      </div>
      <button
        onClick={tryDeposit}
        className="w-full py-3 bg-[#D4D5F9] text-black rounded-lg font-semibold"
      >
        Deposit
      </button>
    </div>
  );
}
