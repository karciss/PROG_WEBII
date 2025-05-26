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
        $sql = "SELECT p.*, pel.nombre as pelicula_nombre, s.nro_sala as sala_numero 
                FROM programacion p 
                JOIN pelicula pel ON p.id_pelicula = pel.id 
                JOIN sala s ON p.id_sala = s.id";
                
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            $sql .= " WHERE p.id = '$id'";
        }

        $result = $conexion->query($sql);
        if (!$result) {
            http_response_code(500);
            echo json_encode(array("message" => "Error en la consulta: " . $conexion->error));
            exit();
        }
        
        $programaciones = array();
        while($row = $result->fetch_assoc()) {
            $programaciones[] = $row;
        }
        echo json_encode($programaciones);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->fecha) || !isset($data->hora_inicio) || !isset($data->hora_fin) || 
            !isset($data->id_pelicula) || !isset($data->id_sala)) {
            http_response_code(400);
            echo json_encode(array("message" => "Faltan datos requeridos"));
            exit();
        }

        $id = $conexion->real_escape_string($data->id);
        $fecha = $conexion->real_escape_string($data->fecha);
        $hora_inicio = $conexion->real_escape_string($data->hora_inicio);
        $hora_fin = $conexion->real_escape_string($data->hora_fin);
        $id_pelicula = $conexion->real_escape_string($data->id_pelicula);
        $id_sala = $conexion->real_escape_string($data->id_sala);

        // Verificar si hay conflicto de horarios en la misma sala
        $check_sql = "SELECT COUNT(*) as count FROM programacion 
                     WHERE id_sala = '$id_sala' 
                     AND fecha = '$fecha' 
                     AND ((hora_inicio BETWEEN '$hora_inicio' AND '$hora_fin') 
                     OR (hora_fin BETWEEN '$hora_inicio' AND '$hora_fin'))";
        
        $check_result = $conexion->query($check_sql);
        $check_data = $check_result->fetch_assoc();
        
        if ($check_data['count'] > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Existe un conflicto de horarios en la sala seleccionada"));
            exit();
        }

        $sql = "INSERT INTO programacion (id, fecha, hora_inicio, hora_fin, id_pelicula, id_sala) 
                VALUES ('$id', '$fecha', '$hora_inicio', '$hora_fin', '$id_pelicula', '$id_sala')";
        
        if($conexion->query($sql)) {
            http_response_code(201);
            echo json_encode(array("message" => "Programación creada con éxito", "id" => $id));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al crear la programación: " . $conexion->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id)) {
            $id = $conexion->real_escape_string($data->id);
            $fecha = $conexion->real_escape_string($data->fecha);
            $hora_inicio = $conexion->real_escape_string($data->hora_inicio);
            $hora_fin = $conexion->real_escape_string($data->hora_fin);
            $id_pelicula = $conexion->real_escape_string($data->id_pelicula);
            $id_sala = $conexion->real_escape_string($data->id_sala);

            // Verificar conflictos excluyendo la programación actual
            $check_sql = "SELECT COUNT(*) as count FROM programacion 
                         WHERE id_sala = '$id_sala' 
                         AND fecha = '$fecha' 
                         AND id != '$id'
                         AND ((hora_inicio BETWEEN '$hora_inicio' AND '$hora_fin') 
                         OR (hora_fin BETWEEN '$hora_inicio' AND '$hora_fin'))";
            
            $check_result = $conexion->query($check_sql);
            $check_data = $check_result->fetch_assoc();
            
            if ($check_data['count'] > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "Existe un conflicto de horarios en la sala seleccionada"));
                exit();
            }

            $sql = "UPDATE programacion SET 
                    fecha = '$fecha',
                    hora_inicio = '$hora_inicio',
                    hora_fin = '$hora_fin',
                    id_pelicula = '$id_pelicula',
                    id_sala = '$id_sala'
                    WHERE id = '$id'";

            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Programación actualizada con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al actualizar la programación: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de programación no proporcionado"));
        }
        break;

    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            
            // Verificar si hay boletos asociados
            $check_sql = "SELECT COUNT(*) as count FROM boleto WHERE id_programacion = '$id'";
            $check_result = $conexion->query($check_sql);
            $check_data = $check_result->fetch_assoc();
            
            if ($check_data['count'] > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "No se puede eliminar la programación porque tiene boletos asociados"));
                exit();
            }
            
            $sql = "DELETE FROM programacion WHERE id = '$id'";
            
            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Programación eliminada con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al eliminar la programación: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de programación no proporcionado"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
        break;
}

$conexion->close();
