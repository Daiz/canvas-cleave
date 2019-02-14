type CallRecord<T> = { [P in keyof T]?: () => void };

export function recordMethodCalls<T extends object>(
  input: T
): [T, CallRecord<T>] {
  const record: CallRecord<T> = {};
  return [
    new Proxy(input, {
      get<K extends keyof T>(obj: T, prop: K): T[K] {
        if (typeof obj[prop] === "function") {
          if (record[prop] == null) record[prop] = jest.fn();
          const method = (obj[prop] as unknown) as Function;
          return (function(...args: any): any {
            const result = method.apply(obj, args);
            record[prop]!();
            return result;
          } as unknown) as T[K];
        }
        return obj[prop];
      }
    }),
    record
  ];
}
