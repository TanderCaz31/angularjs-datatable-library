<?php

error_reporting(0); // To ignore errors in echo

if (!isset($_POST)) {
    echo "Form response was received incorrectly.";
    return;
}

$user = file_get_contents("php://input");
$user = json_decode($user);

include("dbconn.php"); // DB connection
include("validate_input.php");

$user = validateInput($user, $conn);

$stmt = $conn->prepare("INSERT INTO nominativi (nome, cognome, data_nascita, id_citta, email) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $user->nome, $user->cognome, $user->data_nascita, $user->id_citta, $user->email);

$stmt->execute();

echo 1;
