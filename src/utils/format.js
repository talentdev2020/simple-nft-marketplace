// cut with 2 digits
export function fixedBalance(value) {
    return (+value).toFixed(2);
}

//get short address like "0x4c...99A"
export function getShortAddress(address) {
    return address.substring(0,4) + "..." + address.substr(-3)
}