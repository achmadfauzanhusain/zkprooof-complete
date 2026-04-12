pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Identity() {
    signal input secret;
    signal input hash;

    component hashCheck = Poseidon(1);
    hashCheck.inputs[0] <== secret;
    hash === hashCheck.out;
}

component main {public [hash]} = Identity();