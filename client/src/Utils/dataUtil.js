export const safeGet = (data, path, defaultValue = undefined) => {
    if (!path) return undefined;
    let paths = path.split(".");
    let res = data;
    while (paths.length) {
        res = res[paths.shift()];
        if (!res) return defaultValue;
    }
    return res;
};
