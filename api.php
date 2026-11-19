<?php
// API simples: o JavaScript (script.js) chama este arquivo e ele conversa com o MySQL.
// Ajuste aqui se o seu MySQL tiver senha ou outra porta.
const DB_HOST    = '127.0.0.1';
const DB_PORT    = '3306';
const DB_NOME    = 'horizonteviagens';
const DB_USUARIO = 'root';
const DB_SENHA   = '';

session_start();
date_default_timezone_set('America/Sao_Paulo');
header('Content-Type: application/json; charset=utf-8');

function resposta(array $dados): never
{
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function erro(string $msg): never
{
    resposta(['ok' => false, 'erro' => $msg]);
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NOME . ';charset=utf8mb4',
        DB_USUARIO, DB_SENHA,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    erro('Não foi possível conectar ao banco. Verifique se o MySQL está ligado e o api.php.');
}

$d = json_decode(file_get_contents('php://input'), true) ?: [];
$acao = $d['acao'] ?? '';

try {
    switch ($acao) {

        // Login de cliente (tabela clientes) ou administrador (tabela admin)
        case 'login':
        case 'login_admin':
            $email = trim($d['email'] ?? '');
            $senha = (string) ($d['senha'] ?? '');

            $st = $pdo->prepare('SELECT idAdmin FROM admin WHERE email = ? AND senha = ?');
            $st->execute([$email, $senha]);
            if ($st->fetch()) {
                $_SESSION['admin'] = true;
                resposta(['ok' => true, 'tipo' => 'admin']);
            }
            if ($acao === 'login_admin') erro('E-mail ou senha de administrador incorretos.');

            $st = $pdo->prepare('SELECT idCliente FROM clientes WHERE email = ? AND senha = ?');
            $st->execute([$email, $senha]);
            if ($st->fetch()) resposta(['ok' => true, 'tipo' => 'cliente']);
            erro('E-mail ou senha incorretos!');

        // Cadastro de cliente
        case 'cadastro':
            $nome       = trim($d['nome'] ?? '');
            $sobrenome  = trim($d['sobrenome'] ?? '');
            $email      = trim($d['email'] ?? '');
            $telefone   = trim($d['telefone'] ?? '');
            $nascimento = $d['nascimento'] ?? '';
            $senha      = (string) ($d['senha'] ?? '');

            if (mb_strlen($nome) > 15) erro('O nome pode ter no máximo 15 caracteres.');
            if (mb_strlen($sobrenome) > 20) erro('O sobrenome pode ter no máximo 20 caracteres.');
            if (mb_strlen($email) > 50) erro('O e-mail pode ter no máximo 50 caracteres.');
            if (mb_strlen($telefone) > 16) erro('O telefone pode ter no máximo 16 caracteres.');
            if (mb_strlen($senha) > 20) erro('A senha pode ter no máximo 20 caracteres.');

            $st = $pdo->prepare('SELECT 1 FROM clientes WHERE email = ? UNION SELECT 1 FROM admin WHERE email = ?');
            $st->execute([$email, $email]);
            if ($st->fetch()) erro('Este e-mail já está cadastrado.');

            $st = $pdo->prepare(
                'INSERT INTO clientes (nome, sobrenome, email, telefone, dataNascimento, senha) VALUES (?, ?, ?, ?, ?, ?)'
            );
            $st->execute([$nome, $sobrenome, $email, $telefone, $nascimento, $senha]);
            resposta(['ok' => true]);

        // Finalizar compra (grava na tabela viagens)
        case 'compra':
            $pagamento = (string) ($d['pagamento'] ?? '');
            $preco = (int) ($d['preco'] ?? 0);
            if ($preco <= 0) erro('Destino ou preço inválido.');
            $valor = $pagamento === 'PIX' ? (int) round($preco * 0.95) : $preco;

            $st = $pdo->prepare(
                'INSERT INTO viagens (destino, passageiro, cpf, email, dataIda, dataRetorno, pagamento, valor, dataCompra)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $st->execute([
                mb_substr((string) ($d['destino'] ?? ''), 0, 50),
                mb_substr((string) ($d['nome'] ?? ''), 0, 150),
                mb_substr((string) ($d['cpf'] ?? ''), 0, 14),
                mb_substr((string) ($d['email'] ?? ''), 0, 50),
                $d['dataIda'] ?? '', $d['dataVolta'] ?? '',
                mb_substr($pagamento, 0, 20), $valor, date('Y-m-d'),
            ]);
            resposta(['ok' => true]);

        // Lista de compras para o painel (só quem entrou como admin)
        case 'listar_compras':
            if (empty($_SESSION['admin'])) erro('Acesso restrito! Entre como administrador.');
            $compras = $pdo->query('SELECT * FROM viagens ORDER BY idCompra')->fetchAll();
            resposta(['ok' => true, 'compras' => $compras]);

        case 'sair':
            $_SESSION = [];
            resposta(['ok' => true]);

        default:
            erro('Ação inválida.');
    }
} catch (PDOException $e) {
    erro('Erro no banco de dados: ' . $e->getMessage());
}
