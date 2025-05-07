import './wasm_exec.js';

const go = new Go();
let wasmReady = false;
let wasmInstance = null;

async function loadWasm() {
  const result = await WebAssembly.instantiateStreaming(fetch('main.wasm'), go.importObject);
  wasmInstance = result.instance;
  go.run(wasmInstance);
  wasmReady = true;
}
loadWasm();

const display = document.getElementById('display');
let current = '';
let operator = '';
let operand = '';
let waitingForOperand = false;

function updateDisplay(val) {
  display.textContent = val;
  display.classList.add('updated');
  setTimeout(() => {
    display.classList.remove('updated');
  }, 200);
}

function clearAll() {
  current = '';
  operator = '';
  operand = '';
  waitingForOperand = false;
  updateDisplay('0');
}

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    btn.classList.add('pressed');
    setTimeout(() => {
      btn.classList.remove('pressed');
    }, 200);
    const value = btn.dataset.value;
    const op = btn.dataset.op;

    if (btn.classList.contains('clr')) {
      clearAll();
      return;
    }
    if (btn.classList.contains('eq')) {
      if (operator && operand !== '' && current !== '') {
        let result;
        if (!wasmReady) {
          updateDisplay('...');
          return;
        }
        const a = parseFloat(operand);
        const b = parseFloat(current);
        switch (operator) {
          case '+': result = globalThis.goAdd(a, b); break;
          case '-': result = globalThis.goSub(a, b); break;
          case '*': result = globalThis.goMul(a, b); break;
          case '/': result = globalThis.goDiv(a, b); break;
          default: result = 'Err';
        }
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
        let result;
        if (!wasmReady) {
          updateDisplay('...');
          return;
        }
        const a = parseFloat(operand);
        const b = parseFloat(current);
        switch (operator) {
          case '+': result = globalThis.goAdd(a, b); break;
          case '-': result = globalThis.goSub(a, b); break;
          case '*': result = globalThis.goMul(a, b); break;
          case '/': result = globalThis.goDiv(a, b); break;
          default: result = 'Err';
        }
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
      if (current.length < 10) {
        current += value;
        updateDisplay(current);
      }
    }
  });
});

clearAll();

document.addEventListener('keydown', (e) => {
  const key = e.key;
  
  if (/[0-9.]/.test(key)) {
    const numBtn = document.querySelector(`.btn[data-value="${key}"]`);
    if (numBtn) numBtn.click();
  }
  
  if (['+', '-', '*', '/'].includes(key)) {
    const opBtn = document.querySelector(`.btn[data-op="${key}"]`);
    if (opBtn) opBtn.click();
  }
  
  if (key === 'Enter' || key === '=') {
    const eqBtn = document.getElementById('equals');
    if (eqBtn) eqBtn.click();
  }
  
  if (key === 'Escape' || key === 'Backspace' || key === 'Delete') {
    const clrBtn = document.getElementById('clear');
    if (clrBtn) clrBtn.click();
  }
});
