export const sanitizePath = async (path: string) => {
	const items = path.split("/");
	let idx = 0;
	for (; idx < items.length; idx++) {
		try {
			await Deno.stat(items.slice(0, idx + 1).join("/"));
		} catch (_err) {
			break;
		}
	}
	path = items.slice(idx).join("/");

	if (!path) return false;
	return path.startsWith("/") ? path : `/${path}`;
};
