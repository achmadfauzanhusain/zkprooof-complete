import { useState } from "react"

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async() => {

    }

    return (
        <div className="mt-24 px-32">
            <div className="mt-24">
                <h1 className="text-3xl font-semibold">Register</h1>
                <p className="text-sm opacity-75">you can create ur account!</p>

                <input 
                className="mt-8 w-full bg-gray-100 p-3 outline-none" 
                placeholder="enter your username..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                className="mt-4 w-full bg-gray-100 p-3 outline-none" 
                placeholder="enter your secret..." 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <input 
                className="mt-4 w-full bg-gray-100 p-3 outline-none" 
                placeholder="confirm your secret..." 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="bg-blue-400 text-white w-full py-3 mt-4 cursor-pointer hover:bg-blue-500 transition-all duration-300" onClick={handleRegister}>
                {loading ? "loading..." : "register"}
                </button>
            </div>
        </div>
    )
}

export default Register