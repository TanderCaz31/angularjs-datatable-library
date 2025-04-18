<?php

include("check_duplicate_mail.php");

function validateInput($user, $conn)
{
    // Name validation
    if (strlen($user->nome) > 30) {
        return throwErr("Name must be shorter than 30 characters.");
    } else if (strlen($user->nome) < 3) {
        return throwErr("Name must be at least 3 characters long.");
    }

    // Surname validation
    if (strlen($user->cognome) > 30) {
        return throwErr("Surname must be shorter than 30 characters.");
    } else if (strlen($user->cognome) < 3) {
        return throwErr("Surname must be at least 3 characters long.");
    }

    // Date of birth validation
    $now = new DateTime("now");
    $over18 = $now->modify("-18 years");

    $userBirthdate = new DateTime($user->data_nascita);

    if (!str_contains($user->data_nascita, "-")) {
        return throwErr("Insert a valid date of birth.");
    } elseif ($userBirthdate > $over18) {
        return throwErr("Insert an age over 18.");
    }

    // City id validation
    if (
        !is_numeric($user->id_citta)
        || $user->id_citta < 0
    ) {
        return throwErr("Insert a valid city.");
    }

    // Email validation
    if (!(is_null($user->id)) && is_null($user->email)) return $user; // Escaping for the Edit feature

    if (
        !str_contains($user->email, "@")
        || !str_contains($user->email, ".")
    ) {
        return throwErr("Insert a valid email.");
    } elseif (checkDuplicateMail($conn, $user->email)) {
        return throwErr("That email is already taken, please choose another one.");
    }

    return $user;
}

function throwErr($message)
{
    echo $message;
    return null;
}
