/*
 * opencode-rtl-fa: tests for the right to left rewrite.
 * Copyright (C) 2026  Morteza Honar
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

import { describe, expect, test } from "bun:test"
import { forceRtl } from "../index.ts"

const RLM = "\u200F"

// Persian samples are written as escapes so this file stays pure ASCII and
// carries no Persian text inside a code block.
const HELLO = "\u0633\u0644\u0627\u0645" // salam
const WORLD = "\u062f\u0646\u06cc\u0627" // donya
const BEFORE = "\u0642\u0628\u0644" // ghabl
const AFTER = "\u0628\u0639\u062f" // baad

describe("forceRtl", () => {
    test("puts the mark in front of a line", () => {
        expect(forceRtl(HELLO)).toBe(RLM + HELLO)
    })

    test("leaves an empty string alone", () => {
        expect(forceRtl("")).toBe("")
    })

    test("marks both lines and leaves the blank line alone", () => {
        expect(forceRtl(HELLO + "\n\n" + WORLD)).toBe(RLM + HELLO + "\n\n" + RLM + WORLD)
    })

    test("does not add a second mark", () => {
        expect(forceRtl(RLM + HELLO)).toBe(RLM + HELLO)
    })

    test("marks a line that opens with Latin characters", () => {
        expect(forceRtl("src/index.ts")).toBe(RLM + "src/index.ts")
    })

    test("marks a line that opens with a digit", () => {
        expect(forceRtl("42 results")).toBe(RLM + "42 results")
    })

    test("keeps a fenced code block untouched", () => {
        const input = ["```php", "<?php echo 'hi';", "$x = 1;", "```"].join("\n")

        expect(forceRtl(input)).toBe(input)
    })

    test("keeps a tilde fenced block untouched", () => {
        const input = ["~~~", "a = 1", "~~~"].join("\n")

        expect(forceRtl(input)).toBe(input)
    })

    test("marks lines before and after a fenced block", () => {
        const input = [BEFORE, "```", "code = 1", "```", AFTER].join("\n")
        const expected = [RLM + BEFORE, "```", "code = 1", "```", RLM + AFTER].join("\n")

        expect(forceRtl(input)).toBe(expected)
    })

    test("accepts a custom mark", () => {
        expect(forceRtl(HELLO, "X")).toBe("X" + HELLO)
    })
})
