export const daysDateTypes = (value) => {
    switch (value) {
        case "Today":
            return [1, "days"];
            break;
        case "Last 7 Days":
            return [7, "days"];
            break;
        case "Last 30 Days":
            return [30, "days"];
            break;
        case "Last 3 Months":
            return [3, "months"];
            break;
        case "Last Year":
            return [1, "years"];
        default:
            return ["", ""];
    }
};
