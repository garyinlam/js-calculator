const evaluateEquation = (equation) => {
  if(equation.indexOf("(") != -1) {
    const start = equation.indexOf("(");
    let end = start;
    let bracketLevel = 0;
    for (let i = start+1; i < equation.length; i++){
      if(equation.charAt(i) == "(") {
        bracketLevel++;
      } else if (equation.charAt(i) == ")" && bracketLevel > 0){
        bracketLevel--;
      } else if (equation.charAt(i) == ")" && bracketLevel == 0) {
        end = i;
        i = equation.length
      }
    }
    return evaluateEquation(equation.slice(0,start) + evaluateEquation(equation.slice(start+1,end)) + equation.slice(end+1));
  } else if (equation.indexOf("+") != -1) {
    const operatorPos = equation.lastIndexOf("+");
    return evaluateEquation(equation.slice(0,operatorPos)) + evaluateEquation(equation.slice(operatorPos+1));
  } else if (equation.indexOf("-") != -1) {
    const operatorPos = equation.lastIndexOf("-");
    return evaluateEquation(equation.slice(0,operatorPos)) - evaluateEquation(equation.slice(operatorPos+1));
  } else if (equation.indexOf("/") != -1) {
    const operatorPos = equation.lastIndexOf("/");
    return evaluateEquation(equation.slice(0,operatorPos)) / evaluateEquation(equation.slice(operatorPos+1));
  } else if (equation.indexOf("*") != -1) {
    const operatorPos = equation.lastIndexOf("*");
    return evaluateEquation(equation.slice(0,operatorPos)) * evaluateEquation(equation.slice(operatorPos+1));
  } else {
    return Number(equation);
  }
}