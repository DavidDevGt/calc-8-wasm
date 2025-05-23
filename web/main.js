import './wasm_exec.js';

const go = new Go();
let wasmReady = false;
let wasmInstance = null;

async function loadWasm() {
  try {
    const response = await fetch('main.wasm');
    if (!response.ok) throw new Error(`Error cargando main.wasm: ${response.statusText}`);
    const result = await WebAssembly.instantiateStreaming(response, go.importObject);
    wasmInstance = result.instance;
    go.run(wasmInstance);
    wasmReady = true;
  } catch (error) {
    console.error('Fallo al cargar WASM:', error);
    updateDisplay('ERR');
  }
}
loadWasm();

const display = document.getElementById('display');
let current = '';
let operator = '';
let operand = '';
let waitingForOperand = false;

const MAX_INPUT_LENGTH = 15;
const MAX_SAFE_RESULT_LENGTH = 18;

function adjustFontSize(text) {
  if (!display) return;
  const length = text.length;

  if (length <= 5) {
    display.style.fontSize = '1.75rem';
  } else if (length <= 8) {
    display.style.fontSize = '1.5rem';
  } else if (length <= 10) {
    display.style.fontSize = '1.3rem';
  } else if (length <= MAX_INPUT_LENGTH) {
    display.style.fontSize = '0.8rem'; // size for overflow
  }
}

function updateDisplay(val) {
  if (!display) return;
  display.textContent = val;
  adjustFontSize(val);
  display.classList.add('updated');
  setTimeout(() => display.classList.remove('updated'), 200);
}

function clearAll() {
  current = '';
  operator = '';
  operand = '';
  waitingForOperand = false;
  updateDisplay('0');
}

function isValidInput(value) {
  return value.length <= MAX_INPUT_LENGTH;
}

function isValidResult(result) {
  const str = typeof result === 'string' ? result : result.toString();
  return str.length <= MAX_SAFE_RESULT_LENGTH;
}

function calculate(op, a, b) {
  if (!wasmReady) return '...';
  if (isNaN(a) || isNaN(b)) return 'Err';

  if (!isValidInput(a.toString()) || !isValidInput(b.toString())) {
    return 'MAX';
  }

  try {
    let res;
    switch (op) {
      case '+': res = globalThis.goAdd(a, b); break;
      case '-': res = globalThis.goSub(a, b); break;
      case '*': res = globalThis.goMul(a, b); break;
      case '/':
        if (b === 0) return '∞';
        res = globalThis.goDiv(a, b);
        break;
      default: return 'Err';
    }

    if (!isValidResult(res)) return '∞';
    return res;
  } catch (err) {
    console.error('Error durante cálculo:', err);
    return 'Err';
  }
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    try {
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 200);

      const value = btn.dataset.value;
      const op = btn.dataset.op;

      if (btn.classList.contains('clr')) {
        clearAll();
        return;
      }

      if (btn.classList.contains('eq')) {
        if (operator && operand !== '' && current !== '') {
          const a = parseFloat(operand);
          const b = parseFloat(current);
          const result = calculate(operator, a, b);
          updateDisplay(result);
          operand = result;
          current = '';
          operator = '';
          waitingForOperand = false;
        }
        return;
      }

      if (op) {
        if (current === '' && operand === '') return;
        if (operand !== '' && current !== '') {
          const a = parseFloat(operand);
          const b = parseFloat(current);
          const result = calculate(operator, a, b);
          operand = result;
          updateDisplay(result);
          current = '';
        } else if (current !== '') {
          operand = current;
          current = '';
        }
        operator = op;
        waitingForOperand = true;
        return;
      }

      if (value) {
        if (waitingForOperand) {
          current = '';
          waitingForOperand = false;
        }
        if (value === '.' && current.includes('.')) return;

        if (isValidInput(current + value)) {
          current += value;
          updateDisplay(current);
        } else {
          updateDisplay('MAX');
        }
      }
    } catch (err) {
      console.error('Error inesperado:', err);
      updateDisplay('Err');
    }
  });
});

clearAll();

document.addEventListener('keydown', (e) => {
  try {
    const key = e.key;
    const code = e.code;

    const numpadMap = {
      'Numpad0': '0',
      'Numpad1': '1',
      'Numpad2': '2',
      'Numpad3': '3',
      'Numpad4': '4',
      'Numpad5': '5',
      'Numpad6': '6',
      'Numpad7': '7',
      'Numpad8': '8',
      'Numpad9': '9',
      'NumpadDecimal': '.',
      'NumpadAdd': '+',
      'NumpadSubtract': '-',
      'NumpadMultiply': '*',
      'NumpadDivide': '/',
      'NumpadEnter': 'Enter'
    };

    const mappedKey = numpadMap[code] || key;

    if (/[0-9.]/.test(mappedKey)) {
      const numBtn = document.querySelector(`.btn[data-value="${mappedKey}"]`);
      if (numBtn) {
        numBtn.click();
        e.preventDefault();
        return;
      }
    }

    if (['+', '-', '*', '/'].includes(mappedKey)) {
      const opBtn = document.querySelector(`.btn[data-op="${mappedKey}"]`);
      if (opBtn) {
        opBtn.click();
        e.preventDefault();
        return;
      }
    }

    if (mappedKey === 'Enter' || mappedKey === '=') {
      const eqBtn = document.getElementById('equals');
      if (eqBtn) {
        eqBtn.click();
        e.preventDefault();
        return;
      }
    }

    if (['Escape', 'Backspace', 'Delete'].includes(mappedKey)) {
      const clrBtn = document.getElementById('clear');
      if (clrBtn) {
        clrBtn.click();
        e.preventDefault();
        return;
      }
    }
  } catch (err) {
    console.error('Error en evento keydown:', err);
    updateDisplay('Err');
  }
});
