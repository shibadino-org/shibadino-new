import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

import presaleIdl from "./presaleIdl.json";
import { presaleProgramId } from "./constants";
/* eslint-disable react/prop-types */
import { useMemo } from "react";

export const usePresaleProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const provider = new AnchorProvider(connection, wallet);
  return useMemo(() => {
    if (provider) {
      return new Program(presaleIdl, presaleProgramId, provider);
    } else {
      return null;
    }
  }, [provider]);
};

export const findAssociatedTokenAccountPublicKey = async (
  walletAddress,
  mint,
) => {
  return (
    await PublicKey.findProgramAddressSync(
      [
        walletAddress?.toBuffer(),
        TOKEN_PROGRAM_ID?.toBuffer(),
        mint?.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  )[0];
};

export const sendTransaction = async (
  connection,
  wallet,
  instructions,
  signers,
  awaitConfirmation = true,
) => {
  let transaction = new Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash("max")
  ).blockhash;
  transaction.setSigners(
    // fee payied by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey),
  );
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();
  let options = {
    skipPreflight: true,
    commitment: "singleGossip",
  };

  const txid = await connection.sendRawTransaction(rawTransaction, options);

  if (awaitConfirmation) {
    const status = (
      await connection.confirmTransaction(txid, options && options.commitment)
    ).value;

    if (status?.err) {
      // const errors = await getErrorForTransaction(connection, txid);
      console.log({
        message: "Transaction failed...",

        type: "error",
      });

      throw new Error(
        `Raw transaction ${txid} failed (${JSON.stringify(status)})`,
      );
    }
  }

  return txid;
};

export function toPlainString(num) {
  return ("" + +num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + "0." + Array(1 - e - c.length).join(0) + c + d
        : b + c + d + Array(e - d.length + 1).join(0);
    },
  );
}
