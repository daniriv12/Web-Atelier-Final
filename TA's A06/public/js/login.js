function login() {
    var userName = document.getElementsByClassName('form-control form-stacked')[0].value;
    var password = document.getElementsByClassName('form-control form-stacked last')[0].value;

    if(!userName && !password) {
        alert('Please insert a Username and a Password')
    } else if(!userName) {
        alert('Please insert a Username')
    } else if(!password) {
        alert('Please insert a Password')
    } else {

        var json = {userName: userName, password: password};

        doJSONRequest('POST', '/', '', json, function (json) {

            if (json.user == 'invalid') {
                alert('No such a Username exists');
            } else if (json.password == 'invalid') {
                alert('Wrong password')
            } else if (json.userName) {
                console.log("Username: " + json.userName);
                location.reload(true);
            }

        });
    }
}
