/* eslint-disable import/no-extraneous-dependencies */
import spawn from 'cross-spawn'
import { config } from 'dotenv-flow'

config({
  silent: true,
})

const cmd = process.argv.slice(2).join(' ')
console.info('command:', cmd)
console.info('platform:', process.platform)

const child = spawn(cmd, {
  stdio: 'inherit',
  shell: process.platform === 'darwin',
})

child.on('close', (code) => {
  process.exit(code)
})
