app.controller("DatatableController", function ($scope) {
    // Fetch Region and City information
    fetch("db/fetch_citynames.php").then(async (response) => {
        $data = await response.json();
        $scope.cities = $data["cities"];
        $scope.regions = $data["regions"];

        $scope.$apply();
    })

    // Fetch table data and loads into DataTable
    $scope.updateTable = async () => {
        await fetch("db/fetch_nom.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            }
        })
            .then(async (response) => {
                $("#datatable").DataTable({
                    data: await response.json(),
                    order: [
                        [1, "asc"]
                    ],
                    columns: [
                        {
                            defaultContent: `<button class="btn btn-danger">Delete</button>
                            <button class="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">Edit</button>`,
                            orderable: false
                        },
                        { data: "id" },
                        { data: "nome" },
                        { data: "cognome" },
                        { data: "data_nascita" },
                        { data: "citta" },
                        { data: "regione" },
                        { data: "email" }
                    ]
                });
            })
        $scope.$apply();
    }

    $scope.updateTable();

    // Delete button logic
    $("#datatable").on("click", ".btn-danger", function () {
        const clickedRow = $("#datatable").DataTable().row($(this).parents('tr'));

        if (clickedRow.data() && $scope.promptDelete(clickedRow.data().id)) {
            clickedRow.remove().draw();
        }
    });

    // Deletion confirmation pop-up
    $scope.promptDelete = (id) => {
        if (confirm(`Are you sure you want to delete record of id ${id}?`)) {
            $scope.dbDelete(id);
            return true;
        }
        return false;
    }

    $scope.dbDelete = async (id) => {
        await fetch("db/delete_user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(id)
        });
    }

    // Edit button logic
    $("#datatable").on("click", ".btn-secondary", function () {
        const clickedRow = $("#datatable").DataTable().row($(this).parents('tr'));

        $scope.editingUser = clickedRow.data();
        Object.defineProperty($scope.editingUser, "age", { value: moment().diff(moment($scope.editingUser.data_nascita), "year") });
        $scope.$apply();
    });

    $scope.submitEdit = () => {
        //Dismiss if user is less than 18 years old
        if (moment().diff(moment($scope.editingUser.data_nascita), "year") < 18) {
            $scope.showAlert({ text: "User must be over 18 years old.", type: "danger" });
            return;
        }
        
        const inputUser = {
            nome: $scope.editingUser.nome,
            cognome: $scope.editingUser.cognome,
            data_nascita: $scope.editingUser.data_nascita,
            id_citta: Number($scope.editingUser.id_citta),
            email: $scope.editingUser.email
        }

        // POST request to edit user in database
        fetch("db/edit-user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(inputUser)
        })
            .then(async (response) => {
                const text = await response.text();

                if (Number(text) === 1) { // PHP will return "1" if the request is successful, otherwise will give a custom error message
                    $scope.showAlert({ text: "User info was edited successfully!", type: "success" });
                } else {
                    $scope.showAlert({ text: text, type: "danger" });
                }
                $scope.$apply();
            })
    }

    // Edit attempt feedback
    const resultText = document.getElementById("result-text");

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

    $scope.delay = async (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
});