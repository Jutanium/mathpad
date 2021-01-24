//From MathKi
const signAlwaysCharacter = '+'
import { evaluate } from 'mathjs'
// Used by the Latex component to parse its expression input. Replaces asterisk-wrapped variables with their value,
// and evaluates #-wrapped expressions rounding to the specified number of decimal places using mathjs.
// For example, given the arguments:
// latex: 2^{*a*} + #sin(pi/*b*)# + #e#
// varObj: {'a': 4, 'b': 2}
// decimals: 2
// The function will return '2^{4.26} + 1 + 2.72'.
// If a computed expression begins with the signAlwaysCharacter, the function will prefix the evaluated expression with a +
// sign if the expression is positive. e.g. #+*x*# will return '+2' if x = 2 and '-2' if x = -2.
export function parse(latex, varObj, decimals) {
  for (let varName in varObj) {
    latex = latex.replace(new RegExp(`\\*${varName}\\*`, 'g'), varObj[varName])
  }
  const expr = /#([^#]+)#/g
  latex = latex.replace(expr, (match, captureGroup) => {
    let toEval = captureGroup
    const signAlways = captureGroup.substring(0, 2) === signAlwaysCharacter + ' '
    if (signAlways) toEval = captureGroup.substring(1)

    // const evaluated = math.format(math.eval(toEval), {notation: 'auto', exponential: {lower: 1e-10, upper: 1e+10}})
    const evaluated = Number(evaluate(toEval).toFixed(decimals))
    if (signAlways && evaluated > 0) {
      return '+ ' + evaluated
    }
    return evaluated
  })
  return latex
}

// Looks through raw Latex (probably inputed through an editable LaTeX field)
// and wraps instances of the given variable with asterisks.
// Beware: don't pass in e or i for the variable if you expect the e or i literal to be in the latex.
export function wrapVariables(variable, latex) {
  // console.log('1--' + latex)
  // Keywords that we don't want to search through for our variable. (e.g. we don't want to find our iterator n in ln)
  const keywords = ['left', 'right', 'frac', 'sin', 'cos', 'tan', 'arccos', 'arctan', 'arcsin', 'arg', 'cosh', 'cot', 'coth', 'csc', 'deg', 'det', 'dim', 'exp', 'gcd', 'hom', 'inf', 'injlim', 'ker', 'lg', 'lim', 'liminf', 'limsup', 'ln', 'log', 'max', 'min', 'Pr', 'projlim', 'sec', 'sinh', 'sup', 'tanh', 'varinjlim', 'varprojlim', 'varliminf', 'varlimsup']
  /*
  let keywordsRemoved = latex
  for (let keyword of keywords) {
    keywordsRemoved = keywordsRemoved.replace(keyword, Array(keyword.length + 1).join(' ')) // Replace our keywords with empty spaces
  }

  let indexes = [] // Positions of our variable in the array
  for (let i = keywordsRemoved.length - 1; i >= 0; i--) {
    if (keywordsRemoved[i] === variable) {
      indexes.push(i)
    }
  }

  for (let i of indexes) { // Put asterisks around our variable
    latex = `${latex.substring(0, i)}*${variable}*${latex.substring(i + 1)}`
  }
  The above code was from before I found "The Best RegEx Trick Ever http://www.rexegg.com/regex-best-trick.html#thetrick" */
  // Search for all of the keywords (this "gets them out of the way"). Also search for the variable, and that's the one we
  // capture.
  const regex = `${keywords.join('|')}|(${variable})`
  // If our capture group (p1) is defined, we've caught our variable. Otherwise, replace what we've found with itself.
  latex = latex.replace(new RegExp(regex, 'g'), (match, p1) => {
    return p1 ? `*${p1}*` : match
  })
  // Turn 2*x* into 2 * *x*
  latex = latex.replace(new RegExp('([a-zA-Z0-9]|\\*' + variable + '\\*)(\\*' + variable + '\\*)', 'g'), '$1\\cdot $2')
  // Turn x*2* into *x* * 2
  latex = latex.replace(new RegExp('(\\*' + variable + '\\*)([a-zA-Z0-9]|\\*' + variable + '\\*)', 'g'), '$1\\cdot $2')
  // Turn e^x into e^{x{}}
  latex = latex.replace(new RegExp('(\\^)(\\*' + variable + '\\*)', 'g'), '$1{$2}')
  return latex
}

// Parse the latex that Mathquill gives us so that it can be used to mathjs.eval()
// Credit to Dan Jutan https://github.com/Jutanium/ComplexNumberGrapher/blob/gh-pages/js/main.js. Oh wait, that's me
export function texToMath(latex) {
  // TODO: More validation
  return latex
    .replace(/\\frac\{(.+)\}\{(.+)\}/, '($1)/($2)') // replace \frac{1}{2} notation
    .replace(/\\left/g, '') // get rid of \left
    .replace(/\\right/g, '') // get rid of \right
    .replace(/\{(.+)\}/g, '($1)') // replace {whatever} with (whatever)
    .replace(/\\cdot/g, '*') // replace bullet multiplication sign with *
    .replace(/\\ /g, '') // get rid of spaces, which are backslashes followed by spaces in latex
    .replace(/\\/g, '') // get rid of remaining backslashes
    .replace(/ln\((.+)\)/g, 'log($1,e)') // make ln work
    .replace(/arcsin\((.+)\)/g, 'asin($1)') // inverse trig functions
    .replace(/arccos\((.+)\)/g, 'acos($1)')
    .replace(/arctan\((.+)\)/g, 'atan($1)')
    // .replace(/pi/g, '(pi)') // self contain pi
    // self contain e's, i's, and z's that aren't part of function names. (works since no functions have i, z, or e
    // followed by another i, z, or e. TODO: make work for ceil(x)
    .replace(/(i|z|pi|e)(?=[0-9]|i|z|pi|e|\s|\))/g, '($1)')
}

export function stripAsterisks(latex, variable, replacement) {
  return latex.replace(new RegExp(`\\*${variable}\\*`, 'g'), typeof (replacement) !== 'undefined' ? replacement : variable)
}

