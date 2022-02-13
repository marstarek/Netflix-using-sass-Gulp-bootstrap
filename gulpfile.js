const gulp = require("gulp");
const { src, dest, watch, series, parallel } = require("gulp");
// const imagemin = require("imagemin");
const browserSync = require("browser-sync").create();
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const terser = require("gulp-terser");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
var uglify = require("gulp-uglify");

async function style() {
    return src("src/scss/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/css"));
}

async function bootstrapstyle() {
    return src("src/bootstrap/bootstrap.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest("dist/css"));
}

async function scripts() {
    gulp
        .src("src/js/**/*.js")
        .pipe(uglify())
        .pipe(rename("main.min.js"))
        .pipe(gulp.dest("dist/js"))
        .pipe(browserSync.stream());
}
async function watchs() {
    browserSync.init({
        server: {
            baseDir: "./app",
        },
    });
    gulp.watch("src/scss/**/*.scss", style);
    gulp.watch("src/bootstrap/**/*.scss", bootstrapstyle);
    // gulp.watch("src/images/**/*.*", compress_imgs);
    gulp.watch("src/plugins/**/*.css", vendor_styles);
    gulp.watch("src/js/**/*.js", scripts);
    gulp.watch("src/plugins/**/*.js", vendor_scripts);
    gulp.watch("./*.html").on("change", browserSync.reload);
}
exports.default = gulp.series(
    gulp.parallel([style, bootstrapstyle]),
    gulp.parallel([vendor_styles, vendor_scripts, scripts]),
    // compress_imgs,
    watchs,
);


// async function compress_imgs() {g
//     return src("src/images/**/*.*").pipe(imagemin([
// 	imagemin.gifsicle({interlaced: true}),
// 	imagemin.mozjpeg({quality: 75, progressive: true}),
// 	imagemin.optipng({optimizationLevel: 5}),
// 	imagemin.svgo({
// 		plugins: [
// 			{removeViewBox: true},
// 			{cleanupIDs: false}
// 		]
// 	})
// ])).pipe(gulp.dest("dist/images")) .pipe(browserSync.stream());
// }
async function vendor_styles() {
    return src("src/plugins/**/*.css")
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(concat("vendor.min.css"))
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}
async function vendor_scripts() {
    return src("src/plugins/**/*.js")
        .pipe(uglify())
        .pipe(concat("vendor.min.js"))
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
}