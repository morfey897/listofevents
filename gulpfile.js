const gulp = require('gulp');
const fs = require('fs');
const argv = require('yargs').argv;

/*
* Function to increase version
*/
function createVersion(release, version) {
  const parts = version.split(".");
  let index = parts.length - 1;
  switch (release) {
    case "major":
      index = 0;
      break;
    case "minor":
      index = 1;
      break;
    case "patch":
      index = 2;
      break;
  }

  parts[index] = parseInt(parts[index]) + 1;
  for (let i = index + 1; i < parts.length; i++) {
    parts[i] = 0;
  }
  return parts.join(".");
}

/*
* Build version 
* version=major|minor|patch
* target - name of variable fron .env
*/
gulp.task('build:version', (done) => {
  console.log(argv);
  const VER_REG = new RegExp(`^\\s*${argv.target}\\s*=['"]([\\.\\d]+)['"]$`);
  let env = fs.readFileSync("./.env", "utf8").split('\n');

  for (let i = 0; i < env.length; i++) {
    let str = env[i];
    let match = str.match(VER_REG);
    if (match && match.length) {
      env[i] = str.replace(match[1], createVersion(argv.release, match[1]));
      break;
    }
  }

  fs.writeFile(
    "./.env",
    env.join("\n"),
    done
  );
});
