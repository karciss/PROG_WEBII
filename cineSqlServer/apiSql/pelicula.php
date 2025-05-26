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
                $stmt = $conn->prepare("SELECT * FROM pelicula WHERE id = ?");
                $stmt->execute([$id]);
                $pelicula = $stmt->fetch(PDO::FETCH_ASSOC);
                echo json_encode($pelicula);
            } else {
                $stmt = $conn->query("SELECT * FROM pelicula");
                $peliculas = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($peliculas);
            }
            break;
        case 'POST':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? uniqid();
            $nombre = $data['nombre'] ?? '';
            $genero = $data['genero'] ?? '';
            $duracion = $data['duracion'] ?? 0;
            if (empty($nombre) || empty($genero) || empty($duracion)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("INSERT INTO pelicula (id, nombre, genero, duracion) VALUES (?, ?, ?, ?)");
            $stmt->execute([$id, $nombre, $genero, $duracion]);
            http_response_code(201);
            echo json_encode(["message" => "Película creada", "id" => $id]);
            break;
        case 'PUT':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? '';
            $nombre = $data['nombre'] ?? '';
            $genero = $data['genero'] ?? '';
            $duracion = $data['duracion'] ?? 0;
            if (empty($id) || empty($nombre) || empty($genero) || empty($duracion)) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan datos requeridos"]);
                exit();
            }
            $stmt = $conn->prepare("UPDATE pelicula SET nombre = ?, genero = ?, duracion = ? WHERE id = ?");
            $stmt->execute([$nombre, $genero, $duracion, $id]);
            http_response_code(200);
            echo json_encode(["message" => "Película actualizada"]);
            break;
        case 'DELETE':
            $id = $_GET['id'] ?? '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "ID requerido"]);
                exit();
            }
            $stmt = $conn->prepare("DELETE FROM pelicula WHERE id = ?");
            $stmt->execute([$id]);
            http_response_code(200);
            echo json_encode(["message" => "Película eliminada"]);
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
