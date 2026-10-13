
(() => {
  const form = document.getElementById('calculator-form');
  const first = document.getElementById('first-number');
  const second = document.getElementById('second-number');
  const error = document.getElementById('form-error');
  const result = document.getElementById('result-value');
  const historyList = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');
  const clearButton = document.getElementById('clear-history');
  const historyTemplate = document.getElementById('history-template');

  const operators = [
    ...document.querySelectorAll('[data-operator]')
  ];

  let selected = '+';

  // Memilih operator matematika
  operators.forEach(button => {
    button.addEventListener('click', () => {
      selected = button.dataset.operator;

      operators.forEach(item => {
        const active = item === button;

        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      error.textContent = '';
      error.classList.add('hidden');
    });
  });

  // Memformat angka sesuai format Indonesia
  function format(value) {
    const rounded = Number.parseFloat(value.toPrecision(12));

    return new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 12
    }).format(Object.is(rounded, -0) ? 0 : rounded);
  }

  // Validasi dan proses perhitungan
  form.addEventListener('submit', event => {
    event.preventDefault();

    error.textContent = '';
    error.classList.add('hidden');

    // Validasi input kosong
    if (
      first.value.trim() === '' ||
      second.value.trim() === ''
    ) {
      error.textContent =
        'Masukkan kedua angka terlebih dahulu.';
      error.classList.remove('hidden');
      return;
    }

    const a = Number(first.value);
    const b = Number(second.value);

    // Validasi angka
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      error.textContent = 'Masukkan angka yang valid.';
      error.classList.remove('hidden');
      return;
    }

    // Validasi pembagian dengan nol
    if (selected === '÷' && b === 0) {
      error.textContent = 'Tidak dapat membagi dengan nol.';
      error.classList.remove('hidden');
      return;
    }

    // Operasi matematika
    let answer;

    switch (selected) {
      case '+':
        answer = a + b;
        break;

      case '−':
        answer = a - b;
        break;

      case '×':
        answer = a * b;
        break;

      case '÷':
        answer = a / b;
        break;

      default:
        error.textContent = 'Operator tidak valid.';
        error.classList.remove('hidden');
        return;
    }

    // Validasi hasil perhitungan
    if (!Number.isFinite(answer)) {
      error.textContent =
        'Hasil terlalu besar untuk ditampilkan.';
      error.classList.remove('hidden');
      return;
    }

    // Menampilkan hasil
    const formattedAnswer = format(answer);
    result.textContent = formattedAnswer;

    // Membuat item riwayat baru
    const item = historyTemplate.content
      .firstElementChild.cloneNode(true);

    item.querySelector('.history-expression').textContent =
      `${format(a)} ${selected} ${format(b)}`;

    item.querySelector('.history-answer').textContent =
      `= ${formattedAnswer}`;

    // Menambahkan riwayat terbaru ke urutan teratas
    historyList.prepend(item);

    // Menyembunyikan pesan riwayat kosong
    empty.classList.add('hidden');
  });

  // Menghapus seluruh riwayat
  clearButton.addEventListener('click', () => {
    historyList.replaceChildren();
    empty.classList.remove('hidden');
  });
})();