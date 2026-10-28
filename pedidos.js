const listaPedidos = document.getElementById('lista-pedidos');
const modeloPedido = document.getElementById('modelo-pedido');
const modeloLinha = document.getElementById('modelo-linha');
const logado = usuarioLogado();


function montarEndereco(e) {
  let texto = e.rua + ', ' + e.numero;

  if (e.complemento !== '') {
    texto = texto + ' (' + e.complemento + ')';
  }

  return texto + ' - ' + e.bairro + ', ' + e.cidade + '/' + e.uf + ' - CEP ' + e.cep;
}


function desenharPedidos() {
  const todos = pegar('t72_pedidos', []);
  const meus = [];

  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].usuario === logado.id) {
      meus.push(todos[i]);
    }
  }

  listaPedidos.innerHTML = '';
  document.getElementById('sem-pedidos').hidden = meus.length > 0;

  for (let i = 0; i < meus.length; i++) {
    const pedido = meus[i];
    const cartao = modeloPedido.content.cloneNode(true);
    const status = cartao.querySelector('.status');

    cartao.querySelector('.pedido-numero').textContent = pedido.id;
    cartao.querySelector('.pedido-data').textContent = new Date(pedido.data).toLocaleString('pt-BR');
    cartao.querySelector('.pedido-total').textContent = dinheiro(pedido.total);
    cartao.querySelector('.pedido-subtotal').textContent = dinheiro(pedido.subtotal);
    cartao.querySelector('.pedido-taxa').textContent = dinheiro(pedido.taxa);
    cartao.querySelector('.pedido-endereco').textContent = montarEndereco(pedido.endereco);
    cartao.querySelector('.pedido-pagamento').textContent = pedido.pagamento;
    cartao.querySelector('.pedido-contato').textContent = pedido.contato;

    status.textContent = pedido.status;

    if (pedido.status === 'Cancelado') {
      status.classList.add('cancelado');
    }

    const listaItens = cartao.querySelector('.itens-pedido');

    for (let j = 0; j < pedido.itens.length; j++) {
      const item = pedido.itens[j];
      const linha = modeloLinha.content.cloneNode(true);

      linha.querySelector('.linha-qtd').textContent = item.qtd;
      linha.querySelector('.linha-nome').textContent = item.nome;
      linha.querySelector('.linha-valor').textContent = dinheiro(item.preco * item.qtd);

      listaItens.appendChild(linha);
    }

    const botaoCancelar = cartao.querySelector('.btn-cancelar');

    if (pedido.status === 'Aguardando confirmação') {
      botaoCancelar.dataset.id = pedido.id;
    } else {
      botaoCancelar.hidden = true;
    }

    listaPedidos.appendChild(cartao);
  }
}


if (logado === null) {
  document.getElementById('precisa-login').hidden = false;
} else {
  document.getElementById('area-pedidos').hidden = false;

  listaPedidos.addEventListener('click', function (evento) {
    const botao = evento.target.closest('.btn-cancelar');

    if (botao === null) {
      return;
    }

    if (confirm(botao.dataset.confirmar) === false) {
      return;
    }

    const todos = pegar('t72_pedidos', []);

    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === botao.dataset.id) {
        todos[i].status = 'Cancelado';
      }
    }

    guardar('t72_pedidos', todos);
    desenharPedidos();
  });

  desenharPedidos();
}
