const https = require('https')
const fs = require('fs')
const path = require('path')

const theme = require('../data/theme.json')

const faviconUrl = theme.default.favicon_url
const staticDir = path.join(__dirname, '../static')
const outputPath = path.join(staticDir, 'favicon-32x32.png')
const headConfigPath = path.join(__dirname, '../config/head.config.js')

function downloadFavicon () {
  return new Promise((resolve, reject) => {
    console.log(`Downloading favicon from: ${faviconUrl}`)

    https.get(faviconUrl, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(outputPath)
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Favicon saved to: ${outputPath}`)
          resolve()
        })
      } else {
        reject(new Error(`Failed to download favicon: ${response.statusCode}`))
      }
    }).on('error', (err) => {
      reject(err)
    })
  })
}

function updateHeadConfig () {
  console.log('Updating head.config.js...')

  let content = fs.readFileSync(headConfigPath, 'utf8')

  // Replace the favicon link
  content = content.replace(
    /\{\s*rel:\s*'icon',\s*type:\s*'image\/x-icon',\s*href:\s*'\/favicon\.ico'\s*\}/,
    "{ rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' }"
  )

  fs.writeFileSync(headConfigPath, content)
  console.log('head.config.js updated successfully!')
}

async function main () {
  try {
    await downloadFavicon()
    updateHeadConfig()
    console.log('\nFavicon setup complete!')
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

main()
