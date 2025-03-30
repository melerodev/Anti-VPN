import { queryDatabase } from './database/dbService.js';

async function getUsers() {
    try {
        let users = await queryDatabase('SELECT * FROM users');
        return users;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
    }
}

async function getBannedUsers() {
    try {
        let users = await queryDatabase('SELECT * FROM bans');
        return users;
    }
    catch (error) {
        console.error('Error al obtener los usuarios baneados:', error);
    }
    const bannedUsers = await queryDatabase('SELECT * FROM bans');
    console.log(bannedUsers);
}

async function getUserByID(user_id) {
    try {
        if (typeof user_id !== 'number') {
            throw new Error('El user_id debe ser un número');
        }
        return await queryDatabase('SELECT * FROM users WHERE user_id = ?', [user_id]);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
    }
}

async function getBannedUserByID(user_id) {
    try {
        if (typeof user_id !== 'number') {
            throw new Error('El user_id debe ser un número');
        }
        return await queryDatabase('SELECT * FROM bans WHERE user_id = ?', [user_id]);
    } catch (error) {
        console.error('Error al obtener el usuario baneado:', error);
    }
}

async function insertUser(user_id, ip, data_join) {
    try {
        if (typeof user_id !== 'number') {
            throw new Error('El user_id debe ser un número');
        }
        if (typeof ip !== 'string') {
            throw new Error('El ip debe ser una cadena de texto');
        }
        if (typeof data_join !== 'string') {
            throw new Error('El data_join debe ser una cadena de texto');
        }
        await queryDatabase('INSERT INTO users (user_id, ip, data_join) VALUES (?, ?, ?)', [user_id, ip, data_join]);
        console.log(`Usuario con ID ${user_id} insertado exitosamente.`);
    } catch (error) {
        console.error('Error al insertar el usuario:', error);
    }
}

async function insertBannedUser(user_id, date) {
    try {
        if (typeof user_id !== 'number') {
            throw new Error('El user_id debe ser un número');
        }
        if (typeof date !== 'string') {
            throw new Error('La fecha debe ser una cadena de texto');
        }
        await queryDatabase('INSERT INTO bans (user_id, date_ban) VALUES (?, ?)', [user_id, date]);
        console.log(`Usuario con ID ${user_id} baneado exitosamente.`);
    } catch (error) {
        console.error('Error al insertar el usuario baneado:', error);
    }
}

async function deleteUser(user_id) {
    try {
        if (typeof user_id !== 'number') {
            throw new Error('El user_id debe ser un número');
        }
        await queryDatabase('DELETE FROM users WHERE user_id = ?', [user_id]);
        console.log(`Usuario con ID ${user_id} eliminado exitosamente.`);
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}

async function deleteBannedUser(user_id) {
    try {
        if (typeof user_id !== 'number') {
            throw new Error('El user_id debe ser un número');
        }
        await queryDatabase('DELETE FROM bans WHERE user_id = ?', [user_id]);
        console.log(`Usuario con ID ${user_id} eliminado de la lista de usuarios baneados exitosamente.`);
    } catch (error) {
        console.error('Error al eliminar el usuario baneado:', error);
    }
}

export { getUsers, getBannedUsers, getUserByID, getBannedUserByID, insertUser, insertBannedUser, deleteUser, deleteBannedUser };