"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pairsCoefficientCalculation = exports.validatePoolTx = void 0;
var decimal_js_1 = __importDefault(require("decimal.js"));
var models_1 = require("@bitmatrix/models");
var helper_1 = require("./utils/helper");
var pool_1 = require("./pool");
var validatePoolTx = function (value, slippageTolerance, poolData, methodCall) {
    // 1-Havuzun güncel pair_1 liquidity miktarına pool_pair_1_liquidity ismini ver.
    var pool_pair_1_liquidity = Number(poolData.quote.value);
    // 2-Havuzun güncel pair_2 liquidity miktarına pool_pair_2_liquidity ismini ver.
    var pool_pair_2_liquidity = Number(poolData.token.value);
    var pair_1_pool_supply = Number(poolData.quote.value);
    var pair_2_pool_supply = Number(poolData.token.value);
    var pair_1_coefficient = poolData.pair1_coefficient.number;
    var pair_2_coefficient;
    if (pair_2_pool_supply >= pair_1_pool_supply) {
        pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
    }
    else {
        pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
    }
    if (pair_2_coefficient < 1) {
        pair_2_coefficient = 1;
    }
    //   9-pool_pair_1_liquidity değerini pair_1_coefficient’a böl ve sonuca pool_pair_1_liquidity_downgraded ismini ver
    var pool_pair_1_liquidity_downgraded = Math.floor(pool_pair_1_liquidity / pair_1_coefficient);
    // 10-pool_pair_2_liquidity değerini pair_2_coefficient’a böl ve sonuca pool_pair_2_liquidity_downgraded ismini ver
    var pool_pair_2_liquidity_downgraded = Math.floor(pool_pair_2_liquidity / pair_2_coefficient);
    // 11-pool_pair_1_liquidity_downgraded ile pool_pair_2_liquidity_downgraded ‘I çarp ve sonuca pool_constant ismini ver.
    var pool_constant = Math.floor(pool_pair_1_liquidity_downgraded * pool_pair_2_liquidity_downgraded);
    var lpFeeTier = Object.values(pool_1.lpFeeTiers)[poolData.lpFeeTierIndex.number];
    if (methodCall === models_1.CALL_METHOD.SWAP_QUOTE_FOR_TOKEN) {
        //   4-Commitment output 2 miktarına user_supply_total ismini ver.
        var user_supply_total = new decimal_js_1.default(value).toNumber();
        //5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
        var user_supply_lp_fees = Math.floor(user_supply_total / lpFeeTier);
        //   6-user_supply_total’ dan user_supply_lp_fees’ı çıkar ve sonuca user_supply_available ismini ver.
        var user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);
        //   7-pool_pair_1_liquidity ile user_supply_available’i topla ve sonuca constant_coefficient ismini ver.
        var constant_coefficient = Math.floor(pool_pair_1_liquidity + user_supply_available);
        //   8-constant_coefficient’ı pair_1_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.
        var constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_1_coefficient);
        // 12-pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_2_pool_liquidity_apx_1 ismini ver.
        var new_pair_2_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);
        // 13-new_pair_2_pool_liquidity_apx_1 değerini pair_2_coefficient ile çarp ve sonuca new_pair_2_pool_liquidity_apx_2 ismini ver.
        var new_pair_2_pool_liquidity_apx_2 = Math.floor(new_pair_2_pool_liquidity_apx_1 * pair_2_coefficient);
        // 14-pool_pair_2_liquidity değerinden new_pair_2_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_2_apx ismini ver.
        var user_received_pair_2_apx = Math.floor(pool_pair_2_liquidity - new_pair_2_pool_liquidity_apx_2);
        // 15-pair_2_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
        var payout_additional_fees = Math.floor(pair_2_coefficient * 2);
        // 16-user_received_pair_2_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_2 ismini ver.
        var user_received_pair_2 = Math.floor(user_received_pair_2_apx - payout_additional_fees);
        var slippageAmount = (0, helper_1.div)(user_received_pair_2, slippageTolerance);
        var receivedAmount = user_received_pair_2 - slippageAmount;
        console.log("1", Math.floor(9 * pair_2_coefficient));
        if (user_received_pair_2 < Math.floor(9 * pair_2_coefficient)) {
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: user_received_pair_2, amountWithSlipapge: receivedAmount };
    }
    else if (methodCall === models_1.CALL_METHOD.SWAP_TOKEN_FOR_QUOTE) {
        // 4- Commitment output 2 miktarına user_supply_total ismini ver.
        var user_supply_total = new decimal_js_1.default(value).toNumber();
        // 5- user_supply_total ‘ı 500’e böl ve bölüm sonucu bir tam sayı olarak ele alıp user_supply_lp_fees ismini ver.
        var user_supply_lp_fees = Math.floor(user_supply_total / lpFeeTier);
        // 6- user_supply_total ’dan user_supply_lp_fees ’ı çıkar ve sonuca user_supply_available ismini ver.
        var user_supply_available = Math.floor(user_supply_total - user_supply_lp_fees);
        // 7-pool_pair_2_liquidity ile user_supply_available ’i topla ve sonuca constant_coefficient ismini ver.
        var constant_coefficient = Math.floor(pool_pair_2_liquidity + user_supply_available);
        // 8- constant_coefficient ’ı pair_2_coefficient ’a böl ve bölüm sonucunu bir tam sayı olarak ele alıp constant_coefficient_downgraded ismini ver.
        var constant_coefficient_downgraded = Math.floor(constant_coefficient / pair_2_coefficient);
        // 12- pool_constant değerini constant_coefficient_downgraded ‘e böl ve sonuca new_pair_1_pool_liquidity_apx_1 ismini ver
        var new_pair_1_pool_liquidity_apx_1 = Math.floor(pool_constant / constant_coefficient_downgraded);
        // 13- new_pair_1_pool_liquidity_apx_1 değerini pair_1_coefficient ile çarp ve sonuca new_pair_1_pool_liquidity_apx_2 ismini ver.
        var new_pair_1_pool_liquidity_apx_2 = Math.floor(new_pair_1_pool_liquidity_apx_1 * pair_1_coefficient);
        // 14- pool_pair_1_liquidity değerinden new_pair_1_pool_liquidity_apx_2 değerini çıkar ve sonuca user_received_pair_1_apx ismini ver.
        var user_received_pair_1_apx = Math.floor(pool_pair_1_liquidity - new_pair_1_pool_liquidity_apx_2);
        // 15- pair_1_coefficient değerini 2 ile çarp ve sonuca payout_additional_fees ismini ver.
        var payout_additional_fees = Math.floor(pair_1_coefficient * 2);
        // 16- user_received_pair_1_apx değerinden payout_additional_fees değerini çıkar ve sonuca user_received_pair_1 ismini ver.
        var user_received_pair_1 = Math.floor(user_received_pair_1_apx - payout_additional_fees);
        var slippageAmount = (0, helper_1.div)(user_received_pair_1, slippageTolerance);
        var receivedAmount = user_received_pair_1 - slippageAmount;
        console.log("2", Math.floor(9 * pair_1_coefficient));
        if (user_received_pair_1 < Math.floor(9 * pair_1_coefficient)) {
            return { amount: 0, amountWithSlipapge: 0 };
        }
        return { amount: user_received_pair_1, amountWithSlipapge: receivedAmount };
    }
    return { amount: 0, amountWithSlipapge: 0 };
};
exports.validatePoolTx = validatePoolTx;
var pairsCoefficientCalculation = function (pool) {
    var pair_1_pool_supply = Number(pool.quote.value);
    var pair_2_pool_supply = Number(pool.token.value);
    var pair_1_coefficient = pool.pair1_coefficient.number;
    var pair_2_coefficient;
    if (pair_2_pool_supply >= pair_1_pool_supply) {
        pair_2_coefficient = Math.floor(pair_2_pool_supply / pair_1_pool_supply) * pair_1_coefficient;
    }
    else {
        pair_2_coefficient = Math.floor(pair_1_coefficient / Math.floor(pair_1_pool_supply / pair_2_pool_supply));
    }
    if (pair_2_coefficient < 1) {
        pair_2_coefficient = 1;
    }
    return { pair1Coefficent: pair_1_coefficient, pair2coefficient: pair_2_coefficient };
};
exports.pairsCoefficientCalculation = pairsCoefficientCalculation;
//# sourceMappingURL=validatePoolTx.js.map