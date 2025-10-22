import path from 'node:path'

const endpoint = (e: string) => path.join('localhost:3000/api', e)

fetch(endpoint('users/1/update'), {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
        name: "Yurio"
    })
})
.then(result => result.json())
.then(text => console.log(text))