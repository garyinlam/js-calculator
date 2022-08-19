const numbers = document.querySelectorAll(".button-container__button--number");
const display = document.getElementById("display-box");
const result = document.getElementById("result-box");
const clear = document.getElementsByClassName("button-container__button--clear")[0];
const brackets = document.querySelector(".brackets").children;

//operators and their associated typed version
const add = document.getElementById("add");
add.operator = "+";
const minus = document.getElementById("minus");
minus.operator = "-";
const multiply = document.getElementById("multiply");
multiply.operator = "*";
const divide = document.getElementById("divide");
divide.operator = "/";

const prev = document.getElementById("prev");
const equals = document.getElementById("equals");
const back = document.getElementById("back");

const history = document.getElementById("history");

const helpButton = document.querySelector(".header__help-button");
const helpList = document.querySelector(".help-menu");

let prevAns = 0;

//evaluate the given equation
const evaluateEquation = (equation) => {
  //check for brackets first
  if(equation.indexOf("(") != -1) {
    //find corresponding closing bracket
    let start = equation.indexOf("(");

    if(start != 0){
      if(!isNaN(equation[start-1])) {
        equation = equation.slice(0,start)+"*"+equation.slice(start);
        start++;
      }
    }

    let end = start;
    let bracketLevel = 0;
    for (let i = start+1; i < equation.length; i++){
      //if found an opening bracket first then ignore next closing bracket
      if(equation.charAt(i) == "(") {
        bracketLevel++;
      } else if (equation.charAt(i) == ")" && bracketLevel > 0){
        bracketLevel--;
      } else if (equation.charAt(i) == ")" && bracketLevel == 0) {
        end = i;
        //stop loop once matching bracket is found
        i = equation.length
      }
    }
    // recursive call, evaluate brackets first then put answer back in equation
    return evaluateEquation(equation.slice(0,start) + evaluateEquation(equation.slice(start+1,end)) + equation.slice(end+1));
  //look for +/- first so * and / evaluate first
  } else if (equation.indexOf("+") != -1) { 
    // TODO: fix *+x issue
    // look left of +-, if */ then move left one and evaluate lhs */ rhs
    const operatorPos = equation.lastIndexOf("+"); 
    if (isDivideTimes(equation[operatorPos-1])) {
      if (equation[operatorPos-1] == '*') {
        return evaluateEquation(equation.slice(0,operatorPos-1)) * evaluateEquation(equation.slice(operatorPos));
      } else {
        return evaluateEquation(equation.slice(0,operatorPos-1)) / evaluateEquation(equation.slice(operatorPos));
      }
    } else {
      return evaluateEquation(equation.slice(0,operatorPos)) + evaluateEquation(equation.slice(operatorPos+1));
    }
  } else if (equation.indexOf("-") != -1) {
    const operatorPos = equation.lastIndexOf("-");
    if (isDivideTimes(equation[operatorPos-1])) {
      if (equation[operatorPos-1] == '*') {
        return evaluateEquation(equation.slice(0,operatorPos-1)) * evaluateEquation(equation.slice(operatorPos));
      } else {
        return evaluateEquation(equation.slice(0,operatorPos-1)) / evaluateEquation(equation.slice(operatorPos));
      }
    } else {
      return evaluateEquation(equation.slice(0,operatorPos)) - evaluateEquation(equation.slice(operatorPos+1));
    }
  } else if (equation.indexOf("/") != -1) {
    const operatorPos = equation.lastIndexOf("/");
    return evaluateEquation(equation.slice(0,operatorPos)) / evaluateEquation(equation.slice(operatorPos+1));
  } else if (equation.indexOf("*") != -1) {
    const operatorPos = equation.lastIndexOf("*");
    return evaluateEquation(equation.slice(0,operatorPos)) * evaluateEquation(equation.slice(operatorPos+1));
  // not operator, return number
  } else {
    return Number(equation);
  }
}

const isDivideTimes = (str) => str == '/' || str == '*';

//methods used for event listeners
const writeCurrent = (button) => {
  display.innerHTML += button;
}

const displayAnswer = () => {
  const equation = display.innerHTML;
  const answer = evaluateEquation(equation);
  prevAns = Number(answer.toFixed(20));
  history.innerHTML += `<p>${equation}<br>= ${prevAns}</p>`;
  result.innerHTML = prevAns;
}

const clearCurrent = () => {
  display.innerHTML = "";
  result.innerHTML = "";
}

const backspace = () => {
  let output = display.innerHTML;
  output = output.slice(0,-1);
  display.innerHTML = output;
}

const previousAnswer = () => {
  if (!(prevAns+"").includes("e")) {
    display.innerHTML += prevAns;
  } else {
    alert("Cannot insert previous answer due to scientific notation");
  }
}

//add event listeners

numbers.forEach((number) => {
  number.addEventListener("click", (e) => writeCurrent(e.target.innerHTML));
});

clear.addEventListener("click", clearCurrent);

for (let index = 0; index < brackets.length; index++) {
  brackets[index].addEventListener("click", (e) => writeCurrent(e.target.innerHTML));
}

add.addEventListener("click", (e) => writeCurrent(e.target.operator));
minus.addEventListener("click", (e) => writeCurrent(e.target.operator));
divide.addEventListener("click", (e) => {
  if (!isDivideTimes(display.innerHTML.slice(-1))){
    writeCurrent(e.target.operator);
  }
});
multiply.addEventListener("click", (e) => {
  if (!isDivideTimes(display.innerHTML.slice(-1))){
    writeCurrent(e.target.operator);
  }
});

prev.addEventListener("click", previousAnswer);
equals.addEventListener("click", displayAnswer);
back.addEventListener("click", backspace);


history.addEventListener("click", (e) => {
  if (e.target.tagName === "P") {
    const parts = e.target.innerHTML.split(" ");
    prevAns = Number(parts[1]);
    display.innerHTML = parts[0].slice(0,-5);
    result.innerHTML = prevAns;
  }
})

helpButton.addEventListener("click", () => helpList.classList.toggle("show"));

document.addEventListener('keydown', (e) => {
  const validKeys = "+-().";
  if(!isNaN(e.key)) {
    writeCurrent(e.key);
  } else if(validKeys.includes(e.key)) {
    writeCurrent(e.key);
  } else if(e.key == "*" || e.key=="/") {
    if (!isDivideTimes(display.innerHTML.slice(-1))){
      writeCurrent(e.key);
    };
  } else if (e.key == "Enter" || e.key == "=") {
    displayAnswer();
  } else if(e.key == "Backspace") {
    backspace();
  } else if(e.key == "Escape") {
    clearCurrent();
  } else if(e.key == "a") {
    previousAnswer();
  }
});