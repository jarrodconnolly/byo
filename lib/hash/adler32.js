
function adler32(data) {
    const MOD_ADLER = 65521;
    let a = 1;
    let b = 0;
    for (let i = 0; i < data.length; i++) {
        a = (a + data.charCodeAt(i)) % MOD_ADLER;
        b = (b + a) % MOD_ADLER;
    }
    return (b << 16) | a;
}

export default adler32;