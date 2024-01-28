const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueXhvdWxpb2tlZWJpY3ppa2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NjYzMzMsImV4cCI6MjAyMDE0MjMzM30.UQuQPUrI3J0a6750lYEggSNZ9F4gGyLUl3XPQvub18A';
const url = 'https://anyxouliokeebiczikkc.supabase.co';
const STORAGE_BUCKET = 'Posters';
const database = supabase.createClient(url, key);

function NovoFilme() {

  $('.body-loader').toggle();

  var titulo = $('#Titulo').val();
  var genero = $('#Genero').val();
  var anoLancamento = $('#AnoLancamento').val();
  var duracao = $('#Duracao').val();
  var nota = $('#Nota').val();
  var imagem = $('#Imagem');

  if (imagem[0].files[0].type != 'image/jpeg' &&
    imagem[0].files[0].type != 'image/png' &&
    imagem[0].files[0].type != 'image/webp') {
    Swal.fire({
      title: "tipo de Imagem inválido",
      text: "inserir imagens somente do tipo png/jpeg/webp",
      icon: "info"
    });
    return
  }


  var imagemValor = $('#Imagem').val();
  var descricao = $('#Descricao').val();

  if (titulo == "" || genero == "" || duracao == "" || nota == "" || imagemValor == "" || descricao == "") {
    Swal.fire({
      title: "Existem campos não preenchidos",
      text: "Verifique os dados e tente novamente",
      icon: "info"
    });
    return
  }
  var link = 'https://anyxouliokeebiczikkc.supabase.co/storage/v1/object/public/Posters/{0}'.replace('{0}', imagem[0].files[0].name);

  PostFilme(titulo, genero, anoLancamento, duracao, nota, link, descricao);
  PostPoster(imagem);

}

function RemoverFilme(id) {
  DeleteFilme(id);
}

async function DeleteFilme(id) {

  $('.body-loader').toggle();

  const { error } = await database
    .from('Filmes')
    .delete()
    .eq('id', id)

    if (error) {

      $('.body-loader').toggle();
  
      Swal.fire({
        title: "Algo deu errado!",
        text: error.message,
        icon: "error"
      });
      console.log(error);
      return
    }
    else {
      deleteImagem();

      $('.body-loader').toggle();
  
      Swal.fire({
        title: "Removido!",
        text: "Filme removido com sucesso",
        icon: "success"
      })
        .then((value) => {
          $('#modal-informacao-filme').modal('toggle');
          carregaTodosFilmes();
        });
    }

}

async function deleteImagem(){
  
var nomeFilme = $(`#informacoes-filme-Poster`)[0].src;
var linkFormatado = nomeFilme.slice(74);

  const { data, error } = await database
  .storage
  .from('Posters')
  .remove([`${linkFormatado}`])
  if(error){
    console.log(error);
  }
}


async function PostFilme(titulo, genero, anoLancamento, duracao, nota, url, descricao) {

  const { data, error } = await database
    .from('Filmes')
    .insert([{
      Filme: titulo, Genero: genero,
      Nota: nota, Ano_Lancamento: anoLancamento,
      Duracao: duracao, Descricao: descricao,
      Poster: url
    }])

  if (error) {

    $('.body-loader').toggle();

    Swal.fire({
      title: "Algo deu errado!",
      text: error.message,
      icon: "error"
    });
    console.log(error);
    return
  }
  else {

    $('.body-loader').toggle();

    Swal.fire({
      title: "Criado!",
      text: "Filme criado com sucesso",
      icon: "success"
    })
      .then((value) => {

        $('#modal-cadastro-filme').modal('toggle')
        $("#cadastro-filme").trigger('reset');
        carregaTodosFilmes();
      });
  }
}
async function PostPoster(poster) {

  const posters = { data, error } = await database
    .storage
    .from('Posters')
    .upload(poster[0].files[0].name, poster[0].files[0], {
      cacheControl: '3600',
      upsert: false,
    })
  if (error) {
    Swal.fire({
      title: "Algo deu errado!",
      text: error.message,
      icon: "error"
    });
    console.log(error);
    return
  }
  else {
    console.log(data);
  }
}

async function carregaTodosFilmes() {

  $('.body-loader').toggle();

  let filmes = { data: Filmes, error } = await database
    .from('Filmes')
    .select('*')
    .order('id', { ascending: false })

  if (error) {

    $('.body-loader').toggle();

    Swal.fire({
      title: "Algo deu errado!",
      text: error.message,
      icon: "error"
    });
    console.log(error);
    return
  }
  else {

    // console.log(filmes.data);

    var minhalista =
      `<div class="card" id="NovoFilme">
       <div class="sessao-1 hidden">
       <p class="titulo">Novo Filme</p>
       <p class="nota ">5.0<img src="/imgs/estrela.png"></p>
       </div>
       <img class="poster" src="/imgs/film-1.png">
       <div class="informacoes-adicionais hidden">
       <div class="duracao"><img src="/imgs/Clock.png">1:54:00</div>
       <div class="ano-lancamento"><img src="/imgs/CalendarBlank.png">2023</div>
      </div>
      <button class="btn-card grow" data-toggle="modal" data-target="#modal-cadastro-filme">
      <!-- <img src="/imgs/icon-plus.png"> -->
      <p>Novo Filme</p>
  </button>
  </div>`

    for (var i in filmes.data) {
      minhalista = minhalista +
        `<div class="card">
         <div class="sessao-1">
             <p class="titulo">${filmes.data[i].Filme}</p>
             <p class="nota">${filmes.data[i].Nota}<img src="/imgs/estrela.png"></p>
         </div>
         <img class="poster" src="${filmes.data[i].Poster}">
         <div class="informacoes-adicionais">
             <div class="duracao"><img src="/imgs/Clock.png">${filmes.data[i].Duracao}</div>
             <div class="ano-lancamento"><img src="/imgs/CalendarBlank.png">${filmes.data[i].Ano_Lancamento}</div>
         </div>
         <button class="btn-card grow" data-target="#modal-informacao-filme" data-toggle="modal" onclick="maisInformacoesFilme(${filmes.data[i].id});">
             <img src="/imgs/icone-info.png">
             <p>Informações</p>
         </button>
     </div>`
    }

    $('#lista-de-Filmes')[0].innerHTML = minhalista;

    $('.body-loader').toggle();
  }

}

async function pesquisaFilmeEspecifico() {

  var nomeFilme = $('#Pesquisa-nome').val();

  $('.body-loader').toggle();

  const filmes = { data, error } = await database
    .from('Filmes')
    .select()
    .ilike('Filme', `%${nomeFilme}%`)
    .order('id', { ascending: false })

  if (error) {

    $('.body-loader').toggle();

    Swal.fire({
      title: "Algo deu errado!",
      text: error.message,
      icon: "error"
    });

    console.log(error);
    return
  }
  else {

    var minhalista =
      `<div class="card" id="NovoFilme">
   <div class="sessao-1 hidden">
      <p class="titulo">Novo Filme</p>
      <p class="nota ">5.0<img src="/imgs/estrela.png"></p>
  </div>
  <img class="poster" src="/imgs/film-1.png">
  <div class="informacoes-adicionais hidden">
      <div class="duracao"><img src="/imgs/Clock.png">1:54:00</div>
      <div class="ano-lancamento"><img src="/imgs/CalendarBlank.png">2023</div>
  </div>
  <button class="btn-card grow" data-toggle="modal" data-target="#modal-cadastro-filme">
      <!-- <img src="/imgs/icon-plus.png"> -->
      <p>Novo Filme</p>
  </button>
  </div>`

    for (var i in filmes.data) {
      minhalista = minhalista +
        `<div class="card">
         <div class="sessao-1">
             <p class="titulo">${filmes.data[i].Filme}</p>
             <p class="nota">${filmes.data[i].Nota}<img src="/imgs/estrela.png"></p>
         </div>
         <img class="poster" src="${filmes.data[i].Poster}">
         <div class="informacoes-adicionais">
             <div class="duracao"><img src="/imgs/Clock.png">${filmes.data[i].Duracao}</div>
             <div class="ano-lancamento"><img src="/imgs/CalendarBlank.png">${filmes.data[i].Ano_Lancamento}</div>
         </div>
         <button class="btn-card grow" data-target="#modal-informacao-filme" data-toggle="modal" onclick="maisInformacoesFilme(${filmes.data[i].id})">
             <img src="/imgs/icone-info.png">
             <p>Informações</p>
         </button>
     </div>`
    }

    $('#lista-de-Filmes')[0].innerHTML = minhalista;
    $('.body-loader').toggle();
  }

}

async function maisInformacoesFilme(ID) {

  $('.body-loader').toggle();

  const filmes = { data, error } = await database
    .from('Filmes')
    .select()
    .eq('id', ID)

  if (error) {

    $('.body-loader').toggle();

    Swal.fire({
      title: "Algo deu errado!",
      text: error.message,
      icon: "error"
    });

    console.log(error);
    return
  }
  else {
    var minhalista = "";
    console.log(filmes.data);

    for (var i in filmes.data) {
      minhalista =
        `<div class="informacoes-filme-selecionado">
                    <p class="filme-Titulo" id="informacoes-filme-Titulo">${filmes.data[i].Filme}</p>
                </div>
                <div class="informacoes-filme-selecionado">
                    <img class="poster" id="informacoes-filme-Poster" src="${filmes.data[i].Poster}">
                </div>
                <div class="informacoes-filme-selecionado">
  
                    <p class="descricao" id="informacoes-filme-Descricao">${filmes.data[i].Descricao}</p>
                </div>
                <div class="informacoes-filme-selecionado">
                    <img class="icons" src="/imgs/roll-film.png">
                    <p class="">Genero:</p>
                    <p id="informacoes-filme-Genero">${filmes.data[i].Genero}</p>
                </div>
                <div class="informacoes-filme-selecionado">
                    <img class="icons" src="/imgs/CalendarBlank.png">
                    <p class="">Ano de Lançamento:</p>
                    <p id="informacoes-filme-AnoLancamento">${filmes.data[i].Ano_Lancamento}</p>
                </div>
                <div class="informacoes-filme-selecionado">
                    <img class="icons" src="/imgs/Clock.png">
                    <p class="">Duração:</p>
                    <p id="informacoes-filme-Duracao">${filmes.data[i].Duracao}</p>
                </div>
                <div class="informacoes-filme-selecionado">
                    <img class="icons" src="/imgs/star-24.png">
                    <p class="">Nota:</p>
                    <p id="informacoes-filme-Nota">${filmes.data[i].Nota}</p>
                </div>
                <div class="informacoes-filme-selecionado flex"style="width: 80%;">
                  <button class="btn-card grow remover" onclick="RemoverFilme(${filmes.data[i].id});">
              
                  <p>Remover Filme</p>
                  </button>
                  </div>`
      $('.body-loader').toggle();
      $('#informacoes-filme')[0].innerHTML = minhalista;
    }
  }
}
$(function () {
  checkCookie();
});




function checkCookie() {

  let user = getCookie("Usuario Autenticado");
  if (user != "") {
    console.log(`Usuario autenticado`);

    carregaTodosFilmes();

  } else {
    autenticar();
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function autenticar() {
  let timerInterval;
  Swal.fire({
    title: "Usuario Nao Autenticado!",
    html: "Você será redirecionado em alguns segundos.",
    timer: 3000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {

      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      window.location.href = 'http://127.0.1:5500/CineAdmin/Login.html'
    }
  });
}
