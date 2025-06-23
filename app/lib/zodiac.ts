export const getZodiacSign = (day: number, month: number): string => {
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    return "Unknown";
};

export const getChineseZodiac = (year: number): string => {
    const animals = [
        "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
        "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"
    ];
    // The sequence starts from Rat for 1900, 1912, 1924...
    // The calculation is based on a 12-year cycle.
    // (1900 was a Rat year, but the cycle reference point is easier from a year that maps to index 0)
    // 1924 is a Rat year. (1924 % 12) = 4. So we need to offset by -4 or +8.
    // (year - 1924) % 12 gives the correct sequence starting from Rat.
    const startYear = 1924; // A known Rat year
    if (year < startYear) {
        // Handle years before the reference if necessary
        return animals[((year - startYear) % 12 + 12) % 12];
    }
    return animals[(year - startYear) % 12];
}; 