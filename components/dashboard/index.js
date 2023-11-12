import { checkNumberEmpty } from "../../axios";
import { PPN_VALUE, PV_CONSTANT, RECRUITMENT_BONUS_VALUE, SALES_COMMISSION } from "./constants";


export const createFixedMonthlyProjections = (numMembers, periodLength, salesPerMonth, numMonths) => {
    try {
        let result = [];
        for (let i = 1; i <= checkNumberEmpty(numMonths); i++) {
            let numResellers = calculateResellerGrowth(numMembers, i);
            let monthlySales = (numResellers * salesPerMonth) / periodLength;
            let recruitmentBonus = numMembers * RECRUITMENT_BONUS_VALUE;
            let ppn = Math.floor(salesPerMonth / PPN_VALUE);
            let sales = salesPerMonth - ppn;
            let salesCommission = Math.round(SALES_COMMISSION * salesPerMonth);
            let bv = salesPerMonth - salesCommission;
            let pv = Math.round(bv / PV_CONSTANT);
            let hpv = (numResellers + 1) * pv;
            let rpv = Math.pow(numMembers, i - 1) * pv;
            let balance = i*(salesCommission + recruitmentBonus);
            result.push({
                month: periodLength > 1 ? `${(periodLength * (i - 1)) + 1}-${i * periodLength}` : i.toString(),
                numResellers,
                monthlySales,
                ppn,
                sales,
                salesCommission,
                bv,
                pv,
                hpv,
                rpv,
                recruitmentBonus,
                balance
            });
        }
        return result;
    } catch (e) {
        console.error(e);
    }
    return [];
}

export const calculateResellerGrowth = (numMembers, numMonth) => {
    try {
        //console.log(`${numMembers + 1} to the power of ${numMonth} - 1`, (Math.pow(numMembers+1, numMonth)) - 1);
        return (Math.pow(numMembers+1, numMonth)) - 1;
    } catch (e) {
        console.error(e);
    }
    return 0;
}