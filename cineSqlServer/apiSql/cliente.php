<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$serverName = '(localdb)\\carolina';
$database = 'cinebd';

try {
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database;Encrypt=no;TrustServerCertificate=yes", null, null);
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
                $stmt = $conn->prepare("SELECT * FROM cliente WHERE id = ?");
                $stmt->execute([$id]);
                $cliente = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($cliente);
            } elseif ($search) {
                $searchTerm = "%" . $search . "%";
                $stmt = $conn->prepare("SELECT * FROM cliente WHERE nombre LIKE ? OR apellido LIKE ? OR telefono LIKE ?");
                $stmt->execute([$searchTerm, $searchTerm, $searchTerm]);
                $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($clientes);
            } else {
                $stmt = $conn->query("SELECT * FROM cliente");
                $clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($clientes);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? uniqid();
            $nombre = $data['nombre'] ?? '';
            $apellido = $data['apellido'] ?? '';
            $edad = $data['edad'] ?? 0;
            $telefono = $data['telefono'] ?? '';
            if (empty($nombre) || empty($apellido) || empty($edad) || empty($telefono)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos (nombre, apellido, edad, telefono)"]);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO cliente (id, nombre, apellido, edad, telefono) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$id, $nombre, $apellido, $edad, $telefono]);
            http_response_code(201);
            echo json_encode(["message" => "Cliente creado", "id" => $id]);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? '';
            $nombre = $data['nombre'] ?? '';
            $apellido = $data['apellido'] ?? '';
            $edad = $data['edad'] ?? 0;
            $telefono = $data['telefono'] ?? '';
            if (empty($id) || empty($nombre) || empty($apellido) || empty($edad) || empty($telefono)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos (id, nombre, apellido, edad, telefono)"]);
                exit();
            }
            $stmt = $conn->prepare("UPDATE cliente SET nombre = ?, apellido = ?, edad = ?, telefono = ? WHERE id = ?");
            $stmt->execute([$nombre, $apellido, $edad, $telefono, $id]);
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
            $stmt = $conn->prepare("DELETE FROM cliente WHERE id = ?");
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
