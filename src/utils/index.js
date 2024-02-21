export const shortenNotifDesc = (text, maxChar) => {
    if (text === undefined || text === null) {
      return "";
    }

    try {
        let textFirst = text.replaceAll("\n", " ");
        let maxNumberOfChars = maxChar ? maxChar : 105;
        if (textFirst?.length >= maxNumberOfChars - 3) {
            return `${textFirst.substring(0, maxNumberOfChars)}..`;
        }
    } catch (e) {
        console.error(e);
    }
    return text;
}