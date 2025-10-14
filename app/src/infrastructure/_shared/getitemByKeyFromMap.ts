export type DeepValues<T> =
    T extends readonly (infer U)[]                 // массивы/кортежи
        ? U | DeepValues<U>
        : T extends object                           // объекты
            ? { [K in keyof T]-?: T[K] | DeepValues<T[K]> }[keyof T]
            : T;

export function getItemByKeyFromMap<T>(
    map: T,
    key: readonly string[]
): DeepValues<T> {
    if (key.length === 0) {
        throw new Error("Key path must be non-empty");
    }

    const [head, ...tail] = key;

    // поддержка индексов массивов: "0", "1", ...
    const prop: PropertyKey = /^\d+$/.test(head) ? Number(head) : head;
    
    const rec = map as Record<PropertyKey, DeepValues<T>>;

    if (!(prop in rec)) {
        throw new Error(`Item with key "${prop}" "${JSON.stringify(map)}" "${key.join(".")}" not found`);
    }

    const value = rec[prop];

    if (tail.length === 0) {
        // DeepValues<T> корректно покрывает и листья, и вложенные значения
        return value as DeepValues<T>;
    }

    // идём глубже только по объектам/массивам (исключая null)
    if (value === null || typeof value !== "object") {
        throw new Error(`Path "${key.join(".")}" is not indexable at "${head}"`);
    }

    return getItemByKeyFromMap(value as object, tail) as DeepValues<T>;
}