function pegar(chave, padrao) {
  const guardado = localStorage.getItem(chave);

  if (guardado === null) {
    return padrao;
  }

  return JSON.parse(guardado);
}


function guardar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}


function dinheiro(valor) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}



function pegarCarrinho() {
  return pegar('t72_carrinho', []);
}


function contarItensDoCarrinho() {
  const carrinho = pegarCarrinho();
  let total = 0;

  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].qtd;
  }

  return total;
}



function usuarioLogado() {
  const id = pegar('t72_sessao', null);
  const usuarios = pegar('t72_usuarios', []);

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === id) {
      return usuarios[i];
    }
  }

  return null;
}


function salvarUsuario(usuario) {
  const usuarios = pegar('t72_usuarios', []);
  let achou = false;

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === usuario.id) {
      usuarios[i] = usuario;
      achou = true;
    }
  }

  if (achou === false) {
    usuarios.push(usuario);
  }

  guardar('t72_usuarios', usuarios);
}


document.documentElement.dataset.theme = pegar('t72_tema', 'light');
