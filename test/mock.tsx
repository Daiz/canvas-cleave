type CallRecord<T> = { [P in keyof T]?: (...args: any[]) => void };

export function recordMethodCalls<T extends object>(
  input: T
): [T, CallRecord<T>] {
  const record: CallRecord<T> = {};
  return [
    new Proxy(input, {
      get<K extends keyof T>(obj: T, key: K): T[K] {
        const prop = obj[key];
        if (typeof prop === "function") {
          if (record[key] == null) record[key] = jest.fn();
          return (((...args: any[]): any => {
            const result = prop.apply(obj, args);
            record[key]!.apply(obj, args);
            return result;
          }) as unknown) as T[K];
        }
        return obj[key];
      }
    }),
    record
  ];
}
