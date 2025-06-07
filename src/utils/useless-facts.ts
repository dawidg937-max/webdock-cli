import axios from "npm:axios";

export const uselessFacts = async () => {
	try {
		const data = await axios(
			"https://uselessfacts.jsph.pl/api/v2/facts/random",
		);
		return data.data.text as unknown as string;
		// deno-lint-ignore no-unused-vars
	} catch (error) {
		return "No fun facts for now :)";
	}
};
