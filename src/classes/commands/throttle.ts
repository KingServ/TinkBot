export type Throttle = {
    start: number;
    usages: number;
    timeout: NodeJS.Timer;
};

export type ThrottlingOptions = {
    usages: number;
    duration: number;
};