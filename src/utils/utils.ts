import { psetToUnsignedTx, address, confidential, UnblindedOutput, isConfidentialOutput } from "ldk";

export function inputBlindingDataMap(pset: string, utxos: UnblindedOutput[]): Map<number, confidential.UnblindOutputResult> {
  const inputBlindingData = new Map<number, confidential.UnblindOutputResult>();
  const txidToBuffer = function (txid: string) {
    return Buffer.from(txid, "hex").reverse();
  };

  let index = -1;
  for (const input of psetToUnsignedTx(pset).ins) {
    index++;
    const utxo = utxos.find((u) => txidToBuffer(u.txid).equals(input.hash) && u.vout === input.index);

    // only add unblind data if the prevout of the input is confidential
    if (utxo && utxo.unblindData && isConfidentialOutput(utxo.prevout)) {
      inputBlindingData.set(index, utxo.unblindData);
    }
  }

  return inputBlindingData;
}

export function outPubKeysMap(pset: string, outputAddresses: string[]): Map<number, Buffer> {
  const outPubkeys: Map<number, Buffer> = new Map();

  for (const outAddress of outputAddresses) {
    const index = outputIndexFromAddress(pset, outAddress);
    if (index === -1) continue;
    if (isConfidentialAddress(outAddress)) {
      outPubkeys.set(index, blindingKeyFromAddress(outAddress));
    }
  }

  return outPubkeys;
}

function outputIndexFromAddress(tx: string, addressToFind: string): number {
  const utx = psetToUnsignedTx(tx);
  const recipientScript = address.toOutputScript(addressToFind);
  return utx.outs.findIndex((out) => out.script.equals(recipientScript));
}

const isConfidentialAddress = (addr: string): boolean => {
  try {
    address.fromConfidential(addr);
    return true;
  } catch (ignore) {
    return false;
  }
};

const blindingKeyFromAddress = (addr: string): Buffer => {
  return address.fromConfidential(addr).blindingKey;
};
