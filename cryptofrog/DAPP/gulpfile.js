/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 * $ npm install --save-dev jshint gulp-jshint
 * $ [sudo] gem install sass
 * Author: Shubhabrata Das <shudas@deloitte.com>
 */

// Load plugins
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  del = require('del'),
  mainBowerFiles = require('main-bower-files'),
  templateCache = require("gulp-angular-templatecache"),
  jsoncombine = require("gulp-jsoncombine"),
  htmlreplace = require('gulp-html-replace'),
  sourcemaps = require("gulp-sourcemaps");
  browserSync = require('browser-sync').create(),
  url = require("url"),
  gulpUtil = require("gulp-util");

// Code to prevent error from interrupting the watch task
// https://github.com/wincent/corpus/commit/85c31dae7e7942e3ba4fe5c79bdbaf20e93f52d0#diff-b9e12334e9eafd8341a6107dd98510c9R25
var watching = false;
function handleStreamError(stream) {
  stream.on("error", function(error) {
    gulpUtil.log(gulpUtil.colors.red(error.message));
    gulpUtil.log(error.stack);
    if (watching) {
      gulpUtil.log(gulpUtil.colors.yellow('[aborting]'));
      stream.end();
    } else {
      gulpUtil.log(gulpUtil.colors.yellow('[exiting]'));
      process.exit(1);
    }
  });
  return stream;
}

// Styles
gulp.task('styles', function () {
  return gulp.src(['app/assets/css/app.scss', 'app/assets/css/variables.scss', 'app/js/**/*.scss','app/assets/css/main.css','app/assets/css/wonder.css'])
    .pipe(sourcemaps.init())
    .pipe(handleStreamError(sass()))
    .pipe(concat("app.css"))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(handleStreamError(cssnano({
      zindex: false
    })))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task("jshint", function() {
  gulp.src(['app/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Scripts
gulp.task('scripts', ['template', 'jshint'], function () {
  var src = gulp.src(['app/js/**/*.js', 'app/.tmp/templates.js'], { base: "app" })
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(handleStreamError(uglify({
      outSourceMap: true
    })))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('3rdpartycss', function () {

  gulp.src(mainBowerFiles(["**/*.css"], {
      "overrides": {
        "bootstrap": {
          "main": [
            "dist/css/bootstrap.css",
            "dist/css/bootstrap-theme.css",
          ]
        }
      }
    }))
    .pipe(concat('thirdparty.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano({
      zindex: false
    }))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('libs', function () {
  return gulp.src(mainBowerFiles("**/*.js"))
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('3rdpartyscripts', function () {
  return gulp.src(mainBowerFiles("**/*.js"))
    .pipe(concat('thirdparty.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

// Images
gulp.task('images', function () {
  return gulp.src('app/assets/img/**/*')
    // .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('template', function () {
  return gulp.src(['app/js/**/*.html'])
    .pipe(templateCache({
      module: "dashboard",
      transformUrl: function (url) {
        return "js/" + url;
      }
    }))
    .pipe(gulp.dest("app/.tmp"))
});

gulp.task("copy", ["copyindex", "copyservices", "copyfonts"], function () {
  return gulp.src(["app/.xsaccess", "app/.xsprivileges", ])
    .pipe(gulp.dest("dist"));
});

gulp.task("copyindex", function () {
  return gulp.src(["app/index.html"])
    .pipe(htmlreplace({
      'app-css': 'assets/css/app.min.css',
      'app-js': 'scripts/app.min.js',
      'third-party-css': 'assets/css/thirdparty.min.css',
      'third-party-js': 'scripts/thirdparty.min.js'
    }))
    .pipe(gulp.dest("dist"));
});

gulp.task("copyservices", function () {
  return gulp.src(["app/services/*.json"])
    .pipe(gulp.dest("dist/services"));
});

gulp.task("copyfonts", function() {
	return gulp.src([ 'app/bower_components/bootstrap/fonts/*', 'app/assets/font/*' ])
		.pipe(gulp.dest("dist/assets/fonts"));
});

gulp.task("copyoffline", ["default"], function () {
  return gulp.src("app/index.html")
    .pipe(htmlreplace({
      'app-css': 'assets/css/app.css',
      'app-js': 'scripts/app.min.js',
      'third-party-css': 'assets/css/thirdparty.min.css',
      'third-party-js': 'scripts/thirdparty.min.js',
      'offline-data': {
        src: gulp.src("app/services/*.json")
          .pipe(jsoncombine("offline.js", function (data) {
            return new Buffer(JSON.stringify(data, null, 4), "utf-8");
          })),
        tpl: `
        <script>
        (function() {
          var _OFFLINE_DATA = %s;

          angular.module("dashboard.query-service", [])
              .factory("queryService", [ "$q", function($q) {
                function getOfflineData(key) {
                  return $q(function(resolve, reject) {
                    resolve({ data: _OFFLINE_DATA[key] });
                  });
                };

                return {
                    getMarketMetrics: getOfflineData.bind(this, 'marketMetrics'),
                    getAssetMetrics: getOfflineData.bind(this, 'assetMetrics'),
                    getHeadcount: getOfflineData.bind(this, 'headcount'),
                    getFinancialResults: getOfflineData.bind(this, 'financialResults'),
                    getSafetyMetrics: getOfflineData.bind(this, 'safety'),
                    getUnitCost: getOfflineData.bind(this, 'unitCost'),
                    getVolumeSummary: getOfflineData.bind(this, 'volumeSummary'),
                    getVolumeSummaryMetric: getOfflineData.bind(this, 'volumeSummaryMetric'),
                    getExecutiveSummary: getOfflineData.bind(this, 'executiveSummary')
                };
              }
            ]);
        })();
        </script>`
      }
    }))
    .pipe(rename("offline.html"))
    .pipe(gulp.dest("dist"));
})

// Clean
gulp.task('clean', function () {
  return del(['dist', ".tmp", "app/.tmp"]);
});

// Default task
gulp.task('default', ['clean'], function () {
  gulp.start('styles', 'scripts', 'libs','3rdpartyscripts', '3rdpartycss', 'images', "copy");
});

// Watch
gulp.task("watch-common", function () {
  watching = true;

  // Watch .scss files
  gulp.watch(['app/assets/**/*.scss', 'app/js/**/*.scss'], ['styles']);
  // Watch .js files
  gulp.watch(['app/js/**/*.js', "app/js/**/*.html"], ['scripts']);
  // Watch image files
  gulp.watch('app/assets/img/**/*', ['images']);
  // watch the index and json files
  gulp.watch(["app/index.html", "app/services/*.json"], ["copy"]);
});

gulp.task('watch', [ "watch-common" ], function () {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: 'dist'
    },
    browser: "chrome"
  });

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});

// Watch
gulp.task('watch-d1h', [ "watch-common" ], function () {
  var proxy = require('proxy-middleware');

  var servicesProxyOpts = url.parse("http://hansbxcgy000.network.sbx:8080/suncor/sam/app/manager/manager1/dashboard/services");
  servicesProxyOpts.route = "/services";

  var sapProxyOpts = url.parse("http://hansbxcgy000.network.sbx:8080/sap");
  sapProxyOpts.route = "/sap";

  browserSync.init({
    port: 8000,
    middleware: [
      proxy(servicesProxyOpts),
      proxy(sapProxyOpts)
    ],
    server: {
      baseDir: 'dist'
    },
    browser: "chrome",
    startPath: "/sap/hana/xs/formLogin/login.html?x-sap-origin-location="
  });

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', browserSync.reload);
});
