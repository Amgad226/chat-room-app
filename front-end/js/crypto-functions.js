var key = CryptoJS.enc.Utf8.parse('12345678901234567890123456789012'); // 32 bytes (256 bits)
var iv = CryptoJS.enc.Utf8.parse('abcdefghijklmnop'); // 16 bytes (128 bits)

function encryptMessage(plaintext) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7
    });
}
function decryptMessage(ciphertext) {
    return CryptoJS.AES.decrypt(ciphertext, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
}

function withoutTag(string) {
    return string.replace(/[<>]/g, ' _ ')
}