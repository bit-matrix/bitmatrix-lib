import { convertion } from "@script-wiz/lib-core";
import WizData, { hexLE } from "@script-wiz/wiz-data";

export const div = (input1: number, input2: number) => Math.floor(input1 / input2);

export const uniqueArray = <T>(data: T[]) => {
  return data.filter(function (item, pos) {
    return data.indexOf(item) == pos;
  });
};

export const calculateAmountTotal = (inputAmount: number, orderingFee: number, baseFee: number, serviceFee: number = 0) => {
  const totalAmount = inputAmount + orderingFee + baseFee + serviceFee;
  const totalAmount64 = convertion.numToLE64(WizData.fromNumber(totalAmount)).hex;
  const totalAmount64BE = hexLE(totalAmount64);
  return totalAmount64BE;
};

export const replaceChar = (text: string, index: number, replacement: string) => {
  if (index >= text.length) {
    return text.valueOf();
  }

  var chars = text.split("");
  chars[index] = replacement;
  return chars.join("");
};

export const lbtcAssest = "144c654344aa716d6f3abcc1ca90e5641e4e2a7f633bc09fe3baf64585819a49";
