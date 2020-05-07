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