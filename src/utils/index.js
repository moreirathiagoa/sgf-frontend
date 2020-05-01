import { parseISO, format } from 'date-fns';
import { notification } from 'antd';

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

function openNotification(type, message, description) {
    notification[type]({
        message: message,
        description: description,
    });
};


export {
    formatDateTimeFromDB,
    formatDateFromDB,
    openNotification
}