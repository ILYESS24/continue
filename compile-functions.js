/**
 * Script pour compiler les Cloudflare Pages Functions TypeScript en JavaScript
 */

import { build } from "esbuild";
import { mkdirSync, readdirSync, statSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const functionsDir = join(__dirname, "gui", "functions");
const outputDir = join(__dirname, "gui", "dist", "functions");

function findTsFiles(dir, baseDir = dir) {
  const files = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findTsFiles(fullPath, baseDir));
    } else if (entry.endsWith(".ts")) {
      const relativePath = relative(baseDir, fullPath);
      files.push({ input: fullPath, relative: relativePath });
    }
  }

  return files;
}

async function compileFunctions() {
  console.log("🔨 Compiling Cloudflare Pages Functions...");

  const tsFiles = findTsFiles(functionsDir);

  if (tsFiles.length === 0) {
    console.log("⚠️  No TypeScript Functions found");
    return;
  }

  for (const file of tsFiles) {
    // Handle Windows path separators and [...path] pattern
    const relativePath = file.relative.replace(/\\/g, "/");
    const outputPath = join(outputDir, relativePath.replace(/\.ts$/, ".js"));
    const outputDirPath = dirname(outputPath);

    // Create output directory
    mkdirSync(outputDirPath, { recursive: true });

    console.log(
      `📝 Compiling: ${file.relative} -> ${relative(outputDir, outputPath)}`,
    );

    try {
      await build({
        entryPoints: [file.input],
        bundle: false,
        outfile: outputPath,
        platform: "neutral",
        format: "esm",
        target: "es2022",
        external: [],
        banner: {
          js: "// @ts-nocheck\n",
        },
        define: {
          "process.env.NODE_ENV": '"production"',
        },
        loader: {
          ".ts": "ts",
        },
        keepNames: true,
        minify: false,
      });

      console.log(`✅ Compiled: ${relative(outputDir, outputPath)}`);
    } catch (error) {
      console.error(`❌ Error compiling ${file.relative}:`, error);
      process.exit(1);
    }
  }

  console.log("✅ All Functions compiled successfully!");
}

compileFunctions().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
