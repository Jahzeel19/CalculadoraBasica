// FRONT: conecta los botones y el teclado con la calculadora y maneja las ventanas
// Responsable: Frontend (diseño)

(function () {
  const calc = new Calculadora();
  const $ = (s) => document.querySelector(s);
  const pantalla = $('#pantalla');
  const expresion = $('#expresion');
  const modalError = $('#modal-error');
  const modalAyuda = $('#modal-ayuda');
  const mensajeError = $('#mensaje-error');

  function actualizar() {
    pantalla.textContent = calc.pantalla;
    expresion.textContent = calc.expresion || '\u00a0';
  }

  function abrir(modal) {
    modal.hidden = false;
    modal.querySelector('button').focus();
  }

  function cerrar(modal) {
    modal.hidden = true;
  }

  function hayModalAbierto() {
    return !modalError.hidden || !modalAyuda.hidden;
  }

  function ejecutar(accion, valor) {
    try {
      switch (accion) {
        case 'digito': calc.ingresarDigito(valor); break;
        case 'punto': calc.ingresarPunto(); break;
        case 'operador': calc.elegirOperador(valor); break;
        case 'igual': calc.calcular(); break;
        case 'borrar': calc.borrar(); break;
        case 'limpiar': calc.limpiar(); break;
        case 'ayuda': abrir(modalAyuda); break;
      }
    } catch (e) {
      if (e.name === 'DivisionEntreCeroError') {
        calc.limpiar();
        mensajeError.textContent = e.message + ' Se borró la operación.';
        abrir(modalError);
      } else {
        throw e;
      }
    }
    actualizar();
  }

  // Clicks en botones
  document.querySelectorAll('[data-accion]').forEach((btn) => {
    btn.addEventListener('click', () => ejecutar(btn.dataset.accion, btn.dataset.valor));
  });

  // Cerrar ventanas
  document.querySelectorAll('[data-cerrar]').forEach((btn) => {
    btn.addEventListener('click', () => cerrar(btn.closest('.modal')));
  });

  // Teclado físico
  document.addEventListener('keydown', (e) => {
    if (hayModalAbierto()) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        cerrar(modalError);
        cerrar(modalAyuda);
      }
      return;
    }
    const k = e.key;
    if (/^[0-9]$/.test(k)) ejecutar('digito', k);
    else if (k === '.' || k === ',') ejecutar('punto');
    else if (['+', '-', '*', '/'].includes(k)) ejecutar('operador', k);
    else if (k === 'Enter' || k === '=') ejecutar('igual');
    else if (k === 'Backspace') ejecutar('borrar');
    else if (k === 'Escape' || k === 'Delete') ejecutar('limpiar');
    else if (k === 'h' || k === 'H' || k === '?') ejecutar('ayuda');
    else return;
    e.preventDefault();
  });

  actualizar();
})();
