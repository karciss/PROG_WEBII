<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

include_once 'conexion.php';

$conexion = new mysqli($host, $user, $password, $dbname);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(array("message" => "Error de conexión: " . $conexion->connect_error));
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT * FROM sala";
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            $sql = "SELECT * FROM sala WHERE id = '$id'";
        } else if(isset($_GET['search'])) {
            $search = $conexion->real_escape_string($_GET['search']);
            $sql = "SELECT * FROM sala WHERE nro_sala LIKE '%$search%'";
        }

        $result = $conexion->query($sql);
        if (!$result) {
            http_response_code(500);
            echo json_encode(array("message" => "Error en la consulta: " . $conexion->error));
            exit();
        }
        
        $salas = array();
        while($row = $result->fetch_assoc()) {
            $salas[] = $row;
        }
        echo json_encode($salas);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->nro_sala) || !isset($data->capacidad)) {
            http_response_code(400);
            echo json_encode(array("message" => "Faltan datos requeridos"));
            exit();
        }

        $id = $conexion->real_escape_string($data->id);
        $nro_sala = $conexion->real_escape_string($data->nro_sala);
        $capacidad = (int)$data->capacidad;

        $sql = "INSERT INTO sala (id, nro_sala, capacidad) 
                VALUES ('$id', '$nro_sala', $capacidad)";
        
        if($conexion->query($sql)) {
            http_response_code(201);
            echo json_encode(array("message" => "Sala creada con éxito", "id" => $id));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al crear la sala: " . $conexion->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id)) {
            $id = $conexion->real_escape_string($data->id);
            $nro_sala = $conexion->real_escape_string($data->nro_sala);
            $capacidad = (int)$data->capacidad;

            $sql = "UPDATE sala SET 
                    nro_sala = '$nro_sala',
                    capacidad = $capacidad
                    WHERE id = '$id'";

            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Sala actualizada con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al actualizar la sala: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de sala no proporcionado"));
        }
        break;

    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            
            // Primero verificamos si hay programaciones que usan esta sala
            $check_sql = "SELECT COUNT(*) as count FROM programacion WHERE id_sala = '$id'";
            $check_result = $conexion->query($check_sql);
            $check_data = $check_result->fetch_assoc();
            
            if ($check_data['count'] > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "No se puede eliminar la sala porque está siendo usada en programaciones"));
                exit();
            }
            
            $sql = "DELETE FROM sala WHERE id = '$id'";
            
            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Sala eliminada con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al eliminar la sala: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de sala no proporcionado"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
        break;
}

$conexion->close();
