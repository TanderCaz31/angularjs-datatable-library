app.controller("RegisterController", function ($scope) {
    const resultText = document.getElementById("result-text");

    // Fetching Region and City information
    fetch("db/fetch_citynames.php").then(async (response) => {
        $data = await response.json();
        $scope.cities = $data["cities"];
        $scope.regions = $data["regions"];

        $scope.$apply();
    })

    $scope.submitHandler = () => {
        // Dismiss if user is less than 18 years old
        if (moment().diff(moment($scope.data_nascita), "year") < 18) {
            $scope.showAlert({ text: "User must be over 18 years old.", type: "danger" });
            return;
        }

        const inputUser = {
            nome: $scope.nome,
            cognome: $scope.cognome,
            data_nascita: $scope.data_nascita,
            id_citta: $scope.id_citta,
            email: $scope.email
        }

        // POST request to add user to the database
        fetch("db/add-user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(inputUser)
        })
            .then(async (response) => {
                const text = await response.text();

                if (Number(text) === 1) { // PHP will return "1" if the request is successful, otherwise will give a custom error message
                    $scope.showAlert({ text: "User was added successfully!", type: "success" });
                    document.querySelector("#register-form").reset();
                } else {
                    $scope.showAlert({ text: text, type: "danger" });
                }
                $scope.$apply();
            })
    }

    $scope.delay = async (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    // Feedback message display
    $scope.showAlert = async (message) => {
        const messageClass = (() => {
            switch (message.type) {
                case "success":
                    return "text-success";
                case "danger":
                    return "text-danger";
                default:
                    return "";
            }
        })();

        resultText.classList.add(messageClass);
        resultText.innerText = message.text;

        await $scope.delay(2000);
        // Reset classes to normal
        resultText.classList.remove(messageClass);
        resultText.innerText = "";
    }
});