const display = document.getElementById('display');
const memoryDisplay = document.getElementById('memory-display');
const buttons = document.querySelectorAll('.btn');

let currentInput = "";
let memory = 0;
let lastResult = 0;

function updateDisplay(value) {
  display.value = value;
}

function updateMemoryDisplay() {
  memoryDisplay.textContent = `M: ${memory}`;
}

function handleOperation(value) {
  if (currentInput === "" && lastResult !== 0) {
    currentInput = lastResult + value;
  } else if (!isNaN(currentInput.slice(-1))) {
    currentInput += value;
  }
  updateDisplay(currentInput);
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.getAttribute('data-value');

    switch (button.id) {
      case 'clear':
        currentInput = "";
        updateDisplay("");
        break;
      case 'backspace':
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput);
        break;
      case 'equals':
        try {
          let expression = currentInput
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/π/g, Math.PI.toString());

          if (expression.includes('%')) {
            const parts = expression.split(/([\+\-\*\/])/);
            const lastNum = parseFloat(parts[parts.length - 1]);
            const percentValue = lastNum / 100;

            if (parts.length > 1) {
              const operator = parts[parts.length - 2];
              const firstNum = parseFloat(parts[parts.length - 3] || lastResult);

              switch (operator) {
                case '+': expression = firstNum + (firstNum * percentValue); break;
                case '-': expression = firstNum - (firstNum * percentValue); break;
                case '*': expression = firstNum * percentValue; break;
                case '/': expression = firstNum / percentValue; break;
              }
            } else {
              expression = percentValue;
            }
          }

          if (expression.includes('sqrt')) {
            const num = parseFloat(expression.replace('sqrt', ''));
            expression = Math.sqrt(num);
          }

          const result = eval(expression);
          lastResult = result;
          currentInput = result.toString();
          updateDisplay(currentInput);
        } catch {
          updateDisplay("Error");
        }
        break;
      case 'mc':
        memory = 0;
        updateMemoryDisplay();
        break;
      case 'mr':
        currentInput += memory;
        updateDisplay(currentInput);
        break;
      case 'm-plus':
        memory += parseFloat(currentInput || "0");
        updateMemoryDisplay();
        break;
      case 'm-minus':
        memory -= parseFloat(currentInput || "0");
        updateMemoryDisplay();
        break;
      case 'plus-minus':
        if (currentInput !== "") {
          currentInput = currentInput.charAt(0) === '-' 
            ? currentInput.substring(1) 
            : '-' + currentInput;
          updateDisplay(currentInput);
        }
        break;
      default:
        if (val === 'pi') {
          currentInput += Math.PI.toString();
        } else if (['+', '-', '*', '/', '^'].includes(val)) {
          handleOperation(val);
        } else if (val === 'sqrt') {
          currentInput = `sqrt${currentInput}`;
        } else {
          currentInput += val;
        }
        updateDisplay(currentInput);
    }
  });
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
  const allowedKeys = '0123456789()/*-+.^%';
  if (allowedKeys.includes(e.key)) {
    currentInput += e.key;
    updateDisplay(currentInput);
  } else if (e.key === 'Enter' || e.key === '=') {
    document.getElementById('equals').click();
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  } else if (e.key === 'Escape') {
    currentInput = "";
    updateDisplay("");
  } else if (e.key.toLowerCase() === 'p') {
    currentInput += Math.PI.toString();
    updateDisplay(currentInput);
  }
});