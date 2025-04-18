<?php
$db_server = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "progetto1";
$conn = "";

try {
    $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
} catch (mysqli_sql_exception) {
    die("Connessione al database non riuscita. " . mysqli_connect_error());
}
