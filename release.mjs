import { readFile, writeFile } from 'fs/promises'
import { spawn } from 'child_process'

const step = (msg, task) => {
  console.log(msg)
  return Promise.all([task, new Promise(r => setTimeout(r, 500))])
}

const exec = (cmd) => {
  const [c, ...args] = cmd.split(' ').filter(Boolean)

  return new Promise((r, q) => {
    spawn(c, args, {
      stdio: 'inherit'
    }).on('error', q).on('close', r)
  })
}

const [type] = process.argv.slice(2)



const version = await step('bumping version', (async () => {
  const pkg = await readFile('./package.json').then(x => JSON.parse(x.toString()))

  const bumpVersion = (version) => {
    const [major, minor, patch] = version.split('.').map(x => parseInt(x))
    switch(type) {
      case 'major':
        return [major + 1, 0, 0].join('.')
      case 'minor':
        return [major, minor + 1, 0].join('.')
      case 'nobump':
        return version
      default:
        return [major, minor, patch + 1].join('.')
    }
  }
  
  pkg.version = bumpVersion(pkg.version)
  await writeFile('package.json', JSON.stringify(pkg, undefined, 2))
  return pkg.version
})())

await step(`Building ${version}`, exec('yarn build'))
await step(`Releasing ${version}`, exec('scp -r dist/. fyrstelin:music-quiz'))
