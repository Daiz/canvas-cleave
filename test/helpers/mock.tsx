type CallRecord<T> = { [P in keyof T]?: () => void };

export function recordMethodCalls<T extends object>(
  input: T
): [T, CallRecord<T>] {
  const record: CallRecord<T> = {};
  return [
    new Proxy(input, {
      get(obj: T, prop: keyof T) {
        if (typeof obj[prop] === "function") {
          if (record[prop] == null) record[prop] = jest.fn();
          const method = (obj[prop] as unknown) as Function;
          return function(...args: any) {
            const result = method.apply(obj, args);
            record[prop]!();
            return result;
          };
        }
        return obj[prop];
      }
    }),
    record
  ];
}
