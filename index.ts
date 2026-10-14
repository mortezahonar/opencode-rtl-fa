import type { Plugin } from "@opencode-ai/plugin"
import { appendFileSync } from "node:fs"

/**
 * opencode-rtl-fa
 *
 * Makes opencode answer in Persian and lay the answer out right to left.
 *
 * Two independent layers:
 *
 * 1. "experimental.chat.system.transform"
 *    Appends a short imperative reminder to the very end of the system prompt,
 *    so the rule is the last thing the model reads. This layer asks.
 *
 * 2. "experimental.text.complete"
 *    Rewrites the finished text of an assistant reply: every line outside a
 *    fenced code block gets U+200F (RLM) in front of it, so the paragraph
 *    direction becomes right to left and the text starts at the right edge.
 *    This layer enforces; it does not depend on the model obeying anything.
 *
 * What it cannot do: translate the opencode interface itself (menus, buttons,
 * built-in messages). Plugins have no access to that.
 */

const RLM = "\u200F"

const FENCE = /^\s*(```|~~~)/

export interface RtlFaOptions {
    /** Inject the system prompt reminder. Default: true. */
    reminder?: boolean
    /** RLM per line outside fenced code blocks. Default: true. */
    enforce?: boolean
    /** Append one line per action to this file, for debugging. */
    log?: string
    /** Text appended to every system prompt when reminder is on. */
    reminderText?: string
}

export const RTL_REMINDER = [
    "OUTPUT FORMAT (hard rule, overrides habit, applies to every reply you write, in chat and in every file):",
    "Write Persian, right to left.",
    "Reason and think in Persian too, never in English.",
    "Begin EVERY line with the character U+200F (RLM) and then the Persian text, so every paragraph is",
    "laid out right to left and starts at the right edge.",
    "Never start a line with a Latin letter, a digit, a backtick, a hyphen, an asterisk, a bracket or a hash.",
    "No bullet lists, no bold, no headings and no markdown tables in replies: plain Persian paragraphs only.",
    "Keep paths, file names, identifiers and commands out of the middle of a Persian sentence: put them on",
    "their own line or in a fenced code block.",
    "Code blocks stay left to right and carry no Persian.",
].join(" ")

/**
 * Put U+200F in front of every line that is not inside a fenced code block.
 * An empty line and a line that already opens with the mark are left alone.
 */
export function forceRtl(text: string, mark: string = RLM): string {
    if (text === "") {
        return text
    }

    let insideFence = false

    return text
        .split("\n")
        .map((line) => {
            if (FENCE.test(line)) {
                insideFence = !insideFence

                return line
            }

            if (insideFence || line.trim() === "" || line.startsWith(mark)) {
                return line
            }

            return mark + line
        })
        .join("\n")
}

function logger(path?: string) {
    if (!path) {
        return () => undefined
    }

    return (message: string) => {
        try {
            appendFileSync(path, new Date().toISOString() + " " + message + "\n")
        } catch {
            // Logging must never break a request.
        }
    }
}

export const RtlFa: Plugin = async (_input, rawOptions) => {
    const options = (rawOptions ?? {}) as RtlFaOptions
    const write = logger(options.log)

    return {
        "experimental.chat.system.transform": async (_input, output) => {
            try {
                if (options.reminder === false || !Array.isArray(output.system)) {
                    return
                }

                const text = options.reminderText ?? RTL_REMINDER

                if (output.system.some((part) => part.includes("OUTPUT FORMAT (hard rule"))) {
                    return
                }

                output.system.push(text)
                write("system reminder injected")
            } catch {
                // Never break a request because of the guard itself.
            }
        },

        "experimental.text.complete": async (input, output) => {
            try {
                if (options.enforce === false || typeof output.text !== "string") {
                    return
                }

                const before = output.text
                const after = forceRtl(before)

                if (after === before) {
                    write("text.complete: already right to left part=" + input.partID)

                    return
                }

                output.text = after
                write("text.complete: rewritten part=" + input.partID + " lines=" + before.split("\n").length)
            } catch (error) {
                write("text.complete: failed " + String(error))
            }
        },
    }
}

export default RtlFa
