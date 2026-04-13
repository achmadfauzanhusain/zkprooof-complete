const { buildPoseidon } = require("circomlibjs");
const snarkjs = require("snarkjs")
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const { jwtKey } = require("../../config")

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

            if(!password || !confirmPassword) {
                return res.status(400).json({ message: 'Password is required' });
            }

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

            if(!proof || !publicSignals) {
                return res.status(400).json({ message: 'you must generate a proof first' })
            }

            if(!username) {
                return res.status(400).json({ message: 'username is required' })
            }

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
                        const token = jwt.sign({
                            user: {
                                username: userData.username,
                                hash: userData.hash
                            }
                        }, jwtKey)

                        res.status(201).json({
                            success: true,
                            message: "login success",
                            data: {
                                token: token,
                                username: userData.username,
                                hash: userData.hash
                            }
                        })
                    
                } catch (error) {
                    res.status(403).json({ message: error.message })
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}