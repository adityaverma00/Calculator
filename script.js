let runningTotal = null;
let buffer = '0';
let previousOperator = null;
let awaitingNextValue = false;
let lastOperand = null;
let lastOperator = null;

const screen = document.querySelector('.screen');

function buttonClick(value) {
    if (!value) {
        return;
    }

    if (buffer === 'Error' && value !== 'AC') {
        resetCalculator();
    }

    if (isDigit(value)) {
        handleNumber(value);
    } else if (value === '.') {
        handleDecimal();
    } else {
        handleSymbol(value);
    }

    updateScreen();
}

function isDigit(value) {
    return /\d/.test(value);
}

function handleSymbol(symbol) {
    switch (symbol) {
        case 'AC':
            resetCalculator();
            break;
        case '±':
            toggleSign();
            break;
        case '%':
            applyPercent();
            break;
        case '=':
            handleEquals();
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            handleOperator(symbol);
            break;
        default:
            break;
    }
}

function handleNumber(numberString) {
    if (awaitingNextValue || buffer === '0') {
        buffer = numberString;
        awaitingNextValue = false;
    } else {
        buffer += numberString;
    }
}

function handleDecimal() {
    if (awaitingNextValue) {
        buffer = '0.';
        awaitingNextValue = false;
        return;
    }

    if (!buffer.includes('.')) {
        buffer += '.';
    }
}

function handleOperator(symbol) {
    const currentValue = parseFloat(buffer);

    if (runningTotal === null) {
        runningTotal = currentValue;
    } else if (!awaitingNextValue) {
        runningTotal = performOperation(runningTotal, currentValue, previousOperator);
        buffer = formatOutput(runningTotal);
    }

    previousOperator = symbol;
    awaitingNextValue = true;
    lastOperand = null;
    lastOperator = null;
}

function handleEquals() {
    if (previousOperator === null) {
        if (lastOperator !== null && lastOperand !== null) {
            const currentValue = parseFloat(buffer);
            const result = performOperation(currentValue, lastOperand, lastOperator);
            buffer = formatOutput(result);
        }
        awaitingNextValue = true;
        return;
    }

    if (awaitingNextValue) {
        return;
    }

    const currentValue = parseFloat(buffer);
    runningTotal = performOperation(runningTotal, currentValue, previousOperator);

    lastOperand = currentValue;
    lastOperator = previousOperator;

    buffer = formatOutput(runningTotal);
    runningTotal = null;
    previousOperator = null;
    awaitingNextValue = true;
}

function performOperation(firstValue, secondValue, operator) {
    switch (operator) {
        case '+':
            return firstValue + secondValue;
        case '−':
            return firstValue - secondValue;
        case '×':
            return firstValue * secondValue;
        case '÷':
            return secondValue === 0 ? Infinity : firstValue / secondValue;
        default:
            return secondValue;
    }
}

function formatOutput(value) {
    if (!isFinite(value)) {
        return 'Error';
    }

    const rounded = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
    return rounded === 0 ? '0' : rounded.toString();
}

function toggleSign() {
    if (buffer === '0' || buffer === 'Error') {
        return;
    }

    buffer = buffer.startsWith('-') ? buffer.slice(1) : `-${buffer}`;
}

function applyPercent() {
    const currentValue = parseFloat(buffer);
    if (isNaN(currentValue)) {
        return;
    }

    const percentValue = currentValue / 100;
    buffer = formatOutput(percentValue);
    awaitingNextValue = false;
}

function resetCalculator() {
    runningTotal = null;
    buffer = '0';
    previousOperator = null;
    awaitingNextValue = false;
    lastOperand = null;
    lastOperator = null;
}

function updateScreen() {
    screen.innerText = buffer;
}

function init() {
    document.querySelector('.calc-buttons').addEventListener('click', function(event) {
        const button = event.target.closest('button');
        if (!button) {
            return;
        }
        const value = button.getAttribute('data-value');
        buttonClick(value);
    });

    updateScreen();
}

init();
