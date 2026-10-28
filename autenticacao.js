async function gerarHash(senha, sal) {
  const texto = sal + ':' + senha;

  if (window.crypto && crypto.subtle) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    const lista = Array.from(new Uint8Array(bytes));

    return lista.map(function (b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  let h = 5381;

  for (let i = 0; i < texto.length; i++) {
    h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
  }

  return 'f' + (h >>> 0).toString(16);
}


function paginaDestino(padrao) {
  const next = new URLSearchParams(location.search).get('next');

  if (next !== null && /^[a-z0-9-]+\.html$/.test(next)) {
    return next;
  }

  return padrao;
}



const formCadastro = document.getElementById('form-cadastro');

if (formCadastro !== null) {

  formCadastro.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const msgErro = document.getElementById('msg-erro');
    const msgOk = document.getElementById('msg-ok');
    const campoEmail = document.getElementById('email');

    msgErro.hidden = true;
    msgOk.hidden = true;

    const tudoCerto = validarFormulario(formCadastro);

    if (tudoCerto === false) {
      msgErro.hidden = false;
      return;
    }

    const email = campoEmail.value.trim().toLowerCase();
    const usuarios = pegar('t72_usuarios', []);

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === email) {
        mostrarErro(campoEmail, campoEmail.dataset.erroRepetido);
        msgErro.hidden = false;
        return;
      }
    }

    const sal = Math.random().toString(36).slice(2);

    const novoUsuario = {
      id: 'u' + Date.now(),
      nome: document.getElementById('nome').value.trim(),
      email: email,
      tel: document.getElementById('telefone').value.trim(),
      sal: sal,
      hash: await gerarHash(document.getElementById('senha').value, sal),
      endereco: null
    };

    salvarUsuario(novoUsuario);
    guardar('t72_sessao', novoUsuario.id);

    msgOk.hidden = false;

    setTimeout(function () {
      location.href = paginaDestino('perfil.html');
    }, 900);
  });

}


const formLogin = document.getElementById('form-login');

if (formLogin !== null) {

  const next = new URLSearchParams(location.search).get('next');

  if (next !== null) {
    document.getElementById('link-cadastro').href = 'cadastro.html?next=' + encodeURIComponent(next);
  }

  formLogin.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    const msgErro = document.getElementById('msg-erro');
    const msgOk = document.getElementById('msg-ok');

    msgErro.hidden = true;
    msgOk.hidden = true;

    if (validarFormulario(formLogin) === false) {
      return;
    }

    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const usuarios = pegar('t72_usuarios', []);
    let encontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === email) {
        encontrado = usuarios[i];
      }
    }

    if (encontrado === null || (await gerarHash(senha, encontrado.sal)) !== encontrado.hash) {
      msgErro.hidden = false;
      return;
    }

    guardar('t72_sessao', encontrado.id);
    msgOk.hidden = false;

    setTimeout(function () {
      location.href = paginaDestino('index.html');
    }, 700);
  });

}
