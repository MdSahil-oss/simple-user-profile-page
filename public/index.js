const handleChange = () => {
    document.getElementById("btn").style.display = "block"
}

const getData = () => {
    console.log("Fetching data from backend");
    fetch('http://localhost:3000/api/getData').then((res) => {
        return res.json();
    }).then((resJson) => {
        document.getElementById("name").value = resJson["name"];
        document.getElementById("username").value = resJson["username"];
        document.getElementById("email").value = resJson["email"];
    }).catch(err => {
        console.error(err);
    })
}

const updateData = () => {
    let data =  {
        name: document.getElementById("name").value,
        username: document.getElementById("username").value,
        email: document.getElementById("email").value
    }
    fetch('http://localhost:3000/api/updateData', {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    }).then((res) => {
        return res.json()
    }).then((resJson) => {
        document.getElementById("btn").style.display = "none";
    }).catch(err => {
        console.error(err);
    })
}

getData();