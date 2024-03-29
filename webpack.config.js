// dotenv를 사용하여 환경 변수 로드
require("dotenv").config();

// 필요한 Node.js 모듈 및 webpack 플러그인 로드
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// 개발 환경 여부 확인
const isDevelopment = process.env.NODE_ENV !== "production";

// 프론트엔드 디렉토리 및 엔트리 포인트 설정
const frontendDirectory = "fori_frontend";
const frontend_entry = path.join("src", frontendDirectory, "src", "index.html");

module.exports = {
  // 모듈 로더 설정 (babel-loader 등)
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  // 빌드 대상 설정
  target: "web",
  // 개발 또는 프로덕션 모드 설정
  mode: isDevelopment ? "development" : "production",
  // 엔트리 포인트 설정
  entry: {
    index: path.join(__dirname, frontend_entry).replace(/\.html$/, ".js"),
  },
  // 개발용 소스맵 설정
  devtool: isDevelopment ? "source-map" : false,
  // 최적화 설정 (미니파이 등)
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  // 모듈 해석 및 확장자 설정
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    // 필요한 모듈의 폴백 설정
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  // 빌드 결과물 출력 설정
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", frontendDirectory),
  },
  // 사용되는 플러그인 설정 (HtmlWebpackPlugin, EnvironmentPlugin, ProvidePlugin, CopyPlugin 등)
  plugins: [
    // HTML 파일을 템플릿으로 사용하는 HtmlWebpackPlugin 설정
    new HtmlWebpackPlugin({
      template: path.join(__dirname, frontend_entry),
      cache: false,
    }),
    // 환경 변수를 제공하는 EnvironmentPlugin 설정
    new webpack.EnvironmentPlugin([
      ...Object.keys(process.env).filter((key) => {
        if (key.includes("CANISTER")) return true;
        if (key.includes("DFX")) return true;
        return false;
      }),
    ]),
    // 필요한 Node.js 모듈을 제공하는 ProvidePlugin 설정
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
    // 정적 파일 복사 등을 처리하는 CopyPlugin 설정
    new CopyPlugin({
      patterns: [
        {
          from: `src/${frontendDirectory}/src/.ic-assets.json*`,
          to: ".ic-assets.json5",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  // 개발 서버 설정
  devServer: {
    proxy: {
      // API 요청을 로컬 백엔드로 프록시 설정
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    // 정적 파일 경로 설정
    static: path.resolve(__dirname, "src", frontendDirectory, "assets"),
    // 핫 모듈 리플레이스먼트 및 파일 감시 설정
    hot: true,
    watchFiles: [path.resolve(__dirname, "src", frontendDirectory)],
    liveReload: true,
  },
};
