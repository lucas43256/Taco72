const campoBusca = document.getElementById('busca');
const campoCategoria = document.getElementById('categoria');
const soVegetarianos = document.getElementById('so-vegetarianos');
const soPicantes = document.getElementById('so-picantes');
const cartoes = document.querySelectorAll('.card');


function limpar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}


function filtrar() {
  const palavras = limpar(campoBusca.value).split(' ');
  let quantos = 0;

  for (let i = 0; i < cartoes.length; i++) {
    const cartao = cartoes[i];
    const texto = limpar(cartao.textContent + ' ' + cartao.dataset.categoria);
    let mostrar = true;

    for (let j = 0; j < palavras.length; j++) {
      if (texto.indexOf(palavras[j]) === -1) {
        mostrar = false;
      }
    }

    if (campoCategoria.value !== '' && cartao.dataset.categoria !== campoCategoria.value) {
      mostrar = false;
    }

    if (soVegetarianos.checked && cartao.dataset.vegetariano !== 'sim') {
      mostrar = false;
    }

    if (soPicantes.checked && cartao.dataset.picante !== 'sim') {
      mostrar = false;
    }

    cartao.hidden = !mostrar;

    if (mostrar) {
      quantos = quantos + 1;
    }
  }

  document.getElementById('quantos').textContent = quantos;
  document.getElementById('sem-resultado').hidden = quantos > 0;
}


function limparFiltros() {
  campoBusca.value = '';
  campoCategoria.value = '';
  soVegetarianos.checked = false;
  soPicantes.checked = false;
  filtrar();
}


campoBusca.addEventListener('input', filtrar);
campoCategoria.addEventListener('change', filtrar);
soVegetarianos.addEventListener('change', filtrar);
soPicantes.addEventListener('change', filtrar);

document.getElementById('filtros').addEventListener('submit', function (evento) {
  evento.preventDefault();
});

document.getElementById('limpar').addEventListener('click', limparFiltros);
document.getElementById('limpar-2').addEventListener('click', limparFiltros);


const parametros = new URLSearchParams(location.search);

if (parametros.get('q') !== null) {
  campoBusca.value = parametros.get('q');
}

filtrar();
