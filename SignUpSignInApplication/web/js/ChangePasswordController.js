import { User } from './user.js';
export class ChangePasswordController {
    /**
     * Minimal Change Password Controller
     */
    constructor() {
        // Attributes
        this.form = document.getElementById('changePasswordForm');
        this.currentPasswordInput = document.getElementById('currentPassword');
        this.newPasswordInput = document.getElementById('newPassword');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.feedbackMessage = document.getElementById('feedbackMessage');
        this.submitButton = this.form ? this.form.querySelector('button[type="submit"]') : null;
        this.passwordToggles = document.querySelectorAll('.toggle-password');

        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.newPasswordInput.addEventListener('blur', () => this.validateNewPassword());
        this.confirmPasswordInput.addEventListener('blur', () => this.validatePasswordMatch());
        this.newPasswordInput.addEventListener('input', () => this.clearError());
        this.confirmPasswordInput.addEventListener('input', () => this.clearError());
        this.passwordToggles.forEach(toggle => toggle.addEventListener('click', (e) => this.togglePassword(e)));
    }
    /**
     * Alternates password visibility
     * @param {Event} e - Click event
     */
    togglePassword(e) {
        const toggleBtn = e.currentTarget;
        const input = document.getElementById(toggleBtn.getAttribute('data-target'));
        
        input.type = input.type === 'password' ? 'text' : 'password';
        toggleBtn.querySelector('svg').style.opacity = input.type === 'text' ? '0.4' : '1';
    }
    /**
     * Validates new password using Regular Expression (Según apuntes)
     * @todo: Utilizar la misma expresión regular que se utiliza en SignUp para 
     * validar el requisito de contraseña. Modificar el mensaje de error 
     * correspondiente de acuerdo al requisito de contraseña.
     */
    validateNewPassword() {
        const password = this.newPasswordInput.value;
        //Se utilizado la misma expresión regular que se utiliza en SignUp
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        try {
            if (!password) {
                throw new Error('New password is required');
            }
            //Se ha modificado el mensaje de error para que sea concordante con la expresión regular.
            if (!passwordRegex.test(password)) {
                throw new Error('Password must have at least 8 characters, including uppercase, lowercase, numbers, and one special character.');
            }
            return true;
        } catch (error) {
            this.showFeedback(error.message, 'danger');
            return false;
        }
    }
    /**
     * Validates that both passwords match
     */
    validatePasswordMatch() {
        const newPass = this.newPasswordInput.value;
        const confirmPass = this.confirmPasswordInput.value;

        try {
            if (!confirmPass) {
                throw new Error('Please confirm your new password');
            }
            if (newPass !== confirmPass) {
                throw new Error('New passwords do not match');
            }
            return true;
        } catch (error) {
            this.showFeedback(error.message, 'danger');
            return false;
        }
    }
    /**
     * Controls loading state on submit button
     */
    setLoading(isLoading) {
        if (!this.submitButton) return;

        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.dataset.originalText = this.submitButton.textContent;
            this.submitButton.textContent = 'Updating...';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.textContent = this.submitButton.dataset.originalText || 'Submit';
        }
    }
    /**
     * Clears feedback error message
     */
    clearError() {
        this.feedbackMessage.style.display = 'none';
        this.feedbackMessage.textContent = '';
    }
    /**
     * Async handles form submission
     * @param {Event} e - Submit event
     * @todo comentar todas las sentencias de al menos esta función
     */
    async handleSubmit(e) {
        e.preventDefault(); //Previene que se envíe el formulario por defecto
        e.stopPropagation();

        const currentPass = this.currentPasswordInput.value; // Establece que el valor de la contraseña actual se obtenga del input (cuadro) en el que se escriba.
        const newPass = this.newPasswordInput.value; //  Establece que el valor de la nueva contraseña se obtenga del input (cuadro) en el que se escriba.
        const confirmPass = this.confirmPasswordInput.value; //  Establece que el valor de la confirmación/repetición de la nueva contraseña se obtenga del input (cuadro) en el que se escriba.

        // Se asegura que el campo de contraseña actual no esté vacío y, si lo está, muestra el mensaje de error.
        if (!currentPass.trim()) {
            this.showFeedback('Current password is required', 'danger');
            return;
        }
        // Detiene el flujo si no se ha cumplido con las validaciones de la nueva contraseña y la coincidencia de la misma.
        if (!this.validateNewPassword() || !this.validatePasswordMatch()) {
            return; 
        }
        this.setLoading(true);
        try {
            const url = '/SignUpSignInApplication/webresources/entities.user/'; //establece la conexión con nuestro lado servidor.

            // JSON object with the data to send in the request body
            // Reconstruye el modelo User desde el almacenamiento de sesión.
             const user = new User ( 
                sessionStorage.getItem("user.id"),
                sessionStorage.getItem("user.zip"),
                sessionStorage.getItem("user.phone"), 
                sessionStorage.getItem("user.city"),
                sessionStorage.getItem("user.email"),
                sessionStorage.getItem("user.firstName"),
                sessionStorage.getItem("user.lastName"),
                sessionStorage.getItem("user.middleInitial"),
                sessionStorage.getItem("user.password"),
                sessionStorage.getItem("user.state"),
                sessionStorage.getItem("user.street")
            );
            
           //const user = User.fromJSON(sessionStorage.getItem("user"));
            /* Verifica que la contraseña ingresada en el campo de currentPass sea la misma que el usuario ha utilizado para iniciar la sesión
             y le envía un mensaje al usuario que la contraseña actual ingresada es incorrecta.*/
            if (currentPass !== user.password) { 
                throw new Error('Current password is incorrect.'); 
            }
            //
            user.password = newPass; 
            /* Pide al backend REST que haga el fetch utilizando el método PUT, mediante el cual reemplaza el campo
            que se quiere modificar por la nueva contraseña utilizando JSON, clave-valor. */
            const response = await fetch(url+user.id, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user) // The data travels hidden in the body
            });
            // Si la respuesta del servidor no es exitosa muestra el error.
            if (!response.ok) { 
                throw new Error(); 
            }
            // Permite que el usuario pueda cambiar nuevamente la contraseña dentro de la misma sesión
            sessionStorage.setItem("user.password", newPass);
            // Muestra el mensaje de éxito en el cambio de contraseña
            this.showFeedback('Password changed successfully!', 'success');
            // Realiza la redirección a la página de inicio (page4.html) tras el cambio exitoso
            setTimeout(() => {
                window.location.href = '/SignUpSignInApplication/html/page4.html';
            }, 2000);

        } catch (error) {
            // Respuesta cuando hay error de validación o falla la conexión con el backend REST.
            this.showFeedback(error.message || 'Server connection error. Please try again later.', 'danger');
        } finally {
            this.setLoading(false);
        }
    }
    /**
     * Shows feedback message on screen
     * @param {string} message - Message text
     * @param {string} type - Alert type ('danger', 'success')
     */
    showFeedback(message, type) {
        this.feedbackMessage.textContent = message;
        this.feedbackMessage.className = `alert mb-4 text-center alert-${type}`;
        this.feedbackMessage.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ChangePasswordController();
});