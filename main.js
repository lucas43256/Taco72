const cabecalho = document.getElementById('site-header');
const botaoMenu = document.getElementById('btn-menu');
const botaoTema = document.getElementById('btn-tema');
const contador = document.getElementById('contador');



botaoMenu.addEventListener('click', function () {
  cabecalho.classList.toggle('aberto');
});



botaoTema.addEventListener('click', function () {
  let novoTema = 'dark';

  if (document.documentElement.dataset.theme === 'dark') {
    novoTema = 'light';
  }

  document.documentElement.dataset.theme = novoTema;
  guardar('t72_tema', novoTema);
});



function atualizarContador() {
  contador.textContent = contarItensDoCarrinho();
}

atualizarContador();



const usuario = usuarioLogado();

if (usuario !== null) {
  document.getElementById('conta-visitante').hidden = true;
  document.getElementById('conta-logada').hidden = false;
  document.getElementById('nome-usuario').textContent = usuario.nome.split(' ')[0];
}

document.getElementById('btn-sair').addEventListener('click', function () {
  localStorage.removeItem('t72_sessao');
  location.href = 'index.html';
});



document.addEventListener('click', function (evento) {
  const botao = evento.target.closest('.add');

  if (botao === null) {
    return;
  }

  const carrinho = pegarCarrinho();
  let item = null;

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === botao.dataset.id) {
      item = carrinho[i];
    }
  }

  if (item === null) {
    carrinho.push({
      id: botao.dataset.id,
      nome: botao.dataset.nome,
      preco: Number(botao.dataset.preco),
      img: botao.dataset.img,
      qtd: 1
    });
  } else if (item.qtd < 99) {
    item.qtd = item.qtd + 1;
  }

  guardar('t72_carrinho', carrinho);
  atualizarContador();


  botao.textContent = '✓';

  setTimeout(function () {
    botao.textContent = '+';
  }, 800);
});




function mascaraTelefone(texto) {
  const n = texto.replace(/\D/g, '').slice(0, 11);

  if (n.length <= 2) {
    return n;
  }

  if (n.length <= 6) {
    return '(' + n.slice(0, 2) + ') ' + n.slice(2);
  }

  if (n.length <= 10) {
    return '(' + n.slice(0, 2) + ') ' + n.slice(2, 6) + '-' + n.slice(6);
  }

  return '(' + n.slice(0, 2) + ') ' + n.slice(2, 7) + '-' + n.slice(7);
}


function mascaraCep(texto) {
  const n = texto.replace(/\D/g, '').slice(0, 8);

  if (n.length > 5) {
    return n.slice(0, 5) + '-' + n.slice(5);
  }

  return n;
}


document.addEventListener('input', function (evento) {
  const campo = evento.target;

  if (campo.dataset.mascara === 'telefone') {
    campo.value = mascaraTelefone(campo.value);
  }

  if (campo.dataset.mascara === 'cep') {
    campo.value = mascaraCep(campo.value);
  }
});



function campoValido(campo) {
  const valor = campo.value.trim();
  const tipo = campo.dataset.tipo;

  if (tipo === 'texto') {
    return valor.length >= 3;
  }

  if (tipo === 'obrigatorio') {
    return valor !== '';
  }

  if (tipo === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  }

  if (tipo === 'telefone') {
    return valor.replace(/\D/g, '').length >= 10;
  }

  if (tipo === 'cep') {
    return /^\d{5}-?\d{3}$/.test(valor);
  }

  if (tipo === 'uf') {
    return /^[A-Za-z]{2}$/.test(valor);
  }

  if (tipo === 'senha') {
    return campo.value.length >= 6;
  }


  if (tipo === 'igual') {
    return campo.value === document.getElementById(campo.dataset.igual).value;
  }

  return true;
}


function mostrarErro(campo, texto) {
  const aviso = campo.parentElement.querySelector('.erro');

  aviso.textContent = texto;

  if (texto === '') {
    campo.removeAttribute('aria-invalid');
  } else {
    campo.setAttribute('aria-invalid', 'true');
  }
}


function validarFormulario(formulario) {
  const campos = formulario.querySelectorAll('[data-tipo]');
  let tudoCerto = true;

  for (let i = 0; i < campos.length; i++) {
    if (campoValido(campos[i])) {
      mostrarErro(campos[i], '');
    } else {
      mostrarErro(campos[i], campos[i].dataset.erro);
      tudoCerto = false;
    }
  }

  return tudoCerto;
}
