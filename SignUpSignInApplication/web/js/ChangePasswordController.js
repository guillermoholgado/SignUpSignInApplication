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
     */
    validateNewPassword() {
        const password = this.newPasswordInput.value;
        // RegExp: Mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        try {
            if (!password) {
                throw new Error('New password is required');
            }
            if (!passwordRegex.test(password)) {
                throw new Error('Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.');
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
     */
    async handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const currentPass = this.currentPasswordInput.value;
        const newPass = this.newPasswordInput.value;
        const confirmPass = this.confirmPasswordInput.value;

        if (!currentPass.trim()) {
            this.showFeedback('Current password is required', 'danger');
            return;
        }
        if (!this.validateNewPassword() || !this.validatePasswordMatch()) {
            return; 
        }
        this.setLoading(true);
        try {
            const url = '/SignUpSignInApplication/webresources/entities.user/';

            // JSON object with the data to send in the request body
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
            if (currentPass !== user.password) {
                throw new Error('Current password is incorrect.');
            }
            user.password = newPass;
            const response = await fetch(url+user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user) // The data travels hidden in the body
            });

            if (!response.ok) {
                throw new Error();
            }
            sessionStorage.setItem("user.password", newPass);
            this.showFeedback('Password changed successfully!', 'success');

            setTimeout(() => {
                window.location.href = '/SignUpSignInApplication/html/page4.html';
            }, 2000);

        } catch (error) {
            // Respuetsa cuando no hay conexión al backend REST
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