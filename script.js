// HORIZONTE VIAGENS

// FUNÇÕES
function obterUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function obterCompras() {
    return JSON.parse(localStorage.getItem("compras")) || [];
}

function salvarCompras(compras) {
    localStorage.setItem("compras", JSON.stringify(compras));
}

// LOGIN
const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value;

        if (email === "admin@horizon.com" && senha === "123") {
    localStorage.setItem("usuarioLogado", "admin");
    window.location.href = "admin.html";
    return;
}

        const usuarios = obterUsuarios();

        const usuario = usuarios.find(function(u) {
            return u.email === email && u.senha === senha;
        });

        const clienteDemo =
            email === "cliente@email.com" && senha === "123";

        if (usuario || clienteDemo) {
            localStorage.setItem("usuarioLogado", email);
            window.location.href = "produtos.html";
        } else {
            alert("E-mail ou senha incorretos!");
        }
    });
}

// CADASTRO
const cadastroForm = document.getElementById("cadastro-form");

if (cadastroForm) {
    cadastroForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("reg-nome").value.trim();
        const sobrenome = document.getElementById("reg-sobrenome").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const telefone = document.getElementById("reg-telefone").value.trim();
        const nascimento = document.getElementById("reg-nascimento").value;
        const senha = document.getElementById("reg-senha").value;

        if (nome.length < 3) {
            alert("O nome deve ter pelo menos 3 caracteres.");
            return;
        }

        if (sobrenome.length < 3) {
            alert("O sobrenome deve ter pelo menos 3 caracteres.");
            return;
        }

        if (!email) {
            alert("Informe seu e-mail.");
            return;
        }

        if (!nascimento) {
            alert("Informe sua data de nascimento.");
            return;
        }

        const dataNascimento = new Date(nascimento + "T00:00:00");
        const hoje = new Date();

        if (isNaN(dataNascimento.getTime())) {
            alert("Informe uma data de nascimento válida.");
            return;
        }

        if (dataNascimento > hoje) {
            alert("A data de nascimento não pode ser futura.");
            return;
        }

        let idade =
            hoje.getFullYear() - dataNascimento.getFullYear();

        const mes =
            hoje.getMonth() - dataNascimento.getMonth();

        if (
            mes < 0 ||
            (mes === 0 && hoje.getDate() < dataNascimento.getDate())
        ) {
            idade--;
        }

        if (idade < 17) {
            alert(
                "O cadastro é permitido somente para pessoas com 17 anos ou mais."
            );
            return;
        }

        const usuarios = obterUsuarios();

        const existe = usuarios.some(function(usuario) {
            return usuario.email.toLowerCase() === email.toLowerCase();
        });

        if (existe) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        const novoUsuario = {
            nome: nome,
            sobrenome: sobrenome,
            email: email,
            telefone: telefone,
            nascimento: nascimento,
            senha: senha
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);

        alert("Sua conta foi criada com sucesso!");

        window.location.href = "index.html";
    });
}

// COMPRA
function irParaCompra(destino, preco) {
    localStorage.setItem("destinoSelecionado", destino);
    localStorage.setItem("precoSelecionado", preco);
    window.location.href = "compra.html";
}

// DESTINO DA COMPRA
const destinoInput =
    document.getElementById("compra-destino");

if (destinoInput) {
    const destino =
        localStorage.getItem("destinoSelecionado");

    const preco =
        Number(localStorage.getItem("precoSelecionado"));

    if (destino) {
        destinoInput.value =
            destino +
            " - R$ " +
            preco.toLocaleString("pt-BR", {
                minimumFractionDigits: 2
            });
    }
}

// DATA ATUAL
function obterDataHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes =
        String(hoje.getMonth() + 1).padStart(2, "0");

    const dia =
        String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// DATAS DA VIAGEM
const campoDataIda =
    document.getElementById("compra-data-ida");

const campoDataVolta =
    document.getElementById("compra-data-volta");

if (campoDataIda) {
    campoDataIda.min = obterDataHoje();
}

if (campoDataIda && campoDataVolta) {
    campoDataIda.addEventListener("change", function() {
        campoDataVolta.min = campoDataIda.value;

        if (
            campoDataVolta.value &&
            campoDataVolta.value < campoDataIda.value
        ) {
            campoDataVolta.value = "";

            alert(
                "A data de retorno não pode ser anterior à data de ida."
            );
        }
    });

    campoDataVolta.addEventListener("change", function() {
        if (
            campoDataIda.value &&
            campoDataVolta.value &&
            campoDataVolta.value < campoDataIda.value
        ) {
            campoDataVolta.value = "";

            alert(
                "A data de retorno não pode ser anterior à data de ida."
            );
        }
    });
}

// FINALIZAR COMPRA
const compraForm =
    document.getElementById("compra-form");

if (compraForm) {
    compraForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const destino =
            localStorage.getItem("destinoSelecionado");

        const preco =
            Number(localStorage.getItem("precoSelecionado"));

        const nome =
            document.getElementById("compra-nome").value.trim();

        const cpf =
            document.getElementById("compra-cpf").value.trim();

        const dataIda =
            document.getElementById("compra-data-ida").value;

        const dataVolta =
            document.getElementById("compra-data-volta").value;

        const pagamento =
            document.getElementById("compra-pagamento").value;

        if (!dataIda || !dataVolta) {
            alert(
                "Informe a data de ida e a data de retorno."
            );
            return;
        }

        if (dataIda < obterDataHoje()) {
            alert(
                "A data de ida não pode ser anterior a hoje."
            );
            return;
        }

        const ida =
            new Date(dataIda + "T00:00:00");

        const volta =
            new Date(dataVolta + "T00:00:00");

        if (
            isNaN(ida.getTime()) ||
            isNaN(volta.getTime())
        ) {
            alert("Informe datas válidas para a viagem.");
            return;
        }

        if (volta < ida) {
            alert(
                "A data de retorno não pode ser anterior à data de ida."
            );
            return;
        }

        let valorFinal = preco;

        if (pagamento === "PIX") {
            valorFinal = preco * 0.95;
        }

        const compra = {
            destino: destino,
            preco: preco,
            valorFinal: valorFinal,
            cliente: nome,
            cpf: cpf,
            dataIda: dataIda,
            dataVolta: dataVolta,
            pagamento: pagamento,
            dataCompra:
                new Date().toLocaleDateString("pt-BR")
        };

        const compras = obterCompras();

        compras.push(compra);
        salvarCompras(compras);

        alert(
            "Parabéns!\n\nSua viagem foi comprada com sucesso!"
        );

        localStorage.removeItem("destinoSelecionado");
        localStorage.removeItem("precoSelecionado");

        window.location.href = "produtos.html";
    });
}

// ADMIN
const listaCompras =
    document.getElementById("lista-compras");

if (listaCompras) {
    carregarComprasAdmin();
}

function carregarComprasAdmin() {
    const compras = obterCompras();

    const total =
        document.getElementById("total-compras");

    if (total) {
        total.textContent = compras.length;
    }

    if (compras.length === 0) {
        listaCompras.innerHTML = `
            <p class="empty">Nenhuma compra realizada.</p>
        `;
        return;
    }

    listaCompras.innerHTML = "";

    compras.forEach(function(compra, index) {
        const item = document.createElement("div");

        item.className = "compra-item";

        item.innerHTML = `
            <strong>Compra #${index + 1}</strong>
            <br><br>
            <strong>Destino:</strong> ${compra.destino}
            <br>
            <strong>Passageiro:</strong> ${compra.cliente}
            <br>
            <strong>CPF:</strong> ${compra.cpf}
            <br>
            <strong>Data de Ida:</strong> ${formatarData(compra.dataIda)}
            <br>
            <strong>Data de Retorno:</strong> ${formatarData(compra.dataVolta)}
            <br>
            <strong>Pagamento:</strong> ${compra.pagamento}
            <br>
            <strong>Valor:</strong> R$ ${compra.valorFinal.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2
                }
            )}
            <br>
            <strong>Data da Compra:</strong> ${compra.dataCompra}
        `;

        listaCompras.appendChild(item);
    });
}

// FORMATAR DATA
function formatarData(data) {
    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );
}

// CONTINENTES
function mostrarContinente(continente) {
    const destinos =
        document.querySelectorAll(".destinos");

    destinos.forEach(function(secao) {
        secao.classList.add("hidden");
    });

    const selecionado =
        document.getElementById(continente);

    if (selecionado) {
        selecionado.classList.remove("hidden");

        selecionado.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// LOGOUT
function sair() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("destinoSelecionado");
    localStorage.removeItem("precoSelecionado");

    window.location.href = "index.html";
