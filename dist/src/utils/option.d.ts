export declare class NoSuchElementError extends Error {
    name: string;
    message: string;
    stack: string;
    constructor();
}
export interface IOptionMatcher<A, B> {
    Some(value: A): B;
    None(): B;
}
export declare const Option: <T>(value: T) => Option<T>;
export interface Option<A> {
    isDefined: boolean;
    isEmpty: boolean;
    get(): A;
    getOrElse(defaultValue: () => A): A;
    orElse(alternative: () => Option<A>): Option<A>;
    match<B>(matcher: IOptionMatcher<A, B>): B;
    map<B>(f: (value: A) => B): Option<B>;
    flatMap<B>(f: (value: A) => Option<B>): Option<B>;
    filter(predicate: (value: A) => boolean): Option<A>;
    reject(predicate: (value: A) => boolean): Option<A>;
    foreach(f: (value: A) => void): void;
}
export declare class Some<A> implements Option<A> {
    private value;
    isDefined: boolean;
    isEmpty: boolean;
    constructor(value: A);
    get(): A;
    getOrElse(defaultValue: () => A): A;
    orElse(alternative: () => Option<A>): Option<A>;
    match<B>(matcher: IOptionMatcher<A, B>): B;
    map<B>(f: (value: A) => B): Option<B>;
    flatMap<B>(f: (value: A) => Option<B>): Option<B>;
    filter(predicate: (value: A) => boolean): Option<A>;
    reject(predicate: (value: A) => boolean): Option<A>;
    foreach(f: (value: A) => void): void;
}
export declare const None: Option<any>;
export declare const flatten: <T>(options: Option<T>[]) => T[];
//# sourceMappingURL=option.d.ts.map