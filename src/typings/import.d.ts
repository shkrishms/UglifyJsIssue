// webpack hack, because typescript 2.2 doesn't support `import()`
// https://github.com/Microsoft/TypeScript/issues/12364#issuecomment-270819757
// declare function _import(path: string): Promise<any>;

// actually import above also has multiple compatibility issues 
// until then working around

interface System {
    import<T>(path: string): Promise<T>;
}

declare var System: System;
