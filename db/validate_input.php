<?php

function validateInput($user, $conn) {
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
    if (!str_contains($user->data_nascita, "-")) {
        return throwErr("Insert a valid date of birth.");
    }

    // City id validation
    if (
        !is_numeric($user->id_citta)
        || $user->id_citta < 0
    ) {
        return throwErr("Insert a valid city.");
    }

    // Email validation
    if (
        !str_contains($user->email, "@")
        || !str_contains($user->email, ".")
    ) {
        return throwErr("Insert a valid email.");
    }

    return $user;
}

function throwErr($message) {
    echo $message;
    return null;
}