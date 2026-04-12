const { buildPoseidon } = require("circomlibjs");

let users = {
    "ocang": {
        hash: "13652621327073936666000543602573161427486257595978168586948791791815955152507"
    }
}

module.exports = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            const { confirmPassword } = req.body;

            if (password !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            } else {
                const poseidon = await buildPoseidon()
                const secret = BigInt(password)
                const hashValue = poseidon([secret])
                const hash = poseidon.F.toString(hashValue)

                res.status(200).json({ message: 'User registered successfully', data: { username, hash } });
            }
        } catch {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    login: async (req, res) => {
        try {
            const { username, proof, publicSignals } = req.body;

            const user = users[username];
            if (!user) {
                return res.status(404).json({ error: "user not found" });
            }

            
        } catch {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}