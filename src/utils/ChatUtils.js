export const GroupBackgroundColor = {
    A: '#00897B',
    B: '#FD3546',
    C: '#135DDF',
    D: '#98C463',
    E: '#FD3546',
    F: '#48A8CA',
    G: '#CC221B',
    H: '#7E57C2',
    I: '#F4511E',
    J: '#98C463',
    K: '#00897B',
    L: '#FD3546',
    M: '#48A8CA',
    N: '#135DDF',
    O: '#00897B',
    P: '#FF225B',
    Q: '#F4511E',
    R: '#CC221B',
    S: '#16BB8F',
    T: '#7E57C2',
    U: '#98C463',
    V: '#135DDF',
    W: '#48A8CA',
    X: '#FF66BB',
    Y: '#16BB8F',
    Z: '#98C463',
    '?': '#FF66BB'
};

export const getAvatarBgColor = (charactor) => {
    if (charactor === '?') {
        return '#FF66BB';
    }

    return GroupBackgroundColor[charactor];
}
