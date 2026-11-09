class SignUpController {
    constructor() {
        this.form = document.querySelector('form');
        this.firstNameInput = document.getElementById('firstName-form02-8');
        this.middleInitialInput = document.getElementById('middleIntial-form02-8');
        this.lastNameInput = document.getElementById('lastName-form02-8');
        this.streetAddressInput = document.getElementById('street-form02-8');
        this.cityInput = document.getElementById('city-form02-8');
        this.stateInput = document.getElementById('state-form02-8');
        this.zipCodeInput = document.getElementById('zip-form02-8');
        this.phoneInput = document.getElementById('phone-form02-8');
        this.emailInput = document.getElementById('email-form02-8');
        this.passwordInput = document.getElementById('password-form02-8');
        this.confirmPasswordInput = document.getElementById('confirmPassword-form02-8');
        
        this.toggles = document.querySelectorAll('.toggle-password');
        this.submitButton = this.form.querySelector('button[type="submit"], input[type="submit"]');
        this.originalButtonText = this.submitButton ? this.submitButton.textContent : 'Sign up';

        // Escuchar el envío del formulario
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Eventos de FOCO (Click) -> Cambiar fondo a blanco (#ffffff)
        const allInputs = [
            this.firstNameInput, this.middleInitialInput, this.lastNameInput, 
            this.streetAddressInput, this.cityInput, this.stateInput, 
            this.zipCodeInput, this.phoneInput, this.emailInput, 
            this.passwordInput, this.confirmPasswordInput
        ];

        allInputs.forEach(input => {
            if (input) {
                input.addEventListener('focus', (e) => this.setActiveBackground(e));
                input.addEventListener('input', () => this.clearError(input));
            }
        });

        // Eventos de PÉRDIDA DE FOCO (Blur)
        if (this.firstNameInput) this.firstNameInput.addEventListener('blur', () => this.validateFirstName());
        if (this.middleInitialInput) this.middleInitialInput.addEventListener('blur', () => this.validateMiddleInitial());
        if (this.lastNameInput) this.lastNameInput.addEventListener('blur', () => this.validateLastName());
        if (this.streetAddressInput) this.streetAddressInput.addEventListener('blur', () => this.validateStreetAddress());
        if (this.cityInput) this.cityInput.addEventListener('blur', () => this.validateCity());
        if (this.stateInput) this.stateInput.addEventListener('blur', () => this.validateState());
        if (this.zipCodeInput) this.zipCodeInput.addEventListener('blur', () => this.validateZipCode());
        if (this.phoneInput) this.phoneInput.addEventListener('blur', () => this.validatePhone());
        if (this.emailInput) this.emailInput.addEventListener('blur', () => this.validateEmail());
        if (this.passwordInput) this.passwordInput.addEventListener('blur', () => this.validatePassword());
        if (this.confirmPasswordInput) this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());

        // Mostrar/Ocultar contraseñas (Ojos)
        this.toggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePassword(e));
        });
    }

    setActiveBackground(e) {
        e.target.style.backgroundColor = '#ffffff';
        this.clearError(e.target);
    }

    setRedBorder(inputElement) {
        inputElement.style.borderColor = '#ff0000';
    }

    showFieldError(inputElement, messages) {
        if (!inputElement) return;
        this.setRedBorder(inputElement);
        
        const targetElement = inputElement.closest('.password-container') || inputElement;
        const parentContainer = targetElement.parentNode;
        if (!parentContainer) return;
        
        // Evitar duplicados eliminando el error previo de este campo
        const existingError = parentContainer.querySelector(`[data-error-for="${inputElement.id}"]`);
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('data-error-for', inputElement.id);
        errorDiv.style.color = '#ff0000';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.width = '100%';
        errorDiv.style.clear = 'both';
        errorDiv.style.whiteSpace = 'pre-line';
        errorDiv.textContent = messages;

        targetElement.insertAdjacentElement('afterend', errorDiv);
    }

    clearError(inputElement) {
        if (!inputElement) return;
        inputElement.style.borderColor = '';
        
        const targetElement = inputElement.closest('.password-container') || inputElement;
        const parentContainer = targetElement.parentNode;
        if (parentContainer) {
            const errorDiv = parentContainer.querySelector(`[data-error-for="${inputElement.id}"]`);
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    }

    // ENVÍO ASÍNCRONO DEL FORMULARIO
    async handleFormSubmit(e) {
        e.preventDefault();

        this.validateFirstName();
        this.validateMiddleInitial();
        this.validateLastName();
        this.validateStreetAddress();
        this.validateCity();
        this.validateState();
        this.validateZipCode();
        this.validatePhone();
        this.validateEmail();
        this.validatePassword();
        this.validateConfirmPassword();

        const errors = this.form.querySelectorAll('.error-message');
        if (errors.length > 0) {
            return;
        }

        const formData = {
            firstName: this.firstNameInput.value.trim(),
            middleInitial: this.middleInitialInput.value.trim(),
            lastName: this.lastNameInput.value.trim(),
            street: this.streetAddressInput.value.trim(),
            city: this.cityInput.value.trim(),
            state: this.stateInput.value.trim(),
            zip: this.zipCodeInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value.trim()
        };

        if (this.submitButton) {
            this.submitButton.disabled = true;
        }

        try {
            const response = await fetch(this.form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            let responseText = "";
            try {
                responseText = await response.text();
            } catch (err) {
                responseText = "";
            }

            // CASO ÉXITO: HTTP 204
            if (response.status === 204 || response.ok) {
                alert('Usuario creado correctamente');
                window.location.href = 'page1.html';
                return;
            }

            // CASO ERROR 500 (MySQL, GlassFish o Usuario duplicado)
            if (response.status === 500) {
                const lowerText = responseText.toLowerCase();
                if (lowerText.includes('exist') || lowerText.includes('duplicate') || lowerText.includes('ya existe')) {
                    alert("El usuario ya existe");
                } else {
                    alert("Error del servidor: GlassFish o MySQL no están disponibles.");
                }
                return;
            }

            throw new Error("Error del servidor.");

        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error del servidor: GlassFish o MySQL no están disponibles.");
        } finally {
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.textContent = this.originalButtonText;
            }
        }
    }

    // VALIDACIONES ESPECÍFICAS
    validateFirstName() {
        const regex = /^[A-Za-z\s]+$/;
        const val = this.firstNameInput.value.trim();
        if (val === '' || !regex.test(val)) {
            this.showFieldError(this.firstNameInput, '(*) Enter only letters and spaces.\n(*) Do not enter numbers or special characters.');
        } else {
            this.clearError(this.firstNameInput);
        }
    }

    validateMiddleInitial() {
        const val = this.middleInitialInput.value.trim();
        const regex = /^[A-Za-z]$/;
        if (val !== '' && !regex.test(val)) {
            this.showFieldError(this.middleInitialInput, '(*) Enter only one letter.\n(*) Do not enter numbers or special characters.');
        } else {
            this.clearError(this.middleInitialInput);
        }
    }

    validateLastName() {
        const regex = /^[A-Za-z\s]+$/;
        const val = this.lastNameInput.value.trim();
        if (val === '' || !regex.test(val)) {
            this.showFieldError(this.lastNameInput, '(*) Enter only letters and spaces.\n(*) Do not enter numbers or special characters.');
        } else {
            this.clearError(this.lastNameInput);
        }
    }

    validateStreetAddress() {
        const regex = /^[A-Za-z0-9\s]+$/;
        const val = this.streetAddressInput.value.trim();
        if (val === '' || !regex.test(val)) {
            this.showFieldError(this.streetAddressInput, '(*) Enter only letters, numbers and spaces.\n(*) Do not enter symbols or special characters.');
        } else {
            this.clearError(this.streetAddressInput);
        }
    }

    validateCity() {
        const regex = /^[A-Za-z\s]+$/;
        const val = this.cityInput.value.trim();
        if (val === '' || !regex.test(val)) {
            this.showFieldError(this.cityInput, '(*) Enter only letters and spaces.\n(*) Do not enter numbers or special characters.');
        } else {
            this.clearError(this.cityInput);
        }
    }

    validateState() {
        const regex = /^[A-Za-z\s]+$/;
        const val = this.stateInput.value.trim();
        if (val === '' || !regex.test(val)) {
            this.showFieldError(this.stateInput, '(*) Enter only letters and spaces.\n(*) Do not enter numbers or special characters.');
        } else {
            this.clearError(this.stateInput);
        }
    }

    validateZipCode() {
        const regex = /^\d{5}$/;
        const val = this.zipCodeInput.value.trim();
        if (!regex.test(val)) {
            this.showFieldError(this.zipCodeInput, '(*) Enter only digits (5 numbers).\n(*) Do not enter letters, spaces, or special characters.');
        } else {
            this.clearError(this.zipCodeInput);
        }
    }

    validatePhone() {
        const regex = /^\d{9,13}$/;
        const val = this.phoneInput.value.trim();
        if (!regex.test(val)) {
            this.showFieldError(this.phoneInput, '(*) Enter only digits (9 to 13 numbers)\n(*) Do not enter letters, spaces or special characters.');
        } else {
            this.clearError(this.phoneInput);
        }
    }

    validateEmail() {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const val = this.emailInput.value.trim();
        if (!regex.test(val)) {
            this.showFieldError(this.emailInput, '(*) Enter a valid email address (e.g. user@example.com)\n(*) Do not enter spaces or invalid characters.');
        } else {
            this.clearError(this.emailInput);
        }
    }

    validatePassword() {
        const val = this.passwordInput.value;
        const hasSpaces = /\s/.test(val);
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (val === '') {
            this.showFieldError(this.passwordInput, '(*) Password cannot be empty.');
        } else if (hasSpaces) {
            this.showFieldError(this.passwordInput, '(*) Do not include spaces.');
        } else if (!regex.test(val)) {
            this.showFieldError(this.passwordInput, '(*) Password must have at least 8 characters, including uppercase, lowercase, numbers, and one special character.');
        } else {
            this.clearError(this.passwordInput);
        }
    }

    validateConfirmPassword() {
        const val = this.confirmPasswordInput.value;
        if (val === '') {
            this.showFieldError(this.confirmPasswordInput, '(*) Complete this field.');
        } else if (val !== this.passwordInput.value) {
            this.showFieldError(this.confirmPasswordInput, '(*) Passwords do not match.\n(*)Please re-enter the same password.');
        } else {
            this.clearError(this.confirmPasswordInput);
        }
    }

    togglePassword(e) {
    const container = e.currentTarget.closest('.password-container');
    const input = container ? container.querySelector('input') : null;
    const slashLine = container ? container.querySelector('.eye-slash-line') : null;

    if (input) {
        const isHidden = input.type === 'password';
        
        // Cambia entre visible ('text') y oculta ('password')
        input.type = isHidden ? 'text' : 'password';

        // Muestra u oculta la línea tachada del SVG
        if (slashLine) {
            slashLine.style.display = isHidden ? 'none' : 'inline';
        }
    }
}
}

document.addEventListener('DOMContentLoaded', () => {
    new SignUpController();
});