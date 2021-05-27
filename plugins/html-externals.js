export default function htmlTemplate (externals) {
  return ({ attributes, files, meta, publicPath, title }) => {
    let scripts = [...(files.js || [])]
    let links = [...(files.css || [])]

    // externals = [{ type: 'js', file: '//xxxx1.js', pos: 'before' }, { type: 'css', file: '//xxxx1.css' }]
    if (Array.isArray(externals)) {
      const beforeLinks = []
      const beforeScripts = []
      externals.forEach((node) => {
        let fileList
        const isCssFile = node.type === 'css'
        if (node.pos === 'before') {
          fileList = isCssFile ? beforeLinks : beforeScripts
        } else {
          fileList = isCssFile ? links : scripts
        }
        fileList.push({ fileName: node.src || (publicPath + node.file) })
      })
      scripts = beforeScripts.concat(scripts)
      links = beforeLinks.concat(links)
    }

    scripts = scripts.map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.script)
      return `<script src="${fileName}"${attrs}></script>`
    }).join('\n')

    links = links.map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link)
      return `<link href="${fileName}" rel="stylesheet"${attrs}>`
    }).join('\n')

    const metas = meta
      .map((input) => {
        const attrs = makeHtmlAttributes(input)
        return `<meta${attrs}>`
      })
      .join('\n')

    return `
  <!doctype html>
  <html${makeHtmlAttributes(attributes.html)}>
    <head>
      ${metas}
      <title>${title}</title>
      ${links}
    </head>
    <body>
      <div>
        <canvas id="canvas"></canvas>
        <button onclick="draw(1)">绘图</button>
        <button onclick="boom(1)">爆炸</button>
      </div>
      <div>
        <canvas id="canvas2"></canvas>
        <button onclick="draw(2)">绘图</button>
        <button onclick="boom(2)">爆炸</button>
      </div>
      ${scripts}
    </body>
  </html>`
  }
}

function makeHtmlAttributes (attributes) {
  if (!attributes) {
    return ''
  }

  const keys = Object.keys(attributes)
  // eslint-disable-next-line no-param-reassign
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '')
}