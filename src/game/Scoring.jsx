/* === CALCULATE THE SCORE === */
export const calculateScore = (matchedIndexCount) => {
    if (matchedIndexCount === 0) return 0;

    const basePointsPerPiece = 2;

    // Give bonus points based on the number of matches pieces
    if (matchedIndexCount === 3) {
        return matchedIndexCount * basePointsPerPiece;
    } else if (matchedIndexCount === 4) {
        return matchedIndexCount * basePointsPerPiece + 4;
    } else if (matchedIndexCount > 4) {
        return matchedIndexCount * basePointsPerPiece * 2 // Combo multiplier
    }

    return matchedIndexCount * basePointsPerPiece;
};
