<?php

include("dbconn.php");

$results = [
    "cities" => getAll("SELECT id, id_regione, nome, sigla FROM citta", $conn),
    "regions" => getAll("SELECT * FROM regioni", $conn)
];

$json =  json_encode($results);
echo $json ? $json : json_last_error_msg();

function getAll($query, $conn)
{
    $sql = $conn->prepare($query);

    $sql->execute();
    $result = $sql->get_result();

    if ($result) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        return $outp;
    } else {
        return [];
    }
}
