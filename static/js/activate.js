function postActivate() {
    let data = new FormData();
    data.append('public', );
    data.append('quest', '');
    data.append('guide', '');
    data.append('box_key', sessionStorage.getItem('box_key')):

    let box_id = params.get('id');

    fetch(`/api/box${box_id}/entry`, {
        method: 'POST',
        body: data
    })
    .then(resp => resp.status == 200 ? resp.json : null)
    .then(data => {
        console.log(data);
        location.href = `/box?id=${box_id}`
    })
}