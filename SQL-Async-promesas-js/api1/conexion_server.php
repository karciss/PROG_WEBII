<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$serverName = '(localdb)\carolina';
$database = 'doguitodb';

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database;Encrypt=yes;TrustServerCertificate=yes", null, null);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Conexión fallida: " . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $id = $_GET['id'] ?? null;
            $search = $_GET['search'] ?? null;

            if ($id) {
                $stmt = $conn->prepare("SELECT * FROM perfil WHERE id = ?");
                $stmt->execute([$id]);
                $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($cliente);
            } elseif ($search) {
                $searchTerm = "%" . $search . "%";
                $stmt = $conn->prepare("SELECT * FROM perfil WHERE nombre LIKE ? OR email LIKE ?");
                $stmt->execute([$searchTerm, $searchTerm]);
                $clientes = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $clientes[] = $row;
                }
                echo json_encode($clientes);
            } else {
                $stmt = $conn->query("SELECT * FROM perfil");
                $clientes = [];
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $clientes[] = $row;
                }
                echo json_encode($clientes);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? uniqid();
            $nombre = $data['nombre'] ?? '';
            $email = $data['email'] ?? '';
            if (empty($nombre) || empty($email)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos (nombre y email son obligatorios)"]);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO perfil (id, nombre, email) VALUES (?, ?, ?)");
            $stmt->execute([$id, $nombre, $email]);
            http_response_code(201);
            echo json_encode(["message" => "Cliente creado", "id" => $id]);
            break;

        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? '';
            $nombre = $data['nombre'] ?? '';
            $email = $data['email'] ?? '';
            if (empty($id) || empty($nombre) || empty($email)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos (id, nombre y email son obligatorios)"]);
                exit();
            }
            $stmt = $conn->prepare("UPDATE perfil SET nombre = ?, email = ? WHERE id = ?");
            $stmt->execute([$nombre, $email, $id]);
            http_response_code(200);
            echo json_encode(["message" => "Cliente actualizado"]);
            break;

        case 'DELETE':
            $id = $_GET['id'] ?? '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit();
            }
            $stmt = $conn->prepare("DELETE FROM perfil WHERE id = ?");
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(["message" => "Cliente eliminado"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Método no permitido"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en la consulta: " . $e->getMessage()]);
}

$conn = null;
?>