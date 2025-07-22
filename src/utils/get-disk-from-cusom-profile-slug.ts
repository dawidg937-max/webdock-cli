export function getDiskFromCusomProfile(slug = ""): number {
  const disk = slug
    .split("-")
    .find((s) => s.endsWith("disk"))
    ?.slice(0, 2);

  return parseInt(disk ?? "non", 10);
}
