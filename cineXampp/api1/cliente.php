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
        $sql = "SELECT * FROM cliente";
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            $sql = "SELECT * FROM cliente WHERE id = '$id'";
        } else if(isset($_GET['search'])) {
            $search = $conexion->real_escape_string($_GET['search']);
            $sql = "SELECT * FROM cliente WHERE nombre LIKE '%$search%' OR apellido LIKE '%$search%'";
        }

        $result = $conexion->query($sql);
        if (!$result) {
            http_response_code(500);
            echo json_encode(array("message" => "Error en la consulta: " . $conexion->error));
            exit();
        }
        
        $clientes = array();
        while($row = $result->fetch_assoc()) {
            $clientes[] = $row;
        }
        echo json_encode($clientes);
        break;    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->nombre) || !isset($data->apellido) || !isset($data->edad) || !isset($data->telefono)) {
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
        $apellido = $conexion->real_escape_string($data->apellido);
        $edad = (int)$data->edad;
        $telefono = $conexion->real_escape_string($data->telefono);

        $sql = "INSERT INTO cliente (id, nombre, apellido, edad, telefono) 
                VALUES ('$id', '$nombre', '$apellido', $edad, '$telefono')";
        
        if($conexion->query($sql)) {
            http_response_code(201);
            echo json_encode(array("message" => "Cliente creado con éxito", "id" => $id));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al crear el cliente: " . $conexion->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id)) {
            $id = $conexion->real_escape_string($data->id);
            $nombre = $conexion->real_escape_string($data->nombre);
            $apellido = $conexion->real_escape_string($data->apellido);
            $edad = (int)$data->edad;
            $telefono = $conexion->real_escape_string($data->telefono);

            $sql = "UPDATE cliente SET 
                    nombre = '$nombre',
                    apellido = '$apellido',
                    edad = $edad,
                    telefono = '$telefono'
                    WHERE id = '$id'";

            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Cliente actualizado con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al actualizar el cliente: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de cliente no proporcionado"));
        }
        break;

    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            
            // Primero verificamos si hay boletos que usan este cliente
            $check_sql = "SELECT COUNT(*) as count FROM boleto WHERE id_cliente = '$id'";
            $check_result = $conexion->query($check_sql);
            $check_data = $check_result->fetch_assoc();
            
            if ($check_data['count'] > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "No se puede eliminar el cliente porque tiene boletos asociados"));
                exit();
            }
            
            $sql = "DELETE FROM cliente WHERE id = '$id'";
            
            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Cliente eliminado con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al eliminar el cliente: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de cliente no proporcionado"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
        break;
}

$conexion->close();
