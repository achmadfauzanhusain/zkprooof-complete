const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs")
const fs = require("fs")
const path = require("path")

const { colUser } = require("../../db/firebase")
const { addDoc, getDocs, query, where } = require("firebase/firestore")

const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, "../../zk/verification-key.json")))

module.exports = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            const { confirmPassword } = req.body;

            const q = query(colUser, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                return res.status(400).json({ message: `${username} already registered, use different username!` });
            } else {
                if (password !== confirmPassword) {
                    return res.status(400).json({ message: 'Passwords do not match' });
                } else {
                    const poseidon = await buildPoseidon()
                    const secret = BigInt(password)
                    const hashValue = poseidon([secret])
                    const hash = poseidon.F.toString(hashValue)

                    await addDoc(colUser, { username, hash });

                    res.status(200).json({ message: 'User registered successfully', data: { username, hash } });
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    login: async (req, res) => {
        try {
            const { username, proof, publicSignals } = req.body

            const checkUsername = query(colUser, where("username", "==", username))
            const querySnapshot = await getDocs(checkUsername)

            if (querySnapshot.empty) {
                return res.status(403).json({ message: `${username} isnt exist` })
            } else {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                if(publicSignals[0] !== userData.hash) {
                    return res.status(403).json({ message: 'Invalid identity' })
                }

                try {
                    const verified = await snarkjs.groth16.verify(
                        vKey,
                        publicSignals,
                        proof
                    )

                    if (!verified) {
                        return res.status(401).json({ message: "invalid proof" })
                    }

                    return res.json({
                        success: true,
                        message: "login success"
                    })
                } catch (error) {
                    res.status(403).json({ message: 'Invalid proof' })
                }
                
                res.status(200).json({ message: 'Login successful', data: userData })
            }
        } catch {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}