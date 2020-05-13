export default function isAuth() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return false;
        if (!user.usuario || !user.senha) return false;
        return true;
    } catch (err) {
        return false;
    }
}
