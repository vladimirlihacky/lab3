import Bun from "bun"

await Bun.build({
    entrypoints: ["./src/client/scripts/main.ts"],
    outdir: "./dist/client",
    tsconfig: "./tsconfig.json",
    target: "browser",
    format: "cjs",
    minify: {
        identifiers: false,
        keepNames: true, 
        whitespace: true, 
        syntax: true,
    }
})