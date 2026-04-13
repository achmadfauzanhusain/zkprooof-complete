import { useState } from "react";
import { generateProof } from "../lib/zk/generateProof"
import { setLogin } from "@/services/auth";

import Cookies from "js-cookie";
import Link from "next/link";

export default function Home() {
  const [secret, setSecret] = useState("")
  const [loading, setLoading] = useState(false)

  const [proof, setProof] = useState(null)
  const [publicSignals, setPublicSignals] = useState(null)

  const [username, setUsername] = useState("")

  const handleGenerateProof = async() => {
    try {
      setLoading(true)
      const { proof, publicSignals } = await generateProof(secret)

      setProof(proof)
      setPublicSignals(publicSignals)
    } catch (error) {
      console.error("Error generating proof:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async() => {
    setLoading(true)
    const data = { username, proof, publicSignals }

    const response = await setLogin(data)
    if(response.success === false) {
      alert("Login failed: " + response.message)
    } else {
      const token = response.data.data.token
      const tokenBase64 = btoa(token);
      Cookies.set("token", tokenBase64, { expires: 7 });
      console.log(response.data.data.token)
    }
    setLoading(false)
  }
  return (
    <div className="mt-24 px-32">
      <Link href="/register" className="text-sm text-blue-500 hover:underline">
        belum punya akun?
      </Link>

      <div className="mt-8">
        <h1 className="text-3xl font-semibold">Generate Proof</h1>
        <p className="text-sm opacity-75">Generate proof before login!</p>

        <input 
          className="mt-4 w-full bg-gray-100 p-3 outline-none" 
          placeholder="enter your secret..." 
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button className="bg-blue-400 text-white w-full py-3 mt-2 cursor-pointer hover:bg-blue-500 transition-all duration-300" onClick={handleGenerateProof}>
          {loading ? "generating..." : "generate proof!"}
        </button>
      </div>
      {proof && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Proof :</h2>
          <pre className="bg-gray-100 p-4 overflow-auto">{JSON.stringify(proof, null, 2)}</pre>
        </div>
      )}
      {publicSignals && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Public Signals :</h2>
          <pre className="bg-gray-100 p-4 overflow-auto">{JSON.stringify(publicSignals, null, 2)}</pre>
        </div>
      )}

      <div className="mt-24">
        <h1 className="text-3xl font-semibold">Login</h1>
        <p className="text-sm opacity-75">result of genrate proof is automatically use!</p>

        <input 
          className="mt-4 w-full bg-gray-100 p-3 outline-none" 
          placeholder="enter your username..." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-400 text-white w-full py-3 mt-2 cursor-pointer hover:bg-blue-500 transition-all duration-300" onClick={handleLogin}>
          {loading ? "loading..." : "login"}
        </button>
      </div>
    </div>
  );
}
