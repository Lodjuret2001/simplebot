import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import image from "@rollup/plugin-image";
import postcss from "rollup-plugin-postcss";
import replace from "@rollup/plugin-replace";
import { visualizer } from "rollup-plugin-visualizer";

export default {
  input: "src/index.tsx",
  output: {
    file: "dist/bot-min.js",
    format: "iife", // for <script> tag usage
    name: "PixliBot", // window.PixliBot
    sourcemap: false,
  },
  plugins: [
    // Replaces process.env.NODE_ENV for proper tree shaking
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),

    // Resolves .ts/.tsx/.js files
    resolve({
      browser: true,
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      preferBuiltins: false,
    }),

    // Converts CommonJS modules to ES
    commonjs({
      include: /node_modules/,
    }),

    // Handle CSS
    postcss({
      extract: true,
      minimize: true,
    }),

    // Transpile TSX and JSX with Babel
    babel({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      exclude: "node_modules/**",
      presets: ["@babel/preset-typescript", "@babel/preset-react"],
      babelHelpers: "bundled",
    }),

    image(),

    // Minify final JS
    terser(),

    // Optional: View bundle contents
    visualizer({ open: false }),
  ],
};