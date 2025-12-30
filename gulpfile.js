/**
 * Gulp configuration file for Take Care Of My Dogs website
 * Processes CSS and JS files for development and production
 */

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const pkg = require('./package.json');

// File paths
const paths = {
    styles: {
        src: 'assets/css/styles.css',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'assets/js/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'assets/images/**/*.{jpg,jpeg,png,gif,svg}',
        dest: 'dist/images/'
    },
    html: {
        src: '*.html',
        dest: 'dist/'
    },
    pwa: {
        sw: 'sw.js',
        manifest: 'manifest.json',
        icons: 'assets/icons/**/*.png',
        iconsDest: 'dist/icons/'
    }
};

// Clean dist directory
function clean() {
    return del(['dist']);
}

// Process CSS files
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.styles.dest)) // Save unminified version
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// Process JavaScript files
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.scripts.dest)) // Save unminified version
        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

// Copy images with explicit encoding
function images() {
    return gulp.src(paths.images.src, { encoding: false })
        .pipe(gulp.dest(paths.images.dest));
}

// Copy service worker to dist root
function serviceWorker() {
    return gulp.src(paths.pwa.sw)
        .pipe(gulp.dest('dist/'));
}

// Copy manifest to dist root
function manifest() {
    return gulp.src(paths.pwa.manifest)
        .pipe(gulp.dest('dist/'));
}

// Copy PWA icons
function pwaIcons() {
    return gulp.src(paths.pwa.icons, { encoding: false })
        .pipe(gulp.dest(paths.pwa.iconsDest));
}

// Process HTML files
function html() {
    const version = pkg.version;
    return gulp.src(paths.html.src)
        .pipe(replace('assets/css/styles.css', `css/styles.min.css?v=${version}`))
        .pipe(replace('assets/js/main.js', `js/main.min.js?v=${version}`))
        .pipe(replace('href="manifest.json"', `href="manifest.json?v=${version}"`))
        .pipe(replace('assets/images/', 'images/'))
        .pipe(replace('assets/icons/', 'icons/'))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
        }))
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

// Watch files for changes
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });

    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.pwa.sw, serviceWorker);
    gulp.watch(paths.pwa.manifest, manifest);
    gulp.watch(paths.pwa.icons, pwaIcons);
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, images, html, serviceWorker, manifest, pwaIcons));
const dev = gulp.series(build, watch);

// Export tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.html = html;
exports.serviceWorker = serviceWorker;
exports.manifest = manifest;
exports.pwaIcons = pwaIcons;
exports.watch = watch;
exports.build = build;
exports.default = dev;
