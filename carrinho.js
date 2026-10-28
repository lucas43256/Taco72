const listaItens = document.getElementById('lista-itens');
const modeloItem = document.getElementById('modelo-item');
const taxaDeEntrega = Number(document.getElementById('resumo').dataset.taxa);
const secaoFinalizar = document.getElementById('finalizar');
const formPedido = document.getElementById('form-pedido');


function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}


function desenharCarrinho() {
  const carrinho = pegarCarrinho();


  if (carrinho.length === 0) {
    document.getElementById('carrinho-vazio').hidden = false;
    document.getElementById('carrinho-conteudo').hidden = true;
    secaoFinalizar.hidden = true;
    return;
  }

  document.getElementById('carrinho-vazio').hidden = true;
  document.getElementById('carrinho-conteudo').hidden = false;

  listaItens.innerHTML = '';
  let subtotal = 0;

  for (let i = 0; i < carrinho.length; i++) {
    const produto = carrinho[i];


    const linha = modeloItem.content.cloneNode(true);
    const imagem = linha.querySelector('img');


    const imagensProdutos = {
      "1": "images/AiPastor.jpg",
      "2": "images/BirriaBrava.jpg",
      "3": "images/VerdeCasa.jpg",
      "4": "images/Carnitas.jpg",
      "5": "images/BajaPeixe.jpg",
      "6": "images/Chorizo.jpg",
      "7": "images/BurritoGrande.jpg",
      "8": "images/Quesadilha.jpg",
      "9": "images/NachosGua.jpg",
      "10": "images/Guacamole.jpg",
      "11": "images/EloteBrasa.jpg",
      "12": "images/Limonada.jpg",
      "13": "images/Horchata.jpg",
      "14": "images/Churros.jpg"
    };

    imagem.src = imagensProdutos[produto.id] || produto.img;
    imagem.alt = produto.nome;

    linha.querySelector('.item-nome').textContent = produto.nome;
    linha.querySelector('.item-preco').textContent = dinheiro(produto.preco);
    linha.querySelector('.item-qtd').textContent = produto.qtd;
    linha.querySelector('.item-subtotal').textContent = dinheiro(produto.preco * produto.qtd);

    // guarda o id do produto nos botões
    linha.querySelector('.btn-menos').dataset.id = produto.id;
    linha.querySelector('.btn-mais').dataset.id = produto.id;
    linha.querySelector('.btn-remover').dataset.id = produto.id;

    listaItens.appendChild(linha);

    subtotal = subtotal + produto.preco * produto.qtd;
  }

  const total = arredondar(subtotal + taxaDeEntrega);

  document.getElementById('subtotal').textContent = dinheiro(subtotal);
  document.getElementById('taxa').textContent = dinheiro(taxaDeEntrega);
  document.getElementById('total').textContent = dinheiro(total);
}



listaItens.addEventListener('click', function (evento) {
  const botao = evento.target.closest('button');

  if (botao === null) {
    return;
  }

  let carrinho = pegarCarrinho();

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === botao.dataset.id) {

      if (botao.classList.contains('btn-mais') && carrinho[i].qtd < 99) {
        carrinho[i].qtd = carrinho[i].qtd + 1;
      }

      if (botao.classList.contains('btn-menos') && carrinho[i].qtd > 1) {
        carrinho[i].qtd = carrinho[i].qtd - 1;
      }

      if (botao.classList.contains('btn-remover')) {
        carrinho.splice(i, 1);
      }

      break;
    }
  }

  guardar('t72_carrinho', carrinho);
  atualizarContador();
  desenharCarrinho();
});


document.getElementById('btn-finalizar').addEventListener('click', function () {
  const logado = usuarioLogado();


  if (logado === null) {
    location.href = 'login.html?next=carrinho.html';
    return;
  }


  document.getElementById('nome').value = logado.nome;
  document.getElementById('telefone').value = logado.tel;

  if (logado.endereco !== null) {
    document.getElementById('cep').value = logado.endereco.cep;
    document.getElementById('rua').value = logado.endereco.rua;
    document.getElementById('numero').value = logado.endereco.numero;
    document.getElementById('complemento').value = logado.endereco.complemento;
    document.getElementById('bairro').value = logado.endereco.bairro;
    document.getElementById('cidade').value = logado.endereco.cidade;
    document.getElementById('uf').value = logado.endereco.uf;
  }

  secaoFinalizar.hidden = false;
  secaoFinalizar.scrollIntoView();
});



formPedido.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const msgErro = document.getElementById('msg-erro');
  const logado = usuarioLogado();
  const carrinho = pegarCarrinho();
  const pagamento = formPedido.querySelector('input[name="pagamento"]:checked');

  msgErro.hidden = true;

  if (validarFormulario(formPedido) === false || pagamento === null || logado === null || carrinho.length === 0) {
    msgErro.hidden = false;
    return;
  }

  let subtotal = 0;
  const itens = [];

  for (let i = 0; i < carrinho.length; i++) {
    subtotal = subtotal + carrinho[i].preco * carrinho[i].qtd;

    itens.push({
      nome: carrinho[i].nome,
      preco: carrinho[i].preco,
      qtd: carrinho[i].qtd
    });
  }

  const pedido = {
    id: 'T72-' + Date.now().toString(36).toUpperCase(),
    usuario: logado.id,
    data: new Date().toISOString(),
    itens: itens,
    subtotal: arredondar(subtotal),
    taxa: taxaDeEntrega,
    total: arredondar(subtotal + taxaDeEntrega),
    contato: document.getElementById('nome').value.trim() + ' - ' + document.getElementById('telefone').value.trim(),
    endereco: {
      cep: document.getElementById('cep').value.trim(),
      rua: document.getElementById('rua').value.trim(),
      numero: document.getElementById('numero').value.trim(),
      complemento: document.getElementById('complemento').value.trim(),
      bairro: document.getElementById('bairro').value.trim(),
      cidade: document.getElementById('cidade').value.trim(),
      uf: document.getElementById('uf').value.trim().toUpperCase()
    },
    pagamento: pagamento.value,
    status: 'Aguardando confirmação'
  };

  const pedidos = pegar('t72_pedidos', []);
  pedidos.push(pedido);

  guardar('t72_pedidos', pedidos);
  guardar('t72_carrinho', []);
  atualizarContador();

  document.getElementById('carrinho-vazio').hidden = true;
  document.getElementById('carrinho-conteudo').hidden = true;
  secaoFinalizar.hidden = true;
  document.getElementById('numero-pedido').textContent = pedido.id;
  document.getElementById('pedido-ok').hidden = false;
});


desenharCarrinho();
