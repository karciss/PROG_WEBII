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
            if ($id) {
                $stmt = $conn->prepare("SELECT * FROM sala WHERE id = ?");
                $stmt->execute([$id]);
                $sala = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($sala);
            } else {
                $stmt = $conn->query("SELECT * FROM sala");
                $salas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($salas);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? uniqid();
            $nro_sala = $data['nro_sala'] ?? '';
            $capacidad = $data['capacidad'] ?? 0;
            if (empty($nro_sala) || empty($capacidad)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO sala (id, nro_sala, capacidad) VALUES (?, ?, ?)");
            $stmt->execute([$id, $nro_sala, $capacidad]);
            http_response_code(201);
            echo json_encode(["message" => "Sala creada", "id" => $id]);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? '';
            $nro_sala = $data['nro_sala'] ?? '';
            $capacidad = $data['capacidad'] ?? 0;
            if (empty($id) || empty($nro_sala) || empty($capacidad)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("UPDATE sala SET nro_sala = ?, capacidad = ? WHERE id = ?");
            $stmt->execute([$nro_sala, $capacidad, $id]);
            http_response_code(200);
            echo json_encode(["message" => "Sala actualizada"]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit();
            }
            $stmt = $conn->prepare("DELETE FROM sala WHERE id = ?");
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(["message" => "Sala eliminada"]);
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
