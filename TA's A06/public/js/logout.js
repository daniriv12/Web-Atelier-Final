function logout() {

    doJSONRequest('GET', '/logout', '',  '', function(json) {
        if(json.session == 'destroyed') {
            window.location.href = '/';
        } else if(json.session == 'null') {
            window.location.href = '/';
        }
    });

}