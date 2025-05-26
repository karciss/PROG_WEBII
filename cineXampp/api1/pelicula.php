<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

// Manejar solicitudes OPTIONS pre-flight
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
        $sql = "SELECT * FROM pelicula";
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            $sql = "SELECT * FROM pelicula WHERE id = '$id'";
        } else if(isset($_GET['search'])) {
            $search = $conexion->real_escape_string($_GET['search']);
            $sql = "SELECT * FROM pelicula WHERE nombre LIKE '%$search%' OR genero LIKE '%$search%'";
        }

        $result = $conexion->query($sql);
        if (!$result) {
            http_response_code(500);
            echo json_encode(array("message" => "Error en la consulta: " . $conexion->error));
            exit();
        }
        
        $peliculas = array();
        while($row = $result->fetch_assoc()) {
            $peliculas[] = $row;
        }
        echo json_encode($peliculas);
        break;    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->nombre) || !isset($data->genero) || !isset($data->duracion)) {
            http_response_code(400);
            echo json_encode(array("message" => "Faltan datos requeridos"));
            exit();
        }

        $id = $conexion->real_escape_string($data->id);
        if (!$id) {
            http_response_code(400);
            echo json_encode(array("message" => "ID es requerido"));
            exit();
        }
        $nombre = $conexion->real_escape_string($data->nombre);
        $genero = $conexion->real_escape_string($data->genero);
        $duracion = (int)$data->duracion;

        $sql = "INSERT INTO pelicula (id, nombre, genero, duracion) 
                VALUES ('$id', '$nombre', '$genero', $duracion)";
        
        if($conexion->query($sql)) {
            http_response_code(201);
            echo json_encode(array("message" => "Película creada con éxito", "id" => $id));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al crear la película: " . $conexion->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id)) {
            $id = $conexion->real_escape_string($data->id);
            $nombre = $conexion->real_escape_string($data->nombre);
            $genero = $conexion->real_escape_string($data->genero);
            $duracion = (int)$data->duracion;

            $sql = "UPDATE pelicula SET 
                    nombre = '$nombre',
                    genero = '$genero',
                    duracion = $duracion
                    WHERE id = '$id'";

            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Película actualizada con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al actualizar la película: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de película no proporcionado"));
        }
        break;

    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            
            // Primero verificamos si hay programaciones que usan esta película
            $check_sql = "SELECT COUNT(*) as count FROM programacion WHERE id_pelicula = '$id'";
            $check_result = $conexion->query($check_sql);
            $check_data = $check_result->fetch_assoc();
            
            if ($check_data['count'] > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "No se puede eliminar la película porque está siendo usada en programaciones"));
                exit();
            }
            
            $sql = "DELETE FROM pelicula WHERE id = '$id'";
            
            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Película eliminada con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al eliminar la película: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de película no proporcionado"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
        break;
}

$conexion->close();
