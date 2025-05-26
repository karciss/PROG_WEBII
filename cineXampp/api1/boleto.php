<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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
        $sql = "SELECT b.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido,
                p.fecha as programacion_fecha, p.hora_inicio as programacion_hora,
                pel.nombre as pelicula_nombre, s.nro_sala as sala_numero
                FROM boleto b 
                JOIN cliente c ON b.id_cliente = c.id
                JOIN programacion p ON b.id_programacion = p.id
                JOIN pelicula pel ON p.id_pelicula = pel.id
                JOIN sala s ON p.id_sala = s.id";

        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            $sql .= " WHERE b.id = '$id'";
        }

        $result = $conexion->query($sql);
        if (!$result) {
            http_response_code(500);
            echo json_encode(array("message" => "Error en la consulta: " . $conexion->error));
            exit();
        }
        
        $boletos = array();
        while($row = $result->fetch_assoc()) {
            $boletos[] = $row;
        }
        echo json_encode($boletos);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->nro_asiento) || !isset($data->id_programacion) || !isset($data->id_cliente)) {
            http_response_code(400);
            echo json_encode(array("message" => "Faltan datos requeridos"));
            exit();
        }

        $id = $conexion->real_escape_string($data->id);
        $nro_asiento = (int)$data->nro_asiento;
        $id_programacion = $conexion->real_escape_string($data->id_programacion);
        $id_cliente = $conexion->real_escape_string($data->id_cliente);

        // Verificar si el asiento ya está ocupado para esa programación
        $check_sql = "SELECT COUNT(*) as count FROM boleto 
                     WHERE id_programacion = '$id_programacion' 
                     AND nro_asiento = $nro_asiento";
        
        $check_result = $conexion->query($check_sql);
        $check_data = $check_result->fetch_assoc();
        
        if ($check_data['count'] > 0) {
            http_response_code(400);
            echo json_encode(array("message" => "El asiento ya está ocupado para esta programación"));
            exit();
        }

        // Verificar capacidad de la sala
        $check_capacity_sql = "SELECT s.capacidad 
                             FROM programacion p 
                             JOIN sala s ON p.id_sala = s.id 
                             WHERE p.id = '$id_programacion'";
        
        $capacity_result = $conexion->query($check_capacity_sql);
        $capacity_data = $capacity_result->fetch_assoc();
        
        if ($nro_asiento > $capacity_data['capacidad']) {
            http_response_code(400);
            echo json_encode(array("message" => "El número de asiento excede la capacidad de la sala"));
            exit();
        }

        $sql = "INSERT INTO boleto (id, nro_asiento, id_programacion, id_cliente) 
                VALUES ('$id', $nro_asiento, '$id_programacion', '$id_cliente')";
        
        if($conexion->query($sql)) {
            http_response_code(201);
            echo json_encode(array("message" => "Boleto creado con éxito", "id" => $id));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Error al crear el boleto: " . $conexion->error));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        if(isset($data->id)) {
            $id = $conexion->real_escape_string($data->id);
            $nro_asiento = (int)$data->nro_asiento;
            $id_programacion = $conexion->real_escape_string($data->id_programacion);
            $id_cliente = $conexion->real_escape_string($data->id_cliente);

            // Verificar si el nuevo asiento está ocupado (excluyendo el boleto actual)
            $check_sql = "SELECT COUNT(*) as count FROM boleto 
                         WHERE id_programacion = '$id_programacion' 
                         AND nro_asiento = $nro_asiento
                         AND id != '$id'";
            
            $check_result = $conexion->query($check_sql);
            $check_data = $check_result->fetch_assoc();
            
            if ($check_data['count'] > 0) {
                http_response_code(400);
                echo json_encode(array("message" => "El asiento ya está ocupado para esta programación"));
                exit();
            }

            // Verificar capacidad de la sala
            $check_capacity_sql = "SELECT s.capacidad 
                                 FROM programacion p 
                                 JOIN sala s ON p.id_sala = s.id 
                                 WHERE p.id = '$id_programacion'";
            
            $capacity_result = $conexion->query($check_capacity_sql);
            $capacity_data = $capacity_result->fetch_assoc();
            
            if ($nro_asiento > $capacity_data['capacidad']) {
                http_response_code(400);
                echo json_encode(array("message" => "El número de asiento excede la capacidad de la sala"));
                exit();
            }

            $sql = "UPDATE boleto SET 
                    nro_asiento = $nro_asiento,
                    id_programacion = '$id_programacion',
                    id_cliente = '$id_cliente'
                    WHERE id = '$id'";

            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Boleto actualizado con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al actualizar el boleto: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de boleto no proporcionado"));
        }
        break;

    case 'DELETE':
        if(isset($_GET['id'])) {
            $id = $conexion->real_escape_string($_GET['id']);
            
            $sql = "DELETE FROM boleto WHERE id = '$id'";
            
            if($conexion->query($sql)) {
                echo json_encode(array("message" => "Boleto eliminado con éxito"));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Error al eliminar el boleto: " . $conexion->error));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "ID de boleto no proporcionado"));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido"));
        break;
}

$conexion->close();
?>
