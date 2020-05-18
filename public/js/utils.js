function fetchTemplate (templateName) {
    return fetch(`./views/${templateName}.html`)
        .then(res => res.text());
}