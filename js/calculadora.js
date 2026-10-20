// BACK: lógica de la calculadora (no toca el HTML)
// Responsable: Backend Developer

class DivisionEntreCeroError extends Error {
  constructor() {
    super('No se puede dividir entre cero.');
    this.name = 'DivisionEntreCeroError';
  }
}

const SIMBOLOS = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const MAX_DIGITOS = 12;

class Calculadora {
  constructor() {
    this.limpiar();
  }

  limpiar() {
    this.actual = '0';
    this.anterior = null;
    this.operador = null;
    this.esperandoSegundo = false;
    this.resultadoMostrado = false;
    this.ultimaExpresion = '';
  }

  _nuevoNumeroSiHaceFalta() {
    if (this.esperandoSegundo) {
      this.actual = '0';
      this.esperandoSegundo = false;
    } else if (this.resultadoMostrado) {
      this.limpiar();
    }
  }

  ingresarDigito(d) {
    this._nuevoNumeroSiHaceFalta();
    if (this.actual.replace(/[-.]/g, '').length >= MAX_DIGITOS) return;
    this.actual = this.actual === '0' ? String(d) : this.actual + d;
  }

  ingresarPunto() {
    this._nuevoNumeroSiHaceFalta();
    if (!this.actual.includes('.')) this.actual += '.';
  }

  borrar() {
    if (this.esperandoSegundo || this.resultadoMostrado) return;
    this.actual = this.actual.length > 1 && this.actual !== '-0' ? this.actual.slice(0, -1) : '0';
  }

  elegirOperador(op) {
    if (!SIMBOLOS[op]) return;
    if (this.operador && this.esperandoSegundo) {
      this.operador = op; // cambia el operador si se presionó otro seguido
      return;
    }
    if (this.operador) this.actual = this._resolver();
    this.anterior = this.actual;
    this.operador = op;
    this.esperandoSegundo = true;
    this.resultadoMostrado = false;
    this.ultimaExpresion = '';
  }

  calcular() {
    if (!this.operador || this.esperandoSegundo) return;
    const expresion = `${this.anterior} ${SIMBOLOS[this.operador]} ${this.actual} =`;
    const resultado = this._resolver();
    this.ultimaExpresion = expresion;
    this.actual = resultado;
    this.anterior = null;
    this.operador = null;
    this.resultadoMostrado = true;
  }

  _resolver() {
    const a = parseFloat(this.anterior);
    const b = parseFloat(this.actual);
    let r;
    switch (this.operador) {
      case '+': r = a + b; break;
      case '-': r = a - b; break;
      case '*': r = a * b; break;
      case '/':
        if (b === 0) throw new DivisionEntreCeroError();
        r = a / b;
        break;
    }
    return String(Number(r.toPrecision(12)));
  }

  get pantalla() {
    return this.actual;
  }

  get expresion() {
    if (this.operador) {
      return `${this.anterior} ${SIMBOLOS[this.operador]}${this.esperandoSegundo ? '' : ' ' + this.actual}`;
    }
    return this.ultimaExpresion;
  }
}

if (typeof module !== 'undefined') {
  module.exports = { Calculadora, DivisionEntreCeroError };
}
