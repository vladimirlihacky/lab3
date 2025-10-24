export function ISODateToLocaleString(date: string) {
    const dateObj = new Date(date);

    if(!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return 'Invalid date'
    }

    return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}