const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    const data = new FormData(loginForm);
    const obj = {}
    data.forEach((value, key)=>obj[key]=value);
    fetch('/api/sessions/login',{
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        if(res.status == 200){
            localStorage.setItem('access_token', res.access_token)
            window.location.replace('/')
        }
    })
})