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
