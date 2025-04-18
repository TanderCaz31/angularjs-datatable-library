app.controller("DatatableController", function ($scope) {
    // Fetching Region and City information
    fetch("db/fetch_citynames.php").then(async (response) => {
        $data = await response.json();
        $scope.cities = $data["cities"];
        $scope.regions = $data["regions"];

        $scope.$apply();
    })

    let table;

    async function createTable() {
        await dbFetchNomTable();
        table = $("#datatable").DataTable({
            data: $scope.tabledata,
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
    }

    async function dbFetchNomTable() {
        await fetch("db/fetch_nom.php").then(async (response) => {
            $scope.tabledata = await response.json();
        })
    }

    createTable();

    // Delete button logic
    $("#datatable").on("click", ".btn-danger", function () {
        const clickedRow = table.row($(this).parents('tr'));

        if (clickedRow.data() && promptDelete(clickedRow.data().id)) {
            clickedRow.remove().draw(); // Removes locally instead of re-fetching data
        }
    });

    function promptDelete(id) {
        if (confirm(`Are you sure you want to delete record of id ${id}?`)) {
            dbDeleteUser(id);
            return true;
        }
        return false;
    }

    function dbDeleteUser(id) {
        fetch("db/delete_user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(id)
        });
    }

    // Editing logic
    $("#datatable").on("click", ".btn-secondary", function () {
        const clickedRow = table.row($(this).parents("tr"));

        $scope.editingUser = clickedRow.data();

        // Altering some properties to display correctly in the edit modal
        $scope.editingUser.data_nascita = new Date($scope.editingUser.data_nascita);
        Object.defineProperty($scope.editingUser, "age", { value: moment().diff(moment($scope.editingUser.data_nascita), "year") });

        $scope.$apply();
    });

    //TODO UNFINISHED FEATURE
    $("#datatable").on("dblclick", "td", function () {
        //let row = table.row((this));
        const cell = table.cell(this._DT_CellIndex.row, this._DT_CellIndex.column);
        const columnName = table.column(this._DT_CellIndex.column).title();
        const cellData = cell.data();

        switch (columnName) {
            case "email": case "Edit record": case "id":
                break;
            default:
                console.log(`Clicked column: ${columnName}`);
                console.log(`Cell data: ${cellData}`);
                break;
        }
    });


    $scope.submitEdit = () => {
        const inputUser = {
            id: $scope.editingUser.id,
            nome: $scope.editingUser.nome,
            cognome: $scope.editingUser.cognome,
            data_nascita: $scope.editingUser.data_nascita,
            id_citta: $scope.editingUser.id_citta ?? $scope.cities.find((city) => city.nome === $scope.editingUser.citta).id
        };

        fetch("db/edit_user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(inputUser)
        })
            .then(async (response) => {
                const text = await response.text();

                if (Number(text) === 1) { // PHP will return "1" if the request is successful, otherwise will give a custom error message
                    showAlert({ text: "User info was edited successfully!", type: "success" });

                    // Redraw table
                    await dbFetchNomTable();
                    table.clear();
                    table.rows.add($scope.tabledata).draw();
                } else {
                    showAlert({ text: text, type: "danger" });
                }

                $scope.$apply();
            })
    }

    // Edit attempt feedback
    const resultText = document.querySelector("#result-text");

    async function showAlert(message) {
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

        await delay(2000);
        // Reset classes to normal
        resultText.classList.remove(messageClass);
        resultText.innerText = "";
    }

    async function delay(timeout) {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
});