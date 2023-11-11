import { checkNumberEmpty } from "../../axios";

export const createFixedMonthlyProjections = (numMembers, salesPerMonth, numMonths) => {
    try {
        let result = [];
        for (let i = 1; i <= checkNumberEmpty(numMonths); i++) {
            let numResellers = calculateResellerGrowth(numMembers, i);
            let monthlySales = numResellers * salesPerMonth;
            result.push({
                month: i,
                numResellers,
                monthlySales,
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