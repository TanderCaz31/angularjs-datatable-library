<?php

error_reporting(0); // To ignore errors in echo

function getEmails($conn)
{
    $stmt = $conn->prepare("SELECT email FROM nominativi");
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);

        foreach($outp as &$email) {
            $email = $email["email"];
        }
        return $outp;
    } else {
        return [];
    }
}
