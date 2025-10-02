//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  arrowParens: 'always',
  bracketSameLine: false,
  objectWrap: 'preserve',
  bracketSpacing: true,
  semi: true,
  experimentalOperatorPosition: 'end',
  experimentalTernaries: true,
  singleQuote: true,
  jsxSingleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  singleAttributePerLine: false,
  htmlWhitespaceSensitivity: 'css',
  vueIndentScriptAndStyle: false,
  proseWrap: 'preserve',
  insertPragma: false,
  printWidth: 100,
  requirePragma: false,
  tabWidth: 2,
  useTabs: false,
  embeddedLanguageFormatting: 'auto',
};

export default config;
