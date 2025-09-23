# 📧 Email Setup Guide for Budget Buddy

This guide will help you set up email functionality so that contact form submissions are sent directly to your Gmail account.

## 🚀 Quick Setup Steps

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service (Gmail)
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select "Gmail"
4. Click "Connect Account" and authorize with your Gmail account (mybudgetbuddy2025@gmail.com)
5. Give your service a name like "Budget Buddy Gmail"
6. Copy the **Service ID** (you'll need this later)

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template:

**Template Name:** Budget Buddy Contact Form

**Subject:** New Contact Form Submission from Budget Buddy

**Content:**
```
Hello Budget Buddy Team,

You have received a new message from your website:

Name: {{from_name}}
Email: {{from_email}}
Message: {{message}}

Sent from: {{website}}
Timestamp: {{timestamp}}

Please respond to the user at: {{from_email}}

Best regards,
Budget Buddy Contact Form System
```

4. Save the template and copy the **Template ID**

### Step 4: Get Your Public Key
1. Go to "Account" in your EmailJS dashboard
2. Find your **Public Key** (also called User ID)
3. Copy this key

### Step 5: Update Your Website Configuration
1. Open the `email-service.js` file
2. Find these lines at the top:
```javascript
this.serviceID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS service ID
this.templateID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS template ID
this.publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key
```

3. Replace with your actual values:
```javascript
this.serviceID = 'service_xxxxxxx'; // Your actual service ID
this.templateID = 'template_xxxxxxx'; // Your actual template ID
this.publicKey = 'xxxxxxxxxxxxxxx'; // Your actual public key
```

### Step 6: Test the Setup
1. Open your website
2. Go to the Contact section
3. Fill out the form and submit
4. Check your Gmail inbox for the message

## 🔧 Alternative: Quick Configuration Method

If you want to test quickly, you can also update the configuration using the browser console:

1. Open your website
2. Press F12 to open developer tools
3. Go to the Console tab
4. Run this command with your actual values:
```javascript
emailService.updateConfig('your_service_id', 'your_template_id', 'your_public_key');
```

## 📋 Email Template Variables

The following variables are automatically filled in your email template:

- `{{from_name}}` - Name entered by the user
- `{{from_email}}` - Email entered by the user  
- `{{message}}` - Message entered by the user
- `{{to_email}}` - Your Gmail address (mybudgetbuddy2025@gmail.com)
- `{{website}}` - "Budget Buddy Website"
- `{{timestamp}}` - When the message was sent

## 🎯 Features Included

✅ **Form Validation** - Ensures all fields are filled correctly
✅ **Loading States** - Shows spinner while sending
✅ **Success/Error Messages** - User feedback for all scenarios
✅ **Email Validation** - Checks for valid email format
✅ **Spam Protection** - Built-in EmailJS protection
✅ **Mobile Responsive** - Works on all devices
✅ **Professional Templates** - Clean email formatting

## 🔒 Security & Privacy

- EmailJS handles all email sending securely
- No sensitive data is stored in your website code
- Your Gmail credentials are never exposed
- Free tier includes 200 emails per month
- All communications are encrypted

## 🆘 Troubleshooting

**Problem: Emails not being received**
- Check your spam folder
- Verify your EmailJS service is connected to the correct Gmail account
- Make sure your template ID and service ID are correct

**Problem: Form shows error message**
- Check browser console for detailed error messages
- Verify all three IDs (service, template, public key) are correctly entered
- Make sure EmailJS account is verified

**Problem: Loading spinner doesn't stop**
- This usually indicates a configuration error
- Check the browser console for error messages
- Verify your EmailJS account has remaining email quota

## 📞 Support

If you need help with setup:
1. Check the browser console for error messages
2. Verify your EmailJS dashboard settings
3. Test with a simple template first
4. Contact EmailJS support if needed

---

**Note:** The free EmailJS plan includes 200 emails per month, which should be sufficient for most contact forms. If you need more, you can upgrade to a paid plan.
