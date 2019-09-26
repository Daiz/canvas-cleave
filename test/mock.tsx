type CallRecord<T> = { [P in keyof T]?: (...args: any[]) => void };

export function recordMethodCalls<T extends object>(
  input: T
): [T, CallRecord<T>] {
  const record: CallRecord<T> = {};
  (Object.getOwnPropertyNames(
    Object.getPrototypeOf(input)
  ) as (keyof T)[]).forEach(key => {
    const prop = input[key];
    if (typeof prop === "function") {
      record[key] = jest.fn();
      // @ts-ignore monkey patch original method call with a recording wrapper
      input[key] = (...args: any[]): any => {
        const result = prop.apply(input, args);
        record[key]!.apply(input, args);
        return result;
      };
    }
  });
  return [input, record];
}
