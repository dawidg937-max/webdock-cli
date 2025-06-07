import { colors } from "@cliffy/ansi/colors";
export default function formatHookName(
	// deno-lint-ignore no-explicit-any
	hook: { id: any; callbackUrl: any; filters: any[] },
) {
	return [
		colors.bold(`ID: ${hook.id}`),
		colors.cyan(`URL: ${truncateUrl(hook.callbackUrl)}`),
		`Filters: ${hook.filters.reduce((carry: string, val) => carry + `${val.type} ${val.value}`, "")}`,
	].join(" | ");
}

function truncateUrl(url: string, maxLength = 40): string {
	if (url.length <= maxLength) return url;
	return `${url.slice(0, Math.floor(maxLength / 2))}...${url.slice(-Math.floor(maxLength / 2))}`;
}
