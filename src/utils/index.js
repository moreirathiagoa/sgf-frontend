import { parseISO, format } from 'date-fns';

function formatDateTimeFromDB(date) {
    const parsedDate = parseISO(date)
    const formattedDate = format(
        parsedDate,
        "dd/MM/yyyy HH:mm:ss"
    );
    return formattedDate
}

function formatDateFromDB(date) {
    const parsedDate = parseISO(date)
    const formattedDate = format(
        parsedDate,
        "dd/MM/yyyy"
    );
    return formattedDate
}

export {
    formatDateTimeFromDB,
    formatDateFromDB
}