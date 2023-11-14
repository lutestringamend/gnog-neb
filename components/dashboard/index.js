import { checkNumberEmpty } from "../../axios";
import { LEVEL_A_COMMISSION, LEVEL_B_COMMISSION, LEVEL_C_COMMISSION, LEVEL_D_COMMISSION, PPN_VALUE, PV_CONSTANT, RECRUITMENT_BONUS_VALUE, SALES_COMMISSION } from "./constants";


export const createFixedMonthlyProjections = (numMembers, periodLength, salesPerMonth, numMonths) => {
    try {

        let fiboArray = [];
        let fiboArray2 = [];
        let fiboArray3 = [];
        let fiboNum = 1;
        for (let a = 0; a < numMonths; a++) {
            if (a < 1) {
                fiboArray.push(fiboNum);
            } else {
                fiboNum += a + 1;
                fiboArray.push(fiboNum);
            }
        }

        for (let a = 0; a < numMonths; a++) {
            if (a < 1) {
                fiboArray2.push(1);
            } else {
                fiboNum = 0;
                for (let b = 0; b <= a; b++) {
                    fiboNum += fiboArray[b];
                }
                fiboArray2.push(fiboNum);
            }
        }

        for (let a = 0; a < numMonths; a++) {
            if (a < 1) {
                fiboArray3.push(1);
            } else {
                fiboNum = 0;
                for (let b = 0; b <= a; b++) {
                    fiboNum += fiboArray2[b];
                }
                fiboArray3.push(fiboNum);
            }
        }
        //console.log("fiboArray", fiboArray, fiboArray2, fiboArray3);
        
        let recruitmentBonus = numMembers * RECRUITMENT_BONUS_VALUE;
        let ppn = Math.floor(salesPerMonth / PPN_VALUE);
        let sales = salesPerMonth - ppn;
        let salesCommission = Math.round(SALES_COMMISSION * salesPerMonth);
        const bv = salesPerMonth - salesCommission;
        const pv = Math.round(bv / PV_CONSTANT);

        let result = [];

        for (let i = 1; i <= checkNumberEmpty(numMonths); i++) {
            let numResellers = calculateResellerGrowth(numMembers, i);
            let monthlySales = (numResellers * salesPerMonth) / periodLength;

            let hpv = (numResellers + 1) * pv;
            let rpv = [Math.pow(numMembers, i - 1) * pv];
            
            //let balanceAccumulation = i * (salesCommission + recruitmentBonus);
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
            });
        }

        let recalc = [];
        for (let j = 0; j < result?.length; j++) {
            let hpv = result[j]?.hpv;
            let rpv = [];
            let balance = salesCommission + recruitmentBonus;
            let childMember = numMembers * (j + 1);
            let grandChildMember = 0;
            let greatGrandMember = 0;
            let greatGreatMember = 0;

            if (j > 0) {
                grandChildMember = Math.pow(numMembers, 2) * fiboArray[j - 1];
            }
            if (j > 1) {
                greatGrandMember = Math.pow(numMembers, 3) * fiboArray2[j - 2];
            }
            if (j > 2) {
                greatGreatMember = Math.pow(numMembers, 4) * fiboArray3[j - 3];
            }

            let levelA = 0;
            let levelB = 0;
            let levelC = 0;
            let levelD = 0;
            let level = 0;
            if (j < 1) {
                rpv = result[j]?.rpv;
            } else {
                for (let k = j - 1; k >= 0; k--) {
                    rpv.push(result[k]?.hpv);
                }
                rpv.push(result[0]?.rpv[0]);
                
            }

            if (hpv >= 35000 && rpv[0] >= 6000 && rpv[1] >= 1500 && rpv[2] >= 500) {
                level = 4;
            } else if (hpv >= 9000 && rpv[0] >= 1500 && rpv[1] >= 500) {
                level = 3;
            } else if (hpv >= 2000 && rpv[0] >= 500) {
                level = 2;
            } else if (hpv >= 300 && rpv[0] >= 100) {
                level = 1;
            }

            if (level >= 1) {
                levelA = Math.round(LEVEL_A_COMMISSION * childMember * salesPerMonth);
            }

            if (level >= 4) {
                levelD = Math.round(LEVEL_D_COMMISSION * grandChildMember * salesPerMonth);
            } else if (level >= 3) {
                levelC = Math.round(LEVEL_C_COMMISSION * grandChildMember * salesPerMonth);
            } else if (level >= 2) {
                levelB = Math.round(LEVEL_B_COMMISSION * grandChildMember * salesPerMonth);
            }
            

            balance += levelA + levelB + levelC + levelD;

            recalc.push({
                ...result[j],
                childMember,
                grandChildMember,
                greatGrandMember,
                greatGreatMember,
                rpv,
                level,
                levelA,
                levelB,
                levelC,
                levelD,
                salesCommission,
                recruitmentBonus,
                balance,
            });
        }

        let accumulated = [];
        let sum = 0;
        for (let k = 0; k < recalc?.length; k++) {
            sum += recalc[k]?.balance;
            accumulated.push({
                ...recalc[k],
                balanceAccumulation: sum,
            });
        }

        return accumulated;
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