const logado = usuarioLogado();


if (logado === null) {
  document.getElementById('precisa-login').hidden = false;
} else {
  document.getElementById('area-perfil').hidden = false;

  const formDados = document.getElementById('form-dados');
  const formEndereco = document.getElementById('form-endereco');


  document.getElementById('nome').value = logado.nome;
  document.getElementById('telefone').value = logado.tel;
  document.getElementById('email').value = logado.email;

  if (logado.endereco !== null) {
    document.getElementById('cep').value = logado.endereco.cep;
    document.getElementById('rua').value = logado.endereco.rua;
    document.getElementById('numero').value = logado.endereco.numero;
    document.getElementById('complemento').value = logado.endereco.complemento;
    document.getElementById('bairro').value = logado.endereco.bairro;
    document.getElementById('cidade').value = logado.endereco.cidade;
    document.getElementById('uf').value = logado.endereco.uf;
  }


  const pedidos = pegar('t72_pedidos', []);
  let quantos = 0;

  for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].usuario === logado.id) {
      quantos = quantos + 1;
    }
  }

  document.getElementById('qtd-pedidos').textContent = quantos;


  formDados.addEventListener('submit', function (evento) {
    evento.preventDefault();

    document.getElementById('msg-dados-ok').hidden = true;

    if (validarFormulario(formDados) === false) {
      return;
    }

    logado.nome = document.getElementById('nome').value.trim();
    logado.tel = document.getElementById('telefone').value.trim();

    salvarUsuario(logado);

    document.getElementById('nome-usuario').textContent = logado.nome.split(' ')[0];
    document.getElementById('msg-dados-ok').hidden = false;
  });


  formEndereco.addEventListener('submit', function (evento) {
    evento.preventDefault();

    document.getElementById('msg-endereco-ok').hidden = true;

    if (validarFormulario(formEndereco) === false) {
      return;
    }

    logado.endereco = {
      cep: document.getElementById('cep').value.trim(),
      rua: document.getElementById('rua').value.trim(),
      numero: document.getElementById('numero').value.trim(),
      complemento: document.getElementById('complemento').value.trim(),
      bairro: document.getElementById('bairro').value.trim(),
      cidade: document.getElementById('cidade').value.trim(),
      uf: document.getElementById('uf').value.trim().toUpperCase()
    };

    salvarUsuario(logado);

    document.getElementById('msg-endereco-ok').hidden = false;
  });


  document.getElementById('btn-sair-perfil').addEventListener('click', function () {
    localStorage.removeItem('t72_sessao');
    location.href = 'index.html';
  });
}
