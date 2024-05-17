"use strict"; //Using a strong mode

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const fileinclude = require("gulp-file-include");

// Static server
gulp.task("server", function () {
   browserSync.init({
      open: false,
      server: {
         baseDir: "./dist",
      },
   });
});

//Compress, add min prefix to css file, add autoprefix then clean css, put its in css folder and reload browsersync plugin
gulp.task("styles", function () {
   return gulp
      .src("./src/sass/**/*.+(scss|sass)")
      .pipe(sourcemaps.init())
      .pipe(sass.sync({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(autoprefixer())
      .pipe(cleanCSS({ compatibility: "ie8" }))
      .pipe(
         rename({
            prefix: "",
            suffix: ".min",
         }),
      )
      .pipe(sourcemaps.write(""))
      .pipe(gulp.dest("./dist/css"))
      .pipe(browserSync.stream());
});

//Wath for changes of sass/scss files and html
gulp.task("watch", function () {
   gulp.watch("./src/sass/**/*.+(scss|sass|css)", gulp.parallel("styles"));
   gulp.watch("./src/**/*.html").on("change", browserSync.reload);
   gulp.watch("./src/**/*.html").on("change", gulp.parallel("html"));
   gulp.watch("./src/js/**/*.js").on("change", gulp.parallel("scripts"));
});

gulp.task("html", function () {
   return gulp
      .src("./src/*.html")
      .pipe(
         // For cutting main html file into smoller files
         fileinclude({
            prefix: "@@",
            basepath: "@file",
         }),
      )
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("./dist"));
});

gulp.task("scripts", function () {
   return gulp
      .src("./src/**/*.js")
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write(""))
      .pipe(gulp.dest("./dist/"));
});

gulp.task("fonts", function () {
   return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./dist/fonts"));
});

gulp.task("img", function () {
   return gulp.src("./src/images/**/*").pipe(imagemin()).pipe(gulp.dest("./dist/images"));
});

//To run all tasks with only one command "gulp"
gulp.task("default", gulp.parallel("server", "styles", "watch", "html", "scripts", "fonts", "img"));
