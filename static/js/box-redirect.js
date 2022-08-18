const params = new URLSearchParams(location.search);

if (params.has("k")) {
    let box_key = params.get("k");
    sessionStorage.setItem("box_key", box_key);
    fetch(`/api/get_id?key=${box_key}`)
        .then(resp => resp.json())
        .then(data => {
            location.replace(`${location.pathname}?id=${data.id}`, '');
        })
}
if (params.has("id")) {
    let box_id = params.get("id");
    fetch(`/api/box/${box_id}`)
        .then(resp => resp.status == 200 ? resp.json : null)
        .then(box => {
            if (!box.active) {
                location.href = '/box/activate' + location.search;
            }
        });
}