import { User } from './user.js';

class SignIn {
    constructor() {
    // Inicialización de elementos del DOM
    this.form = document.getElementById('loginForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.passwordToggle = document.getElementById('passwordToggle');
    this.submitButton = this.form?.querySelector('.login-btn');
    this.cancelButton = document.getElementById('cancelBtn');
    this.signUpLink = document.getElementById('signUpLink');

    this.emailError = document.getElementById('emailError');
    this.passwordError = document.getElementById('passwordError');

    // Registro de Event Listeners
    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));

    this.emailInput?.addEventListener('click', (e) => this.setActiveBackground(e));
    this.emailInput?.addEventListener('focus', (e) => this.setActiveBackground(e));
    this.emailInput?.addEventListener('blur', () => this.validateEmail());
    this.emailInput?.addEventListener('input', () => this.clearError('email'));

    this.passwordInput?.addEventListener('click', (e) => this.setActiveBackground(e));
    this.passwordInput?.addEventListener('focus', (e) => this.setActiveBackground(e));
    this.passwordInput?.addEventListener('blur', () => this.validatePassword());
    this.passwordInput?.addEventListener('input', () => this.clearError('password'));

    this.passwordToggle?.addEventListener('click', (e) => this.togglePassword(e));
    this.cancelButton?.addEventListener('click', (e) => this.handleCancel(e));
    this.signUpLink?.addEventListener('click', (e) => this.handleSignUp(e));
}

    // Patrón visual: cambia el fondo a blanco (#ffffff) al activar
    setActiveBackground(e) {
        e.target.style.backgroundColor = '#ffffff';
        this.clearError(e.target.id === 'email' ? 'email' : 'password');
    }

    showError(field, error) {
        const message = error instanceof Error ? error.message : error;

        if (field === 'email') {
            if (this.emailInput) this.emailInput.style.borderColor = '#ff0000';
            if (this.emailError) {
                this.emailError.style.color = '#ff0000';
                this.emailError.style.fontSize = '0.85rem';
                this.emailError.style.marginTop = '5px';
                this.emailError.innerHTML = message;
                this.emailError.style.display = 'block';
            }
        } else if (field === 'password') {
            if (this.passwordInput) this.passwordInput.style.borderColor = '#ff0000';
            if (this.passwordError) {
                this.passwordError.style.color = '#ff0000';
                this.passwordError.style.fontSize = '0.85rem';
                this.passwordError.style.marginTop = '5px';
                this.passwordError.innerHTML = message;
                this.passwordError.style.display = 'block';
            }
        }
    }

    clearError(field) {
        if (field === 'email') {
            if (this.emailError) this.emailError.style.display = 'none';
            if (this.emailInput) this.emailInput.style.borderColor = '';
        } else if (field === 'password') {
            if (this.passwordError) this.passwordError.style.display = 'none';
            if (this.passwordInput) this.passwordInput.style.borderColor = '';
        }
    }

    // Control del icono del ojo para ver / ocultar la contraseña
    togglePassword(e) {
        if (this.passwordInput) {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            const icon = e.currentTarget;
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        }
    }

    // Validación de email
    validateEmail() {
        try {
            const email = this.emailInput ? this.emailInput.value.trim() : '';
            const emailRegex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
            const hasSpaces = /\s/.test(this.emailInput ? this.emailInput.value : '');

            if (!email || hasSpaces || !emailRegex.test(email)) {
                throw new Error('(*) Enter a valid email address (e.g. name@domain.com)<br>(*) Do not enter spaces or invalid characters.');
            }

            this.clearError('email');
            return true;
        } catch (error) {
            this.showError('email', error);
            return false;
        }
    }

    // Validación de contraseña
    validatePassword() {
        try {
            const password = this.passwordInput ? this.passwordInput.value : '';

            if (!password || password.trim() === '') {
                throw new Error('(*) Password cannot be empty.');
            }

            this.clearError('password');
            return true;
        } catch (error) {
            this.showError('password', error);
            return false;
        }
    }

    // Método handleSubmit actualizado con el mensaje de error personalizado
async handleSubmit(e) {
    e.preventDefault();

    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return; // Detiene el flujo si hay errores de formato
    }

    const user = new User(
        null, null, null, null,
        this.emailInput.value.trim(),
        null, null, null,
        this.passwordInput.value,
        null, null
    );

    try {
        const response = await fetch('/SignUpSignInApplication/webresources/entities.user', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            // El servidor ha respondido con error (no ha devuelto la lista)
            throw new Error('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
        }

        // Lista de todos los usuarios de la base de datos
        const data = await response.json();
        const users = Array.isArray(data) ? data : [data];

        // Buscar un usuario con el mismo email y la misma contraseña
        const found = users.find(u =>
            u.email === user.email && u.password === user.password
        );

        if (!found) {
            throw new Error('Las credenciales no son correctas o el usuario no está registrado.');
        }

        const loggedUser = User.fromJSON(found);
        sessionStorage.setItem("user.id", loggedUser.id);
        sessionStorage.setItem("user.email", loggedUser.email);
        sessionStorage.setItem("user.password", loggedUser.password);
        sessionStorage.setItem("user.firstName", loggedUser.firstName ?? "");
        sessionStorage.setItem("user.middleInitial", loggedUser.middleInitial ?? "");
        sessionStorage.setItem("user.lastName", loggedUser.lastName ?? "");
        sessionStorage.setItem("user.street", loggedUser.street ?? "");
        sessionStorage.setItem("user.city", loggedUser.city ?? "");
        sessionStorage.setItem("user.state", loggedUser.state ?? "");
        sessionStorage.setItem("user.zip", loggedUser.zip ?? "");
        sessionStorage.setItem("user.phone", loggedUser.phone ?? "");

        // Guarda también el usuario completo en una sola clave
        sessionStorage.setItem("user", JSON.stringify(loggedUser));
        window.location.href = 'page4.html';
        
    } catch (error) {
        // Muestra el mensaje en rojo debajo del campo de contraseña
        this.showError('password', error.message);
    }
}


    handleCancel(e) {
        e.preventDefault();
        window.location.href = 'index.html';
    }

    handleSignUp(e) {
        e.preventDefault();
        window.location.href = 'page2.html';
    }
}


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    new SignIn();
});