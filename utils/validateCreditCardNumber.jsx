const validateCreditCardNumber = cardNumber => {
    console.log({ cardNumber })
    // Remove any non-digit characters
    cardNumber = cardNumber.replace(/\D/g, '');
    
    // Check if the card number is between 13 and 16 digits
    if (cardNumber.length < 13 || cardNumber.length > 16) {
        return false;
    }
    
    // Check if the card number passes the Luhn algorithm
    let sum = 0;
    let doubleUp = false;
    [...cardNumber].reverse().forEach((curDigit) => {
        curDigit = parseInt(curDigit);
        if (doubleUp) {
            if ((curDigit *= 2) > 9) curDigit -= 9;
        }
        sum += curDigit;
        doubleUp = !doubleUp;
    });
    if (sum % 10 != 0) {
        return false;
    }
    
    // Determine the card type based on the first few digits
    const cardTypes = new Map([
        [/^4/, 'Visa'],
        [/^5[1-5]/, 'Mastercard'],
        [/^3[47]/, 'Amex'],
        [/^6(?:011|5)/, 'Discover']
    ]);
    for (let [pattern, cardType] of cardTypes) {
        if (pattern.test(cardNumber)) {
            console.log(cardType)
            return cardType;
        }
    }
    
    // Return false if the card type is not recognized
    return false;
};

export default validateCreditCardNumber