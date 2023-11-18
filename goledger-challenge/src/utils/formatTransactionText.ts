import { DateTime } from "luxon";
import capitalizeFirstLetter from "./capitalizeFirstLetter";
import getTrasactionType from "./getTrasactionType";
import { defaultDateFormat } from "./dateFormat";

export default function formatTransactionText(transactionType: string, transcationUser: string, transactionDate?: string){
    let newTransactionText = getTrasactionType(transactionType);
    if (newTransactionText) {
        newTransactionText = `${capitalizeFirstLetter(newTransactionText)}d by ${transcationUser}`;
    }
    if(transactionDate){
        newTransactionText = `${newTransactionText} on ${DateTime.fromISO(transactionDate).toFormat(defaultDateFormat)}`
    }
    return newTransactionText;
}