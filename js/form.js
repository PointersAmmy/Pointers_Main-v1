
let currentStep = 1;
const totalSteps = 2;

function updateProgressBar() {
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step${i}`);
        if (i < currentStep) {
            stepElement.classList.add('completed');
            stepElement.classList.remove('active');
        } else if (i === currentStep) {
            stepElement.classList.add('active');
            stepElement.classList.remove('completed');
        } else {
            stepElement.classList.remove('active', 'completed');
        }
    }
}

function showStep(stepNumber) {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('active');
    updateProgressBar();
}

function nextStep() {
    const currentFormStep = document.getElementById(`step-${currentStep}`);
    const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });
    
    if (isValid && currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// File upload name display
document.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
        const labelId = this.id + '-name';
        document.getElementById(labelId).textContent = fileName;
        
        // Validate required files
        if (this.required && !this.files[0]) {
            this.setCustomValidity('Please upload this file');
        } else {
            this.setCustomValidity('');
        }
    });
});

// Form submission
document.getElementById('multiStepForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate final step
    const inputs = document.querySelectorAll('#step-2 input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });
    
    if (isValid) {
        //alert('Form submitted successfully!');
        // Here you would typically send the form data to the server
        // this.submit();
    }
});
// Replace your existing form submission handler with this:
document.getElementById('multiStepForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate final step
    const inputs = document.querySelectorAll('#step-2 input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
        }
    });
    
    if (!isValid) return;

    // Collect all form data
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('mobile', document.getElementById('mobile').value);
    formData.append('aadhar_number', document.getElementById('aadhar').value);
    formData.append('pan_number', document.getElementById('pan').value);
    
    // Add files
    const fileInputs = [
        'pan-card',
        'aadhar-front',
        'aadhar-back',
        'education-cert',
        'bank-details',
        'gst-cert'
    ];
    
    fileInputs.forEach(inputId => {
        const fileInput = document.getElementById(inputId);
        if (fileInput && fileInput.files[0]) {
            formData.append(inputId, fileInput.files[0]);
        }
    });

    try {
        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Send to backend
        const response = await fetch('https://13.60.211.85:4000/submit-form', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Form submitted successfully! We will contact you soon.');
            // Reset form
            this.reset();
            currentStep = 1;
            showStep(currentStep);
            // Reset file names
            document.querySelectorAll('.file-name').forEach(el => {
                el.textContent = 'No file chosen';
            });
        } else {
            throw new Error(result.message || 'Failed to submit form');
        }
    } catch (error) {
        //alert(`Error: ${error.message}`);
    } finally {
        // Reset button state
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});
