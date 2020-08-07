const gulp = require('gulp');
const fs = require('fs');

/* Create config from .env */
gulp.task('build:environment', (done) => {
  let defEnv = fs.readFileSync("./.env.defaults", "utf8").split('\n');
  let devEnv = fs.readFileSync("./.env.development", "utf8").split('\n');
  let prodEnv = fs.readFileSync("./.env.production", "utf8").split('\n');

  let list = defEnv.concat(devEnv).concat(prodEnv)
    .map(el => el.split(/\s*=\s*/)[0].trim())
    .filter(a => !!a);
  let distentSet = [...new Set(list)];

  let out = ["/*Automation create*/"];
  for (let i = 0; i < distentSet.length; i++) {
    let n = distentSet[i];
    out.push(`export const ${n} = process.env.${n};`);
  }

  out.push(`export default {${distentSet.join(',')}};`)

  fs.writeFile(
    `./src/Config.js`,
    out.join("\n"),
    done
  );
});
