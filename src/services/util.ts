export const parseDateStr = (dateStr: string) => {
    let dateSplit = dateStr.split('\n');

    let datePart = dateSplit[0];

    let datePartSplit = datePart.split('/');

    let day = parseInt(datePartSplit[0]);
    let month = parseInt(datePartSplit[1]);
    let year = parseInt(datePartSplit[2]);

    let timePart = dateSplit[1];

    let timePartSplit = timePart.split(':');

    let hours = parseInt(timePartSplit[0]);
    let minutes = parseInt(timePartSplit[1]);

    return new Date(year, month, day, hours, minutes, 0);
}

export const dateToStr = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export const replaceALL = (str: string, search: string, replace: string) =>
    str.split(search).join(replace);