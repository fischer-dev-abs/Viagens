
// 

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

const EMAIL_ADMIN = "admin@horizon.com";
const SENHA_ADMIN = "123";

// 4. LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value;

        if (email.toLowerCase() === EMAIL_ADMIN && senha === SENHA_ADMIN) {
            localStorage.setItem("usuarioLogado", "admin");
            window.location.href = "admin.html";
            return;
        }

        const usuarios = obterUsuarios();
        const usuario = usuarios.find(function(u) {
            return u.email.toLowerCase() === email.toLowerCase() && u.senha === senha;
        });

        const clienteDemo = email.toLowerCase() === "cliente@email.com" && senha === "123";

        if (usuario || clienteDemo) {
            localStorage.setItem("usuarioLogado", email);
            window.location.href = "produtos.html";
        } else {
            alert("E-mail ou senha incorretos!");
        }
    });
}

// 5. CADASTRO
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
            document.getElementById("reg-nome").focus();
            return;
        }
        if (sobrenome.length < 3) {
            alert("O sobrenome deve ter pelo menos 3 caracteres.");
            document.getElementById("reg-sobrenome").focus();
            return;
        }
        if (!email || !telefone || !nascimento || !senha) {
            alert("Preencha todos os campos.");
            return;
        }

        const dataNascimento = new Date(nascimento + "T00:00:00");
        const hoje = new Date();
        if (isNaN(dataNascimento.getTime()) || dataNascimento > hoje) {
            alert("Informe uma data de nascimento válida.");
            return;
        }

        let idade = hoje.getFullYear() - dataNascimento.getFullYear();
        const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
        if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
        }
        if (idade < 17) {
            alert("O cadastro é permitido somente para pessoas com 17 anos ou mais.");
            document.getElementById("reg-nascimento").focus();
            return;
        }

        const usuarios = obterUsuarios();
        const existe = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (existe) {
            alert("Este e-mail já está cadastrado.");
            return;
        }
        if (email.toLowerCase() === EMAIL_ADMIN) {
            alert("Este e-mail está reservado para a administração.");
            return;
        }

        usuarios.push({ nome, sobrenome, email, telefone, nascimento, senha });
        salvarUsuarios(usuarios);
        alert("Sua conta foi criada com sucesso!");
        window.location.href = "index.html";
    });
}

// 6. ESCOLHER DESTINO
function irParaCompra(destino, preco) {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (!usuarioLogado || usuarioLogado === "admin") {
        alert("Entre em uma conta de cliente para comprar uma viagem.");
        window.location.href = "index.html";
        return;
    }
    localStorage.setItem("destinoSelecionado", destino);
    localStorage.setItem("precoSelecionado", preco);
    window.location.href = "compra.html";
}

// 7. PREENCHER DESTINO NA COMPRA
const destinoInput = document.getElementById("compra-destino");
if (destinoInput) {
    const destino = localStorage.getItem("destinoSelecionado");
    const preco = Number(localStorage.getItem("precoSelecionado"));
    if (destino) {
        destinoInput.value = destino + " - R$ " + preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}

// 8. DATA ATUAL
function obterDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

// 9. VALIDAR DATAS
const campoDataIda = document.getElementById("compra-data-ida");
const campoDataVolta = document.getElementById("compra-data-volta");

if (campoDataIda) {
    campoDataIda.min = obterDataHoje();
}
if (campoDataIda && campoDataVolta) {
    campoDataVolta.min = campoDataIda.value || obterDataHoje();
    
    campoDataIda.addEventListener("change", function() {
        campoDataVolta.min = campoDataIda.value || obterDataHoje();
        if (campoDataVolta.value && campoDataVolta.value < campoDataIda.value) {
            campoDataVolta.value = "";
            alert("A data de retorno não pode ser anterior à data de ida.");
        }
    });

    campoDataVolta.addEventListener("change", function() {
        if (campoDataIda.value && campoDataVolta.value && campoDataVolta.value < campoDataIda.value) {
            campoDataVolta.value = "";
            alert("A data de retorno não pode ser anterior à data de ida.");
        }
    });
}

// 10. FINALIZAR COMPRA
const compraForm = document.getElementById("compra-form");
if (compraForm) {
    compraForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const usuarioLogado = localStorage.getItem("usuarioLogado");
        if (!usuarioLogado || usuarioLogado === "admin") {
            alert("Entre em uma conta de cliente para realizar uma compra.");
            window.location.href = "index.html";
            return;
        }

        const destino = localStorage.getItem("destinoSelecionado");
        const preco = Number(localStorage.getItem("precoSelecionado"));
        const nome = document.getElementById("compra-nome").value.trim();
        const cpf = document.getElementById("compra-cpf").value.trim();
        const dataIda = document.getElementById("compra-data-ida").value;
        const dataVolta = document.getElementById("compra-data-volta").value;
        const pagamento = document.getElementById("compra-pagamento").value;

        if (!destino || !Number.isFinite(preco) || preco <= 0) {
            alert("Destino ou preço inválido. Escolha a viagem novamente.");
            window.location.href = "produtos.html";
            return;
        }
        if (!nome || !cpf) {
            alert("Preencha o nome e o CPF do passageiro.");
            return;
        }
        if (!dataIda || !dataVolta) {
            alert("Informe a data de ida e a data de retorno.");
            return;
        }
        if (dataIda < obterDataHoje()) {
            alert("A data de ida não pode ser anterior a hoje.");
            campoDataIda.focus();
            return;
        }

        const ida = new Date(dataIda + "T00:00:00");
        const volta = new Date(dataVolta + "T00:00:00");
        if (isNaN(ida.getTime()) || isNaN(volta.getTime())) {
            alert("Informe datas válidas para a viagem.");
            return;
        }
        if (volta < ida) {
            alert("A data de retorno não pode ser anterior à data de ida.");
            campoDataVolta.focus();
            return;
        }
        if (!pagamento) {
            alert("Selecione uma forma de pagamento.");
            return;
        }

        let valorFinal = pagamento === "PIX" ? preco * 0.95 : preco;

        const compras = obterCompras();
        compras.push({
            destino, preco, valorFinal, cliente: nome, cpf,
            emailCliente: usuarioLogado, dataIda, dataVolta, pagamento,
            dataCompra: new Date().toLocaleDateString("pt-BR")
        });
        
        salvarCompras(compras);
        alert("Parabéns!\n\nSua viagem foi comprada com sucesso!");
        localStorage.removeItem("destinoSelecionado");
        localStorage.removeItem("precoSelecionado");
        window.location.href = "produtos.html";
    });
}

// 11. BOTAO ADMIN
function acessarAdmin() {
    const email = prompt("Digite o e-mail do administrador:");
    if (email === null) return;
    const senha = prompt("Digite a senha do administrador:");
    if (senha === null) return;

    if (email.trim().toLowerCase() === EMAIL_ADMIN && senha === SENHA_ADMIN) {
        localStorage.setItem("usuarioLogado", "admin");
        window.location.href = "admin.html";
    } else {
        alert("E-mail ou senha de administrador incorretos!");
    }
}

// 12. PAINEL ADMINISTRATIVO
const listaCompras = document.getElementById("lista-compras");
if (listaCompras) {
    if (localStorage.getItem("usuarioLogado") !== "admin") {
        alert("Acesso restrito! Entre como administrador.");
        window.location.replace("index.html");
    } else {
        carregarComprasAdmin();
    }
}

function carregarComprasAdmin() {
    const compras = obterCompras();
    const total = document.getElementById("total-compras");
    if (total) total.textContent = compras.length;
    if (!listaCompras) return;

    if (compras.length === 0) {
        listaCompras.innerHTML = '<p class="empty">Nenhuma compra realizada.</p>';
        return;
    }

    listaCompras.innerHTML = "";
    compras.forEach(function(compra, index) {
        const item = document.createElement("div");
        item.className = "compra-item";
        
        const titulo = document.createElement("strong");
        titulo.textContent = `Compra #${index + 1}`;
        item.appendChild(titulo);
        item.appendChild(document.createElement("br"));
        item.appendChild(document.createElement("br"));

        function adicionarCampo(rotulo, valor) {
            const label = document.createElement("strong");
            label.textContent = rotulo + ": ";
            item.appendChild(label);
            const texto = document.createElement("span");
            texto.textContent = (valor === undefined || valor === null) ? "" : String(valor);
            item.appendChild(texto);
            item.appendChild(document.createElement("br"));
        }

        adicionarCampo("Destino", compra.destino);
        adicionarCampo("Passageiro", compra.cliente);
        adicionarCampo("CPF", compra.cpf);
        adicionarCampo("E-mail", compra.emailCliente);
        adicionarCampo("Data de Ida", formatarData(compra.dataIda));
        adicionarCampo("Data de Retorno", formatarData(compra.dataVolta));
        adicionarCampo("Pagamento", compra.pagamento);
        
        const valorFinal = Number(compra.valorFinal);
        adicionarCampo("Valor", Number.isFinite(valorFinal) ? "R$ " + valorFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "Não informado");
        adicionarCampo("Data da Compra", compra.dataCompra);
        
        listaCompras.appendChild(item);
    });
}

// 13. FORMATAR DATA
function formatarData(data) {
    if (!data) return "";
    const partes = data.split("-");
    return partes.length !== 3 ? data : `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// 14. MOSTRAR CONTINENTE
function mostrarContinente(continente) {
    document.querySelectorAll(".destinos").forEach(secao => secao.classList.add("hidden"));
    const selecionado = document.getElementById(continente);
    if (selecionado) {
        selecionado.classList.remove("hidden");
        selecionado.scrollIntoView({ behavior: "smooth" });
    }
}

// 15. SAIR
function sair() {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("destinoSelecionado");
    localStorage.removeItem("precoSelecionado");
    window.location.href = "index.html";
}

// 16. LOGIN EXCLUSIVO DO ADMINISTRADOR
const adminLoginForm = document.getElementById("admin-login-form");
if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document
            .getElementById("admin-email")
            .value.trim()
            .toLowerCase();
        const senha = document
            .getElementById("admin-senha")
            .value;
        const mensagemErro = document.getElementById("admin-erro");
        if (
            email === EMAIL_ADMIN.toLowerCase() &&
            senha === SENHA_ADMIN
        ) {
            localStorage.setItem("usuarioLogado", "admin");
            window.location.href = "admin.html";
        } else {
            mensagemErro.textContent =
                "E-mail ou senha de administrador incorretos.";
        }
    });
}
