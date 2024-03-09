import { checkNumberEmpty } from "../../axios";
import {
  LEVEL_A_COMMISSION,
  LEVEL_B_COMMISSION,
  LEVEL_C_COMMISSION,
  LEVEL_D_COMMISSION,
  LEVEL_LABELS,
  PPN_VALUE,
  PV_CONSTANT,
  RECRUITMENT_BONUS_VALUE,
  SALES_COMMISSION,
} from "../constants/dashboard";

export const createVueFixedMonthlyProjections = (
  numMembers,
  periodLength,
  salesPerMonth,
  numMonths
) => {
  try {
    let fiboArray = [];
    let fiboNum = 1;
    for (let a = 0; a < numMonths; a++) {
      if (a < 1) {
        fiboArray.push(fiboNum); 
      } else {
        fiboNum += a + 1;
        fiboArray.push(fiboNum);
      }
    }
    //console.log("Fibo Array", fiboArray);

    let recruitmentBonus = numMembers * RECRUITMENT_BONUS_VALUE; // 150.000
    let ppn              = Math.floor(salesPerMonth / PPN_VALUE); // 181.818
    let sales            = salesPerMonth - ppn;
    let salesCommission   = Math.round(SALES_COMMISSION * salesPerMonth); //200.000
    const bv             = salesPerMonth - salesCommission; // 1.800.000
    const pv             = Math.round(bv / PV_CONSTANT); //36
    
    let result = [];

    for (let i = 1; i <= checkNumberEmpty(numMonths); i++) {
      let numResellers = calculateResellerGrowth(numMembers, i);
      let monthlySales = (numResellers * salesPerMonth) / periodLength;

      let hpv = (numResellers + 1) * pv;
      let rpv = [Math.pow(numMembers, i - 1) * pv];

      result.push({
        month:
        periodLength > 1 ? `${periodLength * (i - 1) + 1}-${i * periodLength}` : i.toString(),
        numResellers,
        monthlySales,
        ppn,
        sales,
        salesCommission,
        bv,
        pv,
        hpv,
        rpv,
        recruitmentBonus
      })
      //console.log(result);
    }

    let recalc = [];
    for (let j = 0; j < result.length; j++) {
      let hpv              = result[j].hpv;
      let rpv              = [];
      let balance          = salesCommission + recruitmentBonus;
      let childMember      = numMembers * (j + 1);
      let grandChildMember = 0;

      //console.log("saldo = ",balance);
      //console.log("Anak", childMember);
      
      if (j > 0) {
        grandChildMember = Math.pow(numMembers, 2) * fiboArray[j - 1];
        //console.log("Cucu ", grandChildMember);
      }

      let level  = 0;
      let levelA = 0;
      let levelB = 0;
      let levelC = 0;
      let levelD = 0;
      if (j < 1) {
        rpv = result[j].rpv;
      } else {
        for (let k = j - 1; k >= 0; k--) {
          rpv.push(result[k].hpv);
        }
        rpv.push(result[0].rpv[0]);
      }

      if (
        hpv >= 300 &&
        rpv[0] >= 100 &&
        (numMembers > 1 || checkNumberEmpty(rpv[1]) >= 100)
      ) {
        level = 1;
      }

      if (
        hpv >= 2000 &&
        rpv[0] >= 500 &&
        (numMembers > 1 || checkNumberEmpty(rpv[1]) >= 500)
      ) {
        level = 2;
      }

      if (hpv >= 9000 && rpv[0] >= 1500) {
        if (numMembers === 1) {
          if (
            checkNumberEmpty(rpv[1]) >= 1500 &&
            checkNumberEmpty(rpv[2]) >= 1500
          ) {
            level = 3;
          }
        } else if (numMembers === 2) {
          if (checkNumberEmpty(rpv[1]) >= 1500) {
            level = 3;
          }
        } else if (checkNumberEmpty(rpv[1]) >= 500) {
          level = 3;
        }
      }

      if (
        hpv >= 35000 &&
        rpv[0] >= 6000 &&
        checkNumberEmpty(rpv[1]) >= 1500 &&
        checkNumberEmpty(rpv[2]) >= 500
      ) {
        if (numMembers === 1) {
          if (
            checkNumberEmpty(rpv[1]) >= 6000 &&
            checkNumberEmpty(rpv[2]) >= 6000 &&
            checkNumberEmpty(rpv[3]) >= 1500 &&
            checkNumberEmpty(rpv[4]) >= 1500 &&
            checkNumberEmpty(rpv[5]) >= 1500
          ) {
            level = 4;
          }
        } else if (numMembers === 2) {
          if (
            checkNumberEmpty(rpv[1]) >= 6000 &&
            checkNumberEmpty(rpv[2]) >= 1500
          ) {
            level = 4;
          }
        } else {
          level = 4;
        }
      }

      if (level >= 1) {
        levelA = Math.round(
          LEVEL_A_COMMISSION * childMember * salesPerMonth
        );
      }

      if (level >= 4) {
        levelD = Math.round(
          LEVEL_D_COMMISSION * grandChildMember * salesPerMonth
        );
      } else if (level >= 3) {
        levelC = Math.round(
          LEVEL_C_COMMISSION * grandChildMember * salesPerMonth
        );
      } else if (level >= 2) {
        levelB = Math.round(
          LEVEL_B_COMMISSION * grandChildMember * salesPerMonth
        );
      }

      balance += levelA + levelB + levelC + levelD;

      recalc.push({
        ...result[j],
        childMember,
        grandChildMember,
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
    for (let k = 0; k < recalc.length; k++) {
      sum += recalc[k].balance;
      accumulated.push({
        ...recalc[k],
        bulan: recalc[k].month,
        level: recalc[k].level < 1 ? "" : LEVEL_LABELS[recalc[k].level],
        saldo: recalc[k].balance,
        saldo_akumulasi: sum,
      });
    }

    //results = accumulated;
    //console.log("AKUMULASI ",accumulated);
    return accumulated;
  } catch (e) {
    console.log(e);
  }
  return [];
};

export const createFixedMonthlyProjections = (
  numMembers,
  periodLength,
  salesPerMonth,
  numMonths
) => {
  try {
    let fiboArray = [];
    /*let fiboArray2 = [];
    let fiboArray3 = [];*/
    let fiboNum = 1;
    for (let a = 0; a < numMonths; a++) {
      if (a < 1) {
        fiboArray.push(fiboNum);
      } else {
        fiboNum += a + 1;
        fiboArray.push(fiboNum);
      }
    }

    /*for (let a = 0; a < numMonths; a++) {
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
    }*/

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

      result.push({
        month:
          periodLength > 1
            ? `${periodLength * (i - 1) + 1}-${i * periodLength}`
            : i.toString(),
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
      /*let greatGrandMember = 0;
      let greatGreatMember = 0;*/

      if (j > 0) {
        grandChildMember = Math.pow(numMembers, 2) * fiboArray[j - 1];
      }
      /*if (j > 1) {
        greatGrandMember = Math.pow(numMembers, 3) * fiboArray2[j - 2];
      }
      if (j > 2) {
        greatGreatMember = Math.pow(numMembers, 4) * fiboArray3[j - 3];
      }*/

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

      if (
        hpv >= 300 &&
        rpv[0] >= 100 &&
        (numMembers > 1 || checkNumberEmpty(rpv[1]) >= 100)
      ) {
        level = 1;
      }

      if (
        hpv >= 2000 &&
        rpv[0] >= 500 &&
        (numMembers > 1 || checkNumberEmpty(rpv[1]) >= 500)
      ) {
        level = 2;
      }

      if (hpv >= 9000 && rpv[0] >= 1500) {
        if (numMembers === 1) {
          if (
            checkNumberEmpty(rpv[1]) >= 1500 &&
            checkNumberEmpty(rpv[2]) >= 1500
          ) {
            level = 3;
          }
        } else if (numMembers === 2) {
          if (checkNumberEmpty(rpv[1]) >= 1500) {
            level = 3;
          }
        } else if (checkNumberEmpty(rpv[1]) >= 500) {
          level = 3;
        }
      }

      if (
        hpv >= 35000 &&
        rpv[0] >= 6000 &&
        checkNumberEmpty(rpv[1]) >= 1500 &&
        checkNumberEmpty(rpv[2]) >= 500
      ) {
        if (numMembers === 1) {
          if (
            checkNumberEmpty(rpv[1]) >= 6000 &&
            checkNumberEmpty(rpv[2]) >= 6000 &&
            checkNumberEmpty(rpv[3]) >= 1500 &&
            checkNumberEmpty(rpv[4]) >= 1500 &&
            checkNumberEmpty(rpv[5]) >= 1500
          ) {
            level = 4;
          }
        } else if (numMembers === 2) {
          if (
            checkNumberEmpty(rpv[1]) >= 6000 &&
            checkNumberEmpty(rpv[2]) >= 1500
          ) {
            level = 4;
          }
        } else {
          level = 4;
        }
      }

      if (level >= 1) {
        levelA = Math.round(LEVEL_A_COMMISSION * childMember * salesPerMonth);
      }

      if (level >= 4) {
        levelD = Math.round(
          LEVEL_D_COMMISSION * grandChildMember * salesPerMonth
        );
      } else if (level >= 3) {
        levelC = Math.round(
          LEVEL_C_COMMISSION * grandChildMember * salesPerMonth
        );
      } else if (level >= 2) {
        levelB = Math.round(
          LEVEL_B_COMMISSION * grandChildMember * salesPerMonth
        );
      }

      balance += levelA + levelB + levelC + levelD;

      recalc.push({
        ...result[j],
        childMember,
        grandChildMember,
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
        bulan: recalc[k].month,
        levelName: recalc[k].level < 1 ? "" : LEVEL_LABELS[recalc[k].level],
        saldo: recalc[k].balance,
        saldo_akumulasi: sum,
      });
    }

    return accumulated;
  } catch (e) {
    console.error(e);
  }
  return [];
};

export const calculateResellerGrowth = (numMembers, numMonth) => {
  try {
    //console.log(`${numMembers + 1} to the power of ${numMonth} - 1`, (Math.pow(numMembers+1, numMonth)) - 1);
    return (Math.pow(numMembers + 1, numMonth) - 1);
  } catch (e) {
    console.error(e);
  }
  return 0;
};
