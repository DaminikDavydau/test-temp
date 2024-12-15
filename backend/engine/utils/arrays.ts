export function getArrayDifference(arrayOne: any[], arrayTwo: any[]) {
    const difference = arrayOne.filter((item) => arrayTwo.indexOf(item) < 0);
    return difference;
}

export function getMedianElement(array: any[]) {
    const medianIndex = Math.floor(array.length / 2);
    return array[medianIndex];
}

export function getRecordValuesSum(record: Record<any, number>) {
    const values = Object.values(record)
    return getArraySum(values);
}

export function getArraySum(array: number[]) {
    return array.reduce(
        (partialSum, a) => partialSum + a,
        0
    );
}
