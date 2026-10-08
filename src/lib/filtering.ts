export function parseTags(value: string) {
  return [...new Set(value.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean))];
}

export function matchesTagFilter(imageTags: string, selectedTags: string[]) {
  if (selectedTags.length === 0) return true;
  const tags = parseTags(imageTags);
  return selectedTags.some((tag) => tags.includes(tag.toLowerCase()));
}

export function collectTags(images: Array<{ tags: string }>) {
  return [...new Set(images.flatMap((image) => parseTags(image.tags)))].sort();
}