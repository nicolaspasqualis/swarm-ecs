export type Component = {
    type: symbol;
    data: any;
};
export declare function ComponentType<T>(): {
    type: symbol;
    data: T;
    create: (data: T) => {
        type: symbol;
        data: T;
    };
};
