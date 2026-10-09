"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function TagFilters({ tags }: { tags: string[] }) {
  const searchParams = useSearchParams();
  const selectedTags = searchParams.get("tag")?.split(",").filter(Boolean) ?? [];
  const query = searchParams.get("q") ?? "";

  function hrefFor(tag?: string) {
    const nextTags = tag === undefined ? [] : selectedTags.includes(tag) ? selectedTags.filter((selected) => selected !== tag) : [...selectedTags, tag];
    const params = new URLSearchParams();
    if (nextTags.length) params.set("tag", nextTags.join(","));
    if (query) params.set("q", query);
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : "/";
  }

  return <div className="tag-list"><Link scroll={false} className={!selectedTags.length ? "active" : ""} href={hrefFor()}>All</Link>{tags.map((tag) => <Link scroll={false} className={selectedTags.includes(tag) ? "active" : ""} href={hrefFor(tag)} key={tag}>{tag}</Link>)}</div>;
}