// Email Service using EmailJS
class EmailService {
    constructor() {
        // EmailJS configuration - You'll need to replace these with your actual values
        this.serviceID = 'service_7z065de'; // Your EmailJS service ID
        this.templateID = 'template_6926mrk'; // Your EmailJS template ID
        this.publicKey = 'RepnMH8wE8bzSlRsO'; // Your EmailJS public key
        
        this.init();
    }

    init() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
            this.setupFormHandler();
        } else {
            console.error('EmailJS library not loaded');
        }
    }

    setupFormHandler() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const sendBtn = document.getElementById('send-btn');
        const btnText = sendBtn.querySelector('.btn-text');
        const btnLoading = sendBtn.querySelector('.btn-loading');
        
        // Get form data - using only the essential variables that match your EmailJS template
        const formData = {
            from_name: document.getElementById('from_name').value.trim(),
            from_email: document.getElementById('from_email').value.trim(),
            message: document.getElementById('message').value.trim(),
            to_email: 'mybudgetbuddy2025@gmail.com' // Recipient email
        };

        // Validate form data
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        this.setLoadingState(sendBtn, btnText, btnLoading, true);

        try {
            // Check if EmailJS is available
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS library not loaded. Please refresh the page and try again.');
            }
            
            console.log('Attempting to send email with data:', formData);
            console.log('Using Service ID:', this.serviceID);
            console.log('Using Template ID:', this.templateID);
            
            // Send email using EmailJS
            const response = await emailjs.send(this.serviceID, this.templateID, formData);
            
            console.log('EmailJS response:', response);
            
            if (response.status === 200) {
                this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error(`EmailJS returned status: ${response.status}`);
            }
        } catch (error) {
            console.error('Email sending error:', error);
            
            // More specific error messages
            let errorMessage = 'Failed to send message. ';
            
            if (error.text) {
                errorMessage += `Error: ${error.text}. `;
            } else if (error.message) {
                errorMessage += `Error: ${error.message}. `;
            }
            
            errorMessage += 'Please try again or contact us directly at mybudgetbuddy2025@gmail.com';
            
            this.showNotification(errorMessage, 'error');
        } finally {
            // Hide loading state
            this.setLoadingState(sendBtn, btnText, btnLoading, false);
        }
    }

    validateForm(formData) {
        if (!formData.from_name) {
            this.showNotification('Please enter your name', 'error');
            document.getElementById('from_name').focus();
            return false;
        }

        if (!formData.from_email) {
            this.showNotification('Please enter your email', 'error');
            document.getElementById('from_email').focus();
            return false;
        }

        if (!this.isValidEmail(formData.from_email)) {
            this.showNotification('Please enter a valid email address', 'error');
            document.getElementById('from_email').focus();
            return false;
        }

        if (!formData.message) {
            this.showNotification('Please enter your message', 'error');
            document.getElementById('message').focus();
            return false;
        }

        if (formData.message.length < 10) {
            this.showNotification('Please enter a more detailed message (at least 10 characters)', 'error');
            document.getElementById('message').focus();
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setLoadingState(button, textSpan, loadingSpan, isLoading) {
        if (isLoading) {
            button.disabled = true;
            textSpan.style.display = 'none';
            loadingSpan.style.display = 'inline-flex';
            button.style.opacity = '0.7';
        } else {
            button.disabled = false;
            textSpan.style.display = 'inline';
            loadingSpan.style.display = 'none';
            button.style.opacity = '1';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: 'Inter', sans-serif;
            line-height: 1.4;
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Method to update configuration (call this with your actual EmailJS credentials)
    updateConfig(serviceID, templateID, publicKey) {
        this.serviceID = serviceID;
        this.templateID = templateID;
        this.publicKey = publicKey;
        
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
        }
    }
}

// Initialize email service when DOM is loaded
let emailService;

document.addEventListener('DOMContentLoaded', function() {
    emailService = new EmailService();
    
    // Show setup instructions if configuration is not complete
    if (emailService.serviceID === 'YOUR_SERVICE_ID') {
        console.log(`
🔧 EmailJS Setup Required:

1. Go to https://www.emailjs.com/ and create a free account
2. Create a new email service (Gmail)
3. Create an email template with these variables:
   - {{from_name}} - Sender's name
   - {{from_email}} - Sender's email
   - {{message}} - Message content
   - {{to_email}} - Your email (mybudgetbuddy2025@gmail.com)
   - {{website}} - Website name
   - {{timestamp}} - When message was sent

4. Get your Service ID, Template ID, and Public Key
5. Update the configuration in email-service.js:
   
   emailService.updateConfig('your_service_id', 'your_template_id', 'your_public_key');

Example email template:
Subject: New Contact Form Submission from {{website}}

Hello,

You have received a new message from your Budget Buddy website:

Name: {{from_name}}
Email: {{from_email}}
Message: {{message}}

Sent at: {{timestamp}}

Best regards,
Budget Buddy Contact Form
        `);
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}
