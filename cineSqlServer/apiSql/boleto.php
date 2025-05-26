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
            if ($id) {
                $stmt = $conn->prepare("SELECT * FROM boleto WHERE id = ?");
                $stmt->execute([$id]);
                $boleto = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($boleto);
            } else {
                $stmt = $conn->query("SELECT * FROM boleto");
                $boletos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($boletos);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? uniqid();
            $nro_asiento = $data['nro_asiento'] ?? 0;
            $id_programacion = $data['id_programacion'] ?? '';
            $id_cliente = $data['id_cliente'] ?? '';
            if (empty($nro_asiento) || empty($id_programacion) || empty($id_cliente)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO boleto (id, nro_asiento, id_programacion, id_cliente) VALUES (?, ?, ?, ?)");
            $stmt->execute([$id, $nro_asiento, $id_programacion, $id_cliente]);
            http_response_code(201);
            echo json_encode(["message" => "Boleto creado", "id" => $id]);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? '';
            $nro_asiento = $data['nro_asiento'] ?? 0;
            $id_programacion = $data['id_programacion'] ?? '';
            $id_cliente = $data['id_cliente'] ?? '';
            if (empty($id) || empty($nro_asiento) || empty($id_programacion) || empty($id_cliente)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("UPDATE boleto SET nro_asiento = ?, id_programacion = ?, id_cliente = ? WHERE id = ?");
            $stmt->execute([$nro_asiento, $id_programacion, $id_cliente, $id]);
            http_response_code(200);
            echo json_encode(["message" => "Boleto actualizado"]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit();
            }
            $stmt = $conn->prepare("DELETE FROM boleto WHERE id = ?");
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(["message" => "Boleto eliminado"]);
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
