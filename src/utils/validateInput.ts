// import {   getToken } from "./config.ts";
// import type { ZodSchema } from "npm:zod";
// import { colors } from "@cliffy/ansi/colors";
// import {z} from "npm:zod"

// // deno-lint-ignore no-explicit-any
// export async function ValidateInput<TSchema extends ZodSchema<any>>(
// 	schema: TSchema,
// 	options: Record<string, unknown>,
// ): Promise<z.infer<TSchema> & { table: boolean; token: string }> {
// 	// Parse JSON if present
// 	let jsonData = {};
// 	if (typeof options.json === "string") {
// 		try {
// 			jsonData = JSON.parse(options.json);
// 		} catch {
// 			console.error(
// 				colors.bold.underline.rgb24("Invalid JSON format", 0xff3333),
// 			);
// 			Deno.exit(1);
// 		}
// 	}

// 	// Merge options with JSON data (CLI options take precedence)
// 	const mergedOptions = {
// 		...jsonData,
// 		...options,
// 	};

// 	// Validate with schema
// 	const parsed = await schema.safeParseAsync(mergedOptions);
// 	if (!parsed.success) {
// 		const errorMessages = parsed.error.errors.map((e) => colors.bold.underline.rgb24(e.message, 0xff3333));
// 		console.error(errorMessages.join("\n"));
// 		Deno.exit(1);
// 	}

// 	// Return validated data with guaranteed table and token
// 	return {
// 		...parsed.data,
// 		table: Boolean(mergedOptions.table),
// 		token: String(mergedOptions.token),
// 	} as z.infer<TSchema> & { table: boolean; token: string };
// }
