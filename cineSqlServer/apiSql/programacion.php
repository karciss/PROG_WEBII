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
                $stmt = $conn->prepare("SELECT * FROM programacion WHERE id = ?");
                $stmt->execute([$id]);
                $programacion = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($programacion);
            } else {
                $stmt = $conn->query("SELECT * FROM programacion");
                $programaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($programaciones);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? uniqid();
            $fecha = $data['fecha'] ?? '';
            $hora_inicio = $data['hora_inicio'] ?? '';
            $hora_fin = $data['hora_fin'] ?? '';
            $id_pelicula = $data['id_pelicula'] ?? '';
            $id_sala = $data['id_sala'] ?? '';
            if (empty($fecha) || empty($hora_inicio) || empty($hora_fin) || empty($id_pelicula) || empty($id_sala)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO programacion (id, fecha, hora_inicio, hora_fin, id_pelicula, id_sala) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $fecha, $hora_inicio, $hora_fin, $id_pelicula, $id_sala]);
            http_response_code(201);
            echo json_encode(["message" => "Programación creada", "id" => $id]);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? '';
            $fecha = $data['fecha'] ?? '';
            $hora_inicio = $data['hora_inicio'] ?? '';
            $hora_fin = $data['hora_fin'] ?? '';
            $id_pelicula = $data['id_pelicula'] ?? '';
            $id_sala = $data['id_sala'] ?? '';
            if (empty($id) || empty($fecha) || empty($hora_inicio) || empty($hora_fin) || empty($id_pelicula) || empty($id_sala)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("UPDATE programacion SET fecha = ?, hora_inicio = ?, hora_fin = ?, id_pelicula = ?, id_sala = ? WHERE id = ?");
            $stmt->execute([$fecha, $hora_inicio, $hora_fin, $id_pelicula, $id_sala, $id]);
            http_response_code(200);
            echo json_encode(["message" => "Programación actualizada"]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit();
            }
            $stmt = $conn->prepare("DELETE FROM programacion WHERE id = ?");
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(["message" => "Programación eliminada"]);
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
