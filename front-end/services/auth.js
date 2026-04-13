import callApi from "@/config/api"

const ROOT_API = "http://localhost:8000"

export async function setLogin(data) {
    const url = `${ROOT_API}/auth/login`
    return callApi({
        url,
        method: "POST",
        data,
    })
}

export async function setRegister(data) {
    const url = `${ROOT_API}/auth/register`
    return callApi({
        url,
        method: "POST",
        data,
    })
}