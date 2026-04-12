const { buildPoseidon } = require("circomlibjs");
const { colUser } = require("../../db/firebase")
const { addDoc, getDocs, query, where } = require("firebase/firestore")

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
        } catch {
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
                
                res.status(200).json({ message: 'Login successful', data: userData })
            }
        } catch {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}