<?php
//error_reporting(0); // To ignore errors in echo

include("dbconn.php"); // DB connection

$query = "SELECT n.id AS id, n.nome AS nome, n.cognome AS cognome, n.data_nascita AS data_nascita, c.nome AS citta, r.nome AS regione, n.email AS email FROM nominativi n
INNER JOIN citta c ON n.id_citta = c.id
INNER JOIN regioni r ON c.id_regione = r.id";

$sql = $conn->prepare($query);
$sql->execute();
$result = $sql->get_result();

if ($result) {
    $result = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($result);
} else {
    echo json_encode([]);
}