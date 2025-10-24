import Bun from "bun"

await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir: "./dist/server",
    tsconfig: "./tsconfig.json",
    target: "node"
})