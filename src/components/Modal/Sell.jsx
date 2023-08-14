import { Slider } from "@mantine/core"
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
export default function Sell() {
  const [amount, setAmount] = useState(0);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [userBalance, setUserBalance] = useState(null);
  const { publicKey, sendTransaction } = useWallet();
  const ProgramID = new PublicKey(ProgramIDL.metadata.address);
  const [provider, setProvider] = useState(
    new AnchorProvider(connection, wallet, {})
  );
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

  const tryWithdraw = async () => {
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
    let withdrawAmount = amountToLamports(amount);
    try {
      if (walletExists) {
        const dm = await program.methods
          .tokenWithdraw(userVaultBump, withdrawAmount)
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
        console.log("Cannot withdraw");
      }
    } catch (err) {
      console.log(err);
    }
    fetchUserBalance(provider);
  };
  
  return (
    <div className="h-full w-full flex flex-col space-y-3">
      <div className="w-full h-full flex flex-col space-y-2 border border-[#333333] rounded-lg p-2">
        <div className="flex justify-between items-center bg-[#1D1D1D] px-3 py-3 rounded-lg">
          <div className="flex space-x-2 items-start">
            <img src="/crypto.png" />
            <div className="flex flex-col justify-between">
              <h2 className="font-semibold text-white">USDC</h2>
              <p className="text-sm text-[#646464]">Solana Devnet</p>
            </div>
          </div>
          <div className="flex items-end flex-col justify-between">
            <p className="text-sm text-[#8C8C8C]">Available</p>
            <p className="">{userBalance} USDC</p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          {/* <p className="text-sm font-bold text-[#646464]">Current Price</p>
          <p className="text-sm">1 stl = 23.454 USDC</p> */}
        </div>
        <div className="w-full h-1 bg-[#646464] rounded-xl" />
        <div className="py-20 w-full text-3xl bg-[#1D1D1D] rounded-lg font-semibold text-[#646464] text-center">
          {parseFloat((amount / 100) * 10).toPrecision(3)}
        </div>
        <Slider
          value={Number(userBalance)}
          onChange={(e) => {
            setAmount(e);
          }}
          className="w-[95%] pb-5 mx-auto"
          color="gray"
          marks={[
            { value: 0, label: "0" },
            { value: 25, label: "25%" },
            { value: 50, label: "50%" },
            { value: 75, label: "75%" },
            { value: 100, label: "100%" },
          ]}
        />
      </div>
      <button
        onClick={tryWithdraw}
        className="bg-[#D4D5F9] text-black font-semibold py-3 rounded-lg"
      >
        Withdraw
      </button>
    </div>
  );
}
