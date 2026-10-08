import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const filename = fileURLToPath(import.meta.url);
const directory = dirname(filename);
const compat = new FlatCompat({ baseDirectory: directory });

const config = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  ignores: [".next/**", "node_modules/**", "photos/**", "prisma/generated/**", "next-env.d.ts"],
}];

export default config;