// src/dto/UserDTO.js

class UserDTO {
    constructor({ _id, email, role, edad, nombre, apellido, cart }) {
        this.id = _id;
        this.email = email;
        this.role = role;
        this.edad = edad;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cart = cart;
    }
}

export default UserDTO;
