import * as snarkjs from "snarkjs"
import { buildPoseidon } from "circomlibjs"

export async function generateProof(secret) {
    if(!secret) {
        throw new Error("Secret is required to generate proof")
    }

    const poseidon = await buildPoseidon()

    const secretBigInt = BigInt(secret)
    const hashString = poseidon.F.toString(
        poseidon([secretBigInt])
    )

    const input = {
        secret: secret,
        hash: hashString
    }

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        "/zk/IdentityLogin_js/IdentityLogin.wasm",
        "/zk/IdentityLogin-final.zkey"
    )

    return { proof, publicSignals }
}