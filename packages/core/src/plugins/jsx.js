import unified from 'unified'
import parse from 'rehype-parse'
import vfile from 'vfile'
import hastToBabelAst from 'hast-util-to-babel-ast'
import { transformFromAstSync, createConfigItem } from '@babel/core'
import stripAttribute from '../babelPlugins/stripAttribute'

export default (code, config, state = {}) => {
  const filePath = state.filePath || 'unknown'
  const hastTree = unified()
    .use(parse, {
      fragment: true,
      space: 'svg',
      emitParseErrors: true,
      duplicateAttribute: false,
    })
    .parse(vfile({ path: filePath, contents: code }))

  const babelTree = hastToBabelAst(hastTree)

  const { code: transformedCode } = transformFromAstSync(babelTree, code, {
    plugins: [
      createConfigItem([stripAttribute, { attribute: 'xmlns' }, 'removeXmlns']),
      createConfigItem([stripAttribute, { attribute: 'width' }]),
    ],
    filename: filePath,
    babelrc: false,
    configFile: false,
  })

  return transformedCode
}
