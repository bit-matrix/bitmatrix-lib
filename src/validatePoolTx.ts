import Decimal from "decimal.js";
import { CALL_METHOD, Pool } from "@bitmatrix/models";
import { div } from "./utils/helper";

export const validatePoolTx = (value: number, slippageTolerance: number, poolData: Pool, methodCall: CALL_METHOD): { amount: number; amountWithSlipapge: number } => {
  // 1-Havuzun güncel pair_1 liquidity miktarına pool_pair_1_liquidity ismini ver.
  const pool_pair_1_liquidity = Number(poolData.quote.value);

  // 2-Havuzun güncel pair_2 liquidity miktarına pool_pair_2_liquidity ismini ver.
  const pool_pair_2_liquidity = Number(poolData.token.value);

  const pair_1_pool_supply = Number(poolData.quote.value);

  const pair_2_pool_supply = Number(poolData.token.value);

  const pair_1_coefficient = poolData.pair1_coefficient.number;

  let pair_2_coefficient;

  if (pair_2_pool_supply >= pair_1_pool_supply) {
    pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
  } else {
    pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
  }

  if (pair_2_coefficient < 1) {
    pair_2_coefficient = 1;
  }

  //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
  const pool_pair_1_liquidity_downgraded = Math.floor(pool_pair_1_liquidity / pair_1_coefficient);

  // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver
  const pool_pair_2_liquidity_downgraded = Math.floor(pool_pair_2_liquidity / pair_2_coefficient);

  // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
  const pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);

  if (methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
    //   4-Commitment output 2 miktarına user_supply_total ismini ver.
    const user_supply_total = new Decimal(value).toNumber();

    //5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
    const user_supply_lp_fees = Math.floor(user_supply_total / 500);

    //   6-user_supply_total’ dan user_supply_lp_fees’ı çıkar ve sonuca user_supply_available ismini ver.
    const user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);

    //   7-pool_pair_1_liquidity ile user_supply_available’i topla ve sonuca constant_coefficient ismini ver.
    const constant_coefficient = Math.floor(pool_pair_1_liquidity + user_supply_available);

    //   8-constant_coefficient’ı pair_1_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.

    const constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_1_coefficient);

    // 12-pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_2_pool_liquidity_apx_1 ismini ver.
    const new_pair_2_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);

    // 13-new_pair_2_pool_liquidity_apx_1 değerini pair_2_coefficient ile çarp ve sonuca new_pair_2_pool_liquidity_apx_2 ismini ver.
    const new_pair_2_pool_liquidity_apx_2 = Math.floor(new_pair_2_pool_liquidity_apx_1 * pair_2_coefficient);

    // 14-pool_pair_2_liquidity değerinden new_pair_2_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_2_apx ismini ver.
    const user_received_pair_2_apx = Math.floor(pool_pair_2_liquidity - new_pair_2_pool_liquidity_apx_2);

    // 15-pair_2_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
    const payout_additional_fees = Math.floor(pair_2_coefficient * 2);

    // 16-user_received_pair_2_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_2 ismini ver.
    const user_received_pair_2 = Math.floor(user_received_pair_2_apx - payout_additional_fees);

    const slippageAmount = div(user_received_pair_2, slippageTolerance);

    const receivedAmount = user_received_pair_2 - slippageAmount;

    return { amount: user_received_pair_2, amountWithSlipapge: receivedAmount };
  } else if (methodCall === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
    // 4- Commitment output 2 miktarına user_supply_total ismini ver.
    const user_supply_total = new Decimal(value).toNumber();

    // 5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
    const user_supply_lp_fees = Math.floor(user_supply_total / 500);

    // 6- user_supply_total ’dan user_supply_lp_fees ’ı çıkar ve sonuca user_supply_available ismini ver.
    const user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);

    // 7-pool_pair_2_liquidity ile user_supply_available ’i topla ve sonuca constant_coefficient ismini ver.
    const constant_coefficient = Math.floor(pool_pair_2_liquidity + user_supply_available);

    // 8- constant_coefficient ’ı pair_2_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.
    const constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_2_coefficient);

    // 12- pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_1_pool_liquidity_apx_1 ismini ver

    const new_pair_1_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);

    // 13- new_pair_1_pool_liquidity_apx_1 değerini pair_1_coefficient ile çarp ve sonuca new_pair_1_pool_liquidity_apx_2 ismini ver.
    const new_pair_1_pool_liquidity_apx_2 = Math.floor(new_pair_1_pool_liquidity_apx_1 * pair_1_coefficient);

    // 14- pool_pair_1_liquidity değerinden new_pair_1_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_1_apx ismini ver.
    const user_received_pair_1_apx = Math.floor(pool_pair_1_liquidity - new_pair_1_pool_liquidity_apx_2);

    // 15- pair_1_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
    const payout_additional_fees = Math.floor(pair_1_coefficient * 2);

    // 16- user_received_pair_1_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_1 ismini ver.
    const user_received_pair_1 = Math.floor(user_received_pair_1_apx - payout_additional_fees);

    const slippageAmount = div(user_received_pair_1, slippageTolerance);

    const receivedAmount = user_received_pair_1 - slippageAmount;

    return { amount: user_received_pair_1, amountWithSlipapge: receivedAmount };
  }

  return { amount: 0, amountWithSlipapge: 0 };
};

// export const validatePoolTx2 = (value: number, slippageTolerance: number, poolData: Pool, methodCall: CALL_METHOD): { amount: number; amountWithSlipapge: number } => {
//   // 1-Havuzun güncel pair_1 liquidity miktarına pool_pair_1_liquidity ismini ver.
//   const pool_pair_1_liquidity = Number(poolData.quote.value);

//   // 2-Havuzun güncel pair_2 liquidity miktarına pool_pair_2_liquidity ismini ver.
//   const pool_pair_2_liquidity = Number(poolData.token.value);

//   const pair_1_pool_supply = Number(poolData.quote.value);

//   const pair_2_pool_supply = Number(poolData.token.value);

//   const pair_1_coefficient = poolData.pair1_coefficient.number;

//   let pair_2_coefficient;

//   if (pair_2_pool_supply >= pair_1_pool_supply) {
//     pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
//   } else {
//     pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
//   }

//   if (pair_2_coefficient < 1) {
//     pair_2_coefficient = 1;
//   }

//   //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
//   const pool_pair_1_liquidity_downgraded = Math.floor(pool_pair_1_liquidity / pair_1_coefficient);

//   // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver
//   const pool_pair_2_liquidity_downgraded = Math.floor(pool_pair_2_liquidity / pair_2_coefficient);

//   // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
//   const pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);

//   if (methodCall === CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
//     //   4-Commitment output 2 miktarına user_supply_total ismini ver.
//     const user_supply_total = new Decimal(value).toNumber();

//     //5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
//     const user_supply_lp_fees = Math.floor(user_supply_total / 500);

//     //   6-user_supply_total’ dan user_supply_lp_fees’ı çıkar ve sonuca user_supply_available ismini ver.
//     const user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);

//     //   7-pool_pair_1_liquidity ile user_supply_available’i topla ve sonuca constant_coefficient ismini ver.
//     const constant_coefficient = Math.floor(pool_pair_1_liquidity + user_supply_available);

//     //   8-constant_coefficient’ı pair_1_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.

//     const constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_1_coefficient);

//     // 12-pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_2_pool_liquidity_apx_1 ismini ver.
//     const new_pair_2_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);

//     // 13-new_pair_2_pool_liquidity_apx_1 değerini pair_2_coefficient ile çarp ve sonuca new_pair_2_pool_liquidity_apx_2 ismini ver.
//     const new_pair_2_pool_liquidity_apx_2 = Math.floor(new_pair_2_pool_liquidity_apx_1 * pair_2_coefficient);

//     // 14-pool_pair_2_liquidity değerinden new_pair_2_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_2_apx ismini ver.
//     const user_received_pair_2_apx = Math.floor(pool_pair_2_liquidity - new_pair_2_pool_liquidity_apx_2);

//     // 15-pair_2_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
//     const payout_additional_fees = Math.floor(pair_2_coefficient * 2);

//     // 16-user_received_pair_2_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_2 ismini ver.
//     const user_received_pair_2 = Math.floor(user_received_pair_2_apx - payout_additional_fees);

//     // ------hesaplar ------
//     const user_received_pair_2_apx_w = payout_additional_fees + value;
//     console.log("1,", user_received_pair_2_apx_w);

//     const new_pair_2_pool_liquidity_apx_2_w = pool_pair_2_liquidity - user_received_pair_2_apx_w;
//     console.log("2", new_pair_2_pool_liquidity_apx_2_w);

//     const new_pair_2_pool_liquidity_apx_1_w = div(new_pair_2_pool_liquidity_apx_2_w, pair_2_coefficient);
//     console.log("3", new_pair_2_pool_liquidity_apx_1_w);

//     const constant_coefficient_downgraded_w = div(pool_constant, new_pair_2_pool_liquidity_apx_1_w);
//     console.log("4", constant_coefficient_downgraded_w);

//     const constant_coefficient_w = div(pair_1_coefficient, constant_coefficient_downgraded_w);
//     console.log("5,", constant_coefficient_w);

//     const user_supply_available_w = constant_coefficient_w - pool_pair_1_liquidity;

//     const user_supply_lp_fees_w = div(user_supply_available_w, 499) * 500;

//     console.log("user_supply_lp_fees_w", user_supply_lp_fees_w);

//     const slippageAmount = div(user_received_pair_2, slippageTolerance);

//     const receivedAmount = user_received_pair_2 - slippageAmount;

//     return { amount: user_received_pair_2, amountWithSlipapge: receivedAmount };
//   } else if (methodCall === CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
//     // 4- Commitment output 2 miktarına user_supply_total ismini ver.
//     const user_supply_total = new Decimal(value).toNumber();

//     // 5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
//     const user_supply_lp_fees = Math.floor(user_supply_total / 500);

//     // 6- user_supply_total ’dan user_supply_lp_fees ’ı çıkar ve sonuca user_supply_available ismini ver.
//     const user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);

//     // 7-pool_pair_2_liquidity ile user_supply_available ’i topla ve sonuca constant_coefficient ismini ver.
//     const constant_coefficient = Math.floor(pool_pair_2_liquidity + user_supply_available);

//     // 8- constant_coefficient ’ı pair_2_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.
//     const constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_2_coefficient);

//     // 12- pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_1_pool_liquidity_apx_1 ismini ver

//     const new_pair_1_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);

//     // 13- new_pair_1_pool_liquidity_apx_1 değerini pair_1_coefficient ile çarp ve sonuca new_pair_1_pool_liquidity_apx_2 ismini ver.
//     const new_pair_1_pool_liquidity_apx_2 = Math.floor(new_pair_1_pool_liquidity_apx_1 * pair_1_coefficient);

//     // 14- pool_pair_1_liquidity değerinden new_pair_1_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_1_apx ismini ver.
//     const user_received_pair_1_apx = Math.floor(pool_pair_1_liquidity - new_pair_1_pool_liquidity_apx_2);

//     // 15- pair_1_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
//     const payout_additional_fees = Math.floor(pair_1_coefficient * 2);

//     // 16- user_received_pair_1_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_1 ismini ver.
//     const user_received_pair_1 = Math.floor(user_received_pair_1_apx - payout_additional_fees);

//     const slippageAmount = div(user_received_pair_1, slippageTolerance);

//     const receivedAmount = user_received_pair_1 - slippageAmount;

//     return { amount: user_received_pair_1, amountWithSlipapge: receivedAmount };
//   }

//   return { amount: 0, amountWithSlipapge: 0 };
// };
