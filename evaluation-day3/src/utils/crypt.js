import bcrypt from 'bcrypt';

export const hash = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export const compare = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}