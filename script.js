// =====================================================
// HORIZONTE VIAGENS
// JAVASCRIPT PRINCIPAL
// =====================================================


// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function obterUsuarios() {

    return JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];
}


function salvarUsuarios(usuarios) {

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );
}


function obterCompras() {

    return JSON.parse(
        localStorage.getItem("compras")
    ) || [];
}


function salvarCompras(compras) {

    localStorage.setItem(
        "compras",
        JSON.stringify(compras)
    );
}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("login-form");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "login-email"
                ).value.trim();


            const senha =
                document.getElementById(
                    "login-senha"
                ).value;


            // -----------------------------------------
            // ADMIN
            // -----------------------------------------

            if (
                email === "admin@horizon.com" &&
                senha === "123"
            ) {

                localStorage.setItem(
                    "usuarioLogado",
                    "admin"
                );


                window.location.href =
                    "admin.html";


                return;
            }


            // -----------------------------------------
            // CLIENTE
            // -----------------------------------------

            const usuarios =
                obterUsuarios();


            const usuario =
                usuarios.find(
                    function (u) {

                        return (
                            u.email === email &&
                            u.senha === senha
                        );

                    }
                );


            // Cliente demonstrativo

            const clienteDemo =
                email === "cliente@email.com" &&
                senha === "123";


            if (usuario || clienteDemo) {

                localStorage.setItem(
                    "usuarioLogado",
                    email
                );


                window.location.href =
                    "produtos.html";

            } else {

                alert(
                    "E-mail ou senha incorretos!"
                );
            }

        }
    );
}


// =====================================================
// CADASTRO
// =====================================================

const cadastroForm =
    document.getElementById(
        "cadastro-form"
    );


if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nome =
                document.getElementById(
                    "reg-nome"
                ).value.trim();


            const sobrenome =
                document.getElementById(
                    "reg-sobrenome"
                ).value.trim();


            const email =
                document.getElementById(
                    "reg-email"
                ).value.trim();


            const telefone =
                document.getElementById(
                    "reg-telefone"
                ).value.trim();


            const nascimento =
                document.getElementById(
                    "reg-nascimento"
                ).value;


            const senha =
                document.getElementById(
                    "reg-senha"
                ).value;


            const usuarios =
                obterUsuarios();


            // Verificar e-mail existente

            const existe =
                usuarios.some(
                    function (usuario) {

                        return (
                            usuario.email === email
                        );

                    }
                );


            if (existe) {

                alert(
                    "Este e-mail já está cadastrado."
                );


                return;
            }


            // Criar usuário

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


            alert(
                "Conta criada com sucesso!"
            );


            window.location.href =
                "index.html";

        }
    );
}


// =====================================================
// IR PARA COMPRA
// =====================================================

function irParaCompra(
    destino,
    preco
) {

    localStorage.setItem(
        "destinoSelecionado",
        destino
    );


    localStorage.setItem(
        "precoSelecionado",
        preco
    );


    window.location.href =
        "compra.html";
}


// =====================================================
// CARREGAR DESTINO NA PÁGINA DE COMPRA
// =====================================================

const destinoInput =
    document.getElementById(
        "compra-destino"
    );


if (destinoInput) {

    const destino =
        localStorage.getItem(
            "destinoSelecionado"
        );


    const preco =
        Number(
            localStorage.getItem(
                "precoSelecionado"
            )
        );


    if (destino) {

        destinoInput.value =
            destino +
            " - R$ " +
            preco.toLocaleString(
                "pt-BR",
                {
                    minimumFractionDigits: 2
                }
            );
    }
}


// =====================================================
// VALIDAÇÃO DAS DATAS DE VIAGEM
// =====================================================

const campoDataIda =
    document.getElementById(
        "compra-data-ida"
    );

const campoDataVolta =
    document.getElementById(
        "compra-data-volta"
    );


if (campoDataIda && campoDataVolta) {

    campoDataIda.addEventListener(
        "change",
        function () {

            // -----------------------------------------
            // A DATA DE RETORNO NÃO PODE SER ANTES
            // DA DATA DE IDA
            // -----------------------------------------

            campoDataVolta.min =
                campoDataIda.value;


            // Se o usuário já tiver colocado
            // uma data de retorno inválida

            if (
                campoDataVolta.value &&
                campoDataVolta.value < campoDataIda.value
            ) {

                campoDataVolta.value = "";


                alert(
                    "A data de retorno não pode ser anterior à data de ida."
                );
            }

        }
    );


    campoDataVolta.addEventListener(
        "change",
        function () {

            // -----------------------------------------
            // SEGUNDA VERIFICAÇÃO
            // -----------------------------------------

            if (
                campoDataIda.value &&
                campoDataVolta.value &&
                campoDataVolta.value < campoDataIda.value
            ) {

                campoDataVolta.value = "";


                alert(
                    "Data inválida!\n\n" +
                    "A data de retorno não pode ser anterior à data de ida."
                );
            }

        }
    );
}


// =====================================================
// FINALIZAR COMPRA
// =====================================================

const compraForm =
    document.getElementById(
        "compra-form"
    );


if (compraForm) {

    compraForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const destino =
                localStorage.getItem(
                    "destinoSelecionado"
                );


            const preco =
                Number(
                    localStorage.getItem(
                        "precoSelecionado"
                    )
                );


            const nome =
                document.getElementById(
                    "compra-nome"
                ).value.trim();


            const cpf =
                document.getElementById(
                    "compra-cpf"
                ).value.trim();


            const dataIda =
                document.getElementById(
                    "compra-data-ida"
                ).value;


            const dataVolta =
                document.getElementById(
                    "compra-data-volta"
                ).value;


            const pagamento =
                document.getElementById(
                    "compra-pagamento"
                ).value;


            // -----------------------------------------
            // VALIDAR DATAS
            // -----------------------------------------

            if (!dataIda || !dataVolta) {

                alert(
                    "Informe a data de ida e a data de retorno."
                );

                return;
            }


            // Converter as datas para objetos Date

            const ida =
                new Date(
                    dataIda + "T00:00:00"
                );


            const volta =
                new Date(
                    dataVolta + "T00:00:00"
                );


            // Verificar se as datas são válidas

            if (
                isNaN(ida.getTime()) ||
                isNaN(volta.getTime())
            ) {

                alert(
                    "Informe datas válidas para a viagem."
                );

                return;
            }


            // -----------------------------------------
            // RETORNO NÃO PODE SER ANTES DA IDA
            // -----------------------------------------

            if (volta < ida) {

                alert(
                    "Data inválida!\n\n" +
                    "A data de retorno não pode ser anterior à data de ida."
                );


                // Limpar a data inválida

                document.getElementById(
                    "compra-data-volta"
                ).value = "";


                document.getElementById(
                    "compra-data-volta"
                ).focus();


                return;
            }


            // -----------------------------------------
            // CALCULAR VALOR
            // -----------------------------------------

            let valorFinal = preco;


            if (pagamento === "PIX") {

                valorFinal =
                    preco * 0.95;
            }


            // -----------------------------------------
            // CRIAR COMPRA
            // -----------------------------------------

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
                    new Date().toLocaleDateString(
                        "pt-BR"
                    )
            };


            const compras =
                obterCompras();


            compras.push(compra);


            salvarCompras(compras);


            alert(
                "Parabéns!\n\n" +
                "Sua viagem foi comprada com sucesso!"
            );


            // Limpar seleção

            localStorage.removeItem(
                "destinoSelecionado"
            );


            localStorage.removeItem(
                "precoSelecionado"
            );


            window.location.href =
                "produtos.html";

        }
    );
}


// =====================================================
// PAINEL ADMINISTRATIVO
// =====================================================

const listaCompras =
    document.getElementById(
        "lista-compras"
    );


if (listaCompras) {

    carregarComprasAdmin();
}


function carregarComprasAdmin() {

    const compras =
        obterCompras();


    const total =
        document.getElementById(
            "total-compras"
        );


    if (total) {

        total.textContent =
            compras.length;
    }


    if (compras.length === 0) {

        listaCompras.innerHTML = `
            <p class="empty">
                Nenhuma compra realizada.
            </p>
        `;


        return;
    }


    listaCompras.innerHTML = "";


    compras.forEach(
        function (compra, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "compra-item";


            item.innerHTML = `

                <strong>
                    Compra #${index + 1}
                </strong>

                <br><br>

                <strong>
                    Destino:
                </strong>
                ${compra.destino}

                <br>

                <strong>
                    Passageiro:
                </strong>
                ${compra.cliente}

                <br>

                <strong>
                    CPF:
                </strong>
                ${compra.cpf}

                <br>

                <strong>
                    Data de Ida:
                </strong>
                ${formatarData(compra.dataIda)}

                <br>

                <strong>
                    Data de Retorno:
                </strong>
                ${formatarData(compra.dataVolta)}

                <br>

                <strong>
                    Pagamento:
                </strong>
                ${compra.pagamento}

                <br>

                <strong>
                    Valor:
                </strong>
                R$ ${compra.valorFinal.toLocaleString(
                    "pt-BR",
                    {
                        minimumFractionDigits: 2
                    }
                )}

                <br>

                <strong>
                    Data da Compra:
                </strong>
                ${compra.dataCompra}

            `;


            listaCompras.appendChild(
                item
            );
        }
    );
}


// =====================================================
// FORMATAR DATA
// =====================================================

function formatarData(data) {

    if (!data) {
        return "";
    }


    const partes =
        data.split("-");


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


// =====================================================
// LOGOUT
// =====================================================

function sair() {

    localStorage.removeItem(
        "usuarioLogado"
    );


    localStorage.removeItem(
        "destinoSelecionado"
    );


    localStorage.removeItem(
        "precoSelecionado"
    );


    window.location.href =
        "index.html";
}
