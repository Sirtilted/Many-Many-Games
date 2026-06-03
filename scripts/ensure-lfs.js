const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

function exec(command, options = {}) {
  return execSync(command, { stdio: 'inherit', ...options });
}

function exists(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function download(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}, status ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (error) => {
        fs.unlinkSync(destination);
        reject(error);
      });
  });
}

function getDownloadUrl() {
  const platform = os.platform();
  const arch = os.arch();

  if (platform === 'linux' && arch === 'x64') {
    return 'https://github.com/git-lfs/git-lfs/releases/download/v3.4.0/git-lfs-linux-amd64-v3.4.0.tar.gz';
  }
  if (platform === 'darwin' && arch === 'x64') {
    return 'https://github.com/git-lfs/git-lfs/releases/download/v3.4.0/git-lfs-darwin-amd64-v3.4.0.tar.gz';
  }
  if (platform === 'darwin' && arch === 'arm64') {
    return 'https://github.com/git-lfs/git-lfs/releases/download/v3.4.0/git-lfs-darwin-arm64-v3.4.0.tar.gz';
  }

  throw new Error(`Git LFS installer not available for ${platform} ${arch}`);
}

async function main() {
  const localLfs = path.resolve('.gitlfs-bin', process.platform === 'win32' ? 'git-lfs.exe' : 'git-lfs');
  const hasGitLfs = exists('git-lfs');

  if (!hasGitLfs && !fs.existsSync(localLfs)) {
    console.log('Git LFS not found. Downloading local Git LFS binary...');
    const url = getDownloadUrl();
    const tempDir = path.resolve('.gitlfs-temp');
    const archivePath = path.join(tempDir, 'git-lfs.tar.gz');

    fs.mkdirSync(tempDir, { recursive: true });
    await download(url, archivePath);

    exec(`tar -xzf ${archivePath} -C ${tempDir}`);
    const extracted = fs.readdirSync(tempDir).find((name) => name.startsWith('git-lfs')); // folder name
    const extractedPath = path.join(tempDir, extracted, 'git-lfs');
    fs.mkdirSync(path.dirname(localLfs), { recursive: true });
    fs.copyFileSync(extractedPath, localLfs);
    fs.chmodSync(localLfs, 0o755);
  }

  const lfsCommand = hasGitLfs ? 'git-lfs' : localLfs;
  console.log(`Using Git LFS command: ${lfsCommand}`);

  try {
    exec(`${lfsCommand} version`);
  } catch (err) {
    console.error('Unable to run Git LFS version check.', err);
    process.exit(1);
  }

  try {
    exec(`${lfsCommand} install --skip-repo`);
  } catch (err) {
    console.error('Git LFS install failed.', err);
    process.exit(1);
  }

  try {
    exec(`${lfsCommand} pull`);
  } catch (err) {
    console.error('Git LFS pull failed.', err);
    process.exit(1);
  }

  console.log('Git LFS pull completed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
