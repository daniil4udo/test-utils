import { FlatTransactionComparable, compareTransactionForTest } from "./transaction";
import { expect } from "vitest";
import { CompareResult } from "./interface";
import { compareAddressForTest, compareCellForTest, compareSliceForTest } from "./comparisons";
import { Address, Cell, Slice } from "@ton/core";

// Wrapper function to create custom matchers
function wrapComparer<T>(comparer: (subject: any, cmp: T) => CompareResult) {
    return function(actual, cmp) {
        const result = comparer(actual, cmp);
        return {
            pass: result.pass,
            message: () => {
                if (result.pass) {
                    return result.negMessage();
                } else {
                    return result.posMessage();
                }
            },
        };
    };
}

// Define custom matchers
const toHaveTransaction = wrapComparer(compareTransactionForTest);
const toEqualCell = wrapComparer(compareCellForTest);
const toEqualAddress = wrapComparer(compareAddressForTest);
const toEqualSlice = wrapComparer(compareSliceForTest);

// Extend Vitest's expect with custom matchers
expect.extend({
    toHaveTransaction,
    toEqualCell,
    toEqualAddress,
    toEqualSlice,
});

// TypeScript declarations for Vitest (optional, inferred automatically)
declare module "vitest" {
    export interface Assertion<T = any> {
        toHaveTransaction(cmp: FlatTransactionComparable): void;
        toEqualCell(cell: Cell): void;
        toEqualAddress(address: Address): void;
        toEqualSlice(slice: Slice): void;
    }
}