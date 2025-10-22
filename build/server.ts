import Bun from "bun"

await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir: "./dist",
    tsconfig: "./tsconfig.json",
    target: "node"
})