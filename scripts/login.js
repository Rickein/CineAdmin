const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueXhvdWxpb2tlZWJpY3ppa2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1NjYzMzMsImV4cCI6MjAyMDE0MjMzM30.UQuQPUrI3J0a6750lYEggSNZ9F4gGyLUl3XPQvub18A';
const url = 'https://anyxouliokeebiczikkc.supabase.co';
const database = supabase.createClient(url, key);

function AutenticarLogin() {

    $('.body-loader').toggle();

    let email = $('#emailLogin').val();
    let senha = $('#senhaLogin').val();

    if (email == "" || senha == "") {

        $('.body-loader').toggle();

        Swal.fire({
            title: "Login e/ou senha não informado",
            text: "Verifique seus dados e tente novamente",
            icon: "info"
        });
        return

    }
    GetLogin(email, senha);
}

async function GetLogin(email, senha) {

    const { data, error } = await database
        .auth.signInWithPassword({
            email: email,
            password: senha,
        })

    if (error) {

        $('.body-loader').toggle();

        Swal.fire({
            title: "Algo deu errado!",
            text: error,
            icon: "error"
        });
        return
    }

    else {

        $('.body-loader').toggle();
        console.log("Usuario autenticado: " + data);
        window.location.href = window.location.href.replace('Login', 'Filmes');
    }
    //redirecionar aqui 
}

async function PostUser(email, senha) {

    const { error, data } = await database.auth.signUp({
        email: email,
        password: senha,
    })

    if (error) {

        $('.body-loader').toggle();

        Swal.fire({
            title: "Algo deu errado!",
            text: error,
            icon: "error"
        });

        return
    }
    else {

        $('.body-loader').toggle();

        Swal.fire({
            icon: "success",
            title: "Usuario Criado com Sucesso !",
            text: "Verifique sua Caixa de Email para ativar sua conta",
            showConfirmButton: false,
            timer: 4000
        });

        $('#modal-cadastro').modal('toggle');

        $('#NovaSenha')[0].value = "";
        $('#NovoEmail')[0].value = "";

        let button = $('#btn-novo');
        button.attr('disabled', false)
        button[0].innerHTML = 'Criar'

    }
}

async function NovoUsuario() {

    // let nome = $('#NovoNome').val();
    let senha = $('#NovaSenha').val();
    let email = $('#NovoEmail').val();

    $('.body-loader').toggle();

    if (senha == "" || email == "") {
        $('.body-loader').toggle();

        Swal.fire({
            title: "Existem campos não informados",
            text: "Verifique seus dados e tente novamente",
            icon: "info"
        });
        return
    }


    if (senha.length < 6) {

        $('.body-loader').toggle();

        Swal.fire({
            title: "Sua senha esta fraca",
            text: "utilize uma senha com no minimo 6 caracteres",
            icon: "info"
        });
        return
    }


    let button = $('#btn-novo');
    button.attr('disabled', true)
    button[0].innerHTML = 'Criando..'

    const resp = await PostUser(email, senha);
}

