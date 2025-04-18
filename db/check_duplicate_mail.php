<?php

error_reporting(0); // To ignore errors in echo

function checkDuplicateMail($conn, $email)
{
    $stmt = $conn->prepare("SELECT COUNT(*) AS emails FROM nominativi WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);

        return $outp[0]["emails"];
    } else {
        return [];
    }
}
