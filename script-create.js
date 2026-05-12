let qrCode;

const qrTypeSelect = document.getElementById('qr-type');
const formFields = document.getElementById('form-fields');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');

// Initialize QR Code
function initQR() {
    qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: "https://proqr.com",
        dotsOptions: {
            color: "#000000",
            type: "square"
        },
        cornersSquareOptions: {
            type: "square"
        },
        cornersDotOptions: {
            type: "square"
        },
        backgroundOptions: {
            color: "#ffffff",
        }
    });
    qrCode.append(document.getElementById('qr-preview'));
}

// Generate QR Data based on type
function generateData() {
    const isDynamic = document.getElementById('dynamic-qr').checked;
    if (isDynamic) {
        const dynamicId = document.getElementById('dynamic-id').value.trim();
        if (!dynamicId) {
            showValidationError('Please enter a unique QR ID for dynamic QR.');
            return 'https://proqr.com/dynamic-placeholder';
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(dynamicId)) {
            showValidationError('QR ID can only contain letters, numbers, hyphens, and underscores.');
            return 'https://proqr.com/dynamic-placeholder';
        }
        return `https://proqr.com/d/${dynamicId}`;
    }

    const type = qrTypeSelect.value;
    let data = "";

    switch(type) {
        case 'url':
            data = document.getElementById('url-input').value || "https://example.com";
            break;
        case 'text':
            data = document.getElementById('text-input').value || "Hello World";
            break;
        case 'wifi':
            const ssid = document.getElementById('ssid').value;
            const password = document.getElementById('wifi-password').value;
            const security = document.getElementById('wifi-security').value;
            data = `WIFI:S:${ssid};T:${security};P:${password};;`;
            break;
        case 'upi':
            const upiId = document.getElementById('upi-id').value;
            const payeeName = document.getElementById('payee-name').value;
            const amount = document.getElementById('amount').value;
            data = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}${amount ? `&am=${amount}` : ''}`;
            break;
        case 'whatsapp':
            const phone = document.getElementById('phone').value.replace(/\D/g, '');
            const message = document.getElementById('message').value;
            data = `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
            break;
        case 'email':
            const email = document.getElementById('email-input').value;
            const subject = document.getElementById('subject-input').value;
            data = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
            break;
        case 'phone':
            data = `tel:${document.getElementById('phone-input').value}`;
            break;
        case 'vcard':
            const name = document.getElementById('vcard-name').value;
            const vemail = document.getElementById('vcard-email').value;
            const vphone = document.getElementById('vcard-phone').value;
            data = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nEMAIL:${vemail}\nTEL:${vphone}\nEND:VCARD`;
            break;
        case 'pdf':
            data = document.getElementById('pdf-url').value || "https://example.com/file.pdf";
            break;
        case 'menu':
            data = document.getElementById('menu-url').value || "https://restaurant.com/menu";
            break;
        case 'instagram':
            const igUser = document.getElementById('instagram-username').value;
            data = igUser ? `https://instagram.com/${igUser.replace('@', '')}` : "https://instagram.com";
            break;
        case 'facebook':
            data = document.getElementById('facebook-url').value || "https://facebook.com";
            break;
        case 'youtube':
            data = document.getElementById('youtube-url').value || "https://youtube.com";
            break;
        case 'twitter':
            const twHandle = document.getElementById('twitter-handle').value;
            data = twHandle ? `https://twitter.com/${twHandle.replace('@', '')}` : "https://twitter.com";
            break;
        case 'linkedin':
            data = document.getElementById('linkedin-url').value || "https://linkedin.com";
            break;
        case 'paypal':
            const ppEmail = document.getElementById('paypal-email').value;
            data = ppEmail.includes('@') ? `https://paypal.me/${ppEmail.split('@')[0]}` : ppEmail;
            break;
        case 'crypto':
            const cryptoAddr = document.getElementById('crypto-address').value;
            const cryptoAmt = document.getElementById('crypto-amount').value;
            data = `bitcoin:${cryptoAddr}${cryptoAmt ? `?amount=${cryptoAmt}` : ''}`;
            break;
        case 'sms':
            const smsPhone = document.getElementById('sms-phone').value.replace(/\D/g, '');
            const smsMsg = document.getElementById('sms-message').value;
            data = `sms:${smsPhone}${smsMsg ? `?body=${encodeURIComponent(smsMsg)}` : ''}`;
            break;
        default:
            data = "https://proqr.com";
    }

    return data;
}

// Update QR
function updateQR() {
    const data = generateData();
    const size = parseInt(sizeSlider.value);

    // Background options - Use uniform gradients for single colors and transparent
    let backgroundOptions = {};
    const bgType = document.querySelector('input[name="bg-type"]:checked').value;
    if (bgType === 'single') {
        const colorValue = document.getElementById('bg-color').value;
        backgroundOptions = {
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: colorValue },
                    { offset: 1, color: colorValue }
                ]
            }
        };
    } else if (bgType === 'gradient') {
        backgroundOptions = {
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: document.getElementById('bg-gradient-start').value },
                    { offset: 1, color: document.getElementById('bg-gradient-end').value }
                ]
            }
        };
    } else if (bgType === 'transparent') {
        backgroundOptions = {
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: 'transparent' },
                    { offset: 1, color: 'transparent' }
                ]
            }
        };
    }

    // Eye color options - Use uniform gradients for single colors
    let eyeColorOptions = {};
    const eyeType = document.querySelector('input[name="eye-type"]:checked').value;
    if (eyeType === 'single') {
        const colorValue = document.getElementById('eye-color').value;
        eyeColorOptions = {
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: colorValue },
                    { offset: 1, color: colorValue }
                ]
            }
        };
    } else if (eyeType === 'gradient') {
        eyeColorOptions = {
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: document.getElementById('eye-gradient-start').value },
                    { offset: 1, color: document.getElementById('eye-gradient-end').value }
                ]
            }
        };
    }

    // Internal eye style
    const internalEyeStyle = document.getElementById('internal-eye-style').value;

    // Body pattern
    const bodyPattern = document.getElementById('body-pattern').value;

    qrCode.update({
        data: data,
        width: size,
        height: size,
        dotsOptions: {
            ...eyeColorOptions,
            type: bodyPattern
        },
        cornersSquareOptions: {
            ...eyeColorOptions,
            type: 'square'
        },
        cornersDotOptions: {
            ...eyeColorOptions,
            type: internalEyeStyle
        },
        backgroundOptions: backgroundOptions
    });

    // Apply frame style
    const frameStyle = document.getElementById('frame-style').value;
    const qrPreview = document.getElementById('qr-preview');
    qrPreview.className = 'flex justify-center mb-6 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300';
    if (frameStyle === 'square') {
        qrPreview.classList.add('border-gray-800', 'border-solid');
    } else if (frameStyle === 'rounded') {
        qrPreview.classList.add('border-gray-800', 'border-solid', 'rounded-lg');
    }
}

// Handle background type change
document.querySelectorAll('input[name="bg-type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Hide all background options first
        document.getElementById('bg-single').classList.add('hidden');
        document.getElementById('bg-gradient').classList.add('hidden');

        // Show the selected option
        if (this.value === 'single') {
            document.getElementById('bg-single').classList.remove('hidden');
        } else if (this.value === 'gradient') {
            document.getElementById('bg-gradient').classList.remove('hidden');
        }
        // For transparent, no additional fields needed

        updateQR();
    });
});

// Handle eye type change
document.querySelectorAll('input[name="eye-type"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Hide all eye options first
        document.getElementById('eye-single').classList.add('hidden');
        document.getElementById('eye-gradient').classList.add('hidden');

        // Show the selected option
        if (this.value === 'single') {
            document.getElementById('eye-single').classList.remove('hidden');
        } else if (this.value === 'gradient') {
            document.getElementById('eye-gradient').classList.remove('hidden');
        }

        updateQR();
    });
});

// Handle other customizations
document.getElementById('bg-color').addEventListener('input', updateQR);
document.getElementById('bg-gradient-start').addEventListener('input', updateQR);
document.getElementById('bg-gradient-end').addEventListener('input', updateQR);
document.getElementById('eye-color').addEventListener('input', updateQR);
document.getElementById('eye-gradient-start').addEventListener('input', updateQR);
document.getElementById('eye-gradient-end').addEventListener('input', updateQR);
document.getElementById('internal-eye-style').addEventListener('change', updateQR);
document.getElementById('body-pattern').addEventListener('change', updateQR);
document.getElementById('frame-style').addEventListener('change', updateQR);

// Theme presets
const themes = {
    default: {
        bgType: 'single', bgColor: '#ffffff',
        eyeType: 'single', eyeColor: '#000000',
        bodyPattern: 'square', internalEyeStyle: 'square', frameStyle: 'none'
    },
    classic: {
        bgType: 'single', bgColor: '#ffffff',
        eyeType: 'single', eyeColor: '#000000',
        bodyPattern: 'square', internalEyeStyle: 'square', frameStyle: 'square'
    },
    ocean: {
        bgType: 'gradient', bgGradientStart: '#006994', bgGradientEnd: '#00d4ff',
        eyeType: 'single', eyeColor: '#ffffff',
        bodyPattern: 'dots', internalEyeStyle: 'dot', frameStyle: 'rounded'
    },
    sunset: {
        bgType: 'gradient', bgGradientStart: '#ff7e5f', bgGradientEnd: '#feb47b',
        eyeType: 'gradient', eyeGradientStart: '#ff7e5f', eyeGradientEnd: '#feb47b',
        bodyPattern: 'rounded', internalEyeStyle: 'dot', frameStyle: 'none'
    },
    neon: {
        bgType: 'single', bgColor: '#000000',
        eyeType: 'single', eyeColor: '#00ff00',
        bodyPattern: 'extra-rounded', internalEyeStyle: 'dot', frameStyle: 'square'
    },
    minimal: {
        bgType: 'single', bgColor: '#ffffff',
        eyeType: 'single', eyeColor: '#cccccc',
        bodyPattern: 'square', internalEyeStyle: 'square', frameStyle: 'none'
    }
};

document.getElementById('theme').addEventListener('change', () => {
    const theme = document.getElementById('theme').value;
    if (theme !== 'default') {
        const preset = themes[theme];
        // Set radio buttons
        document.querySelector(`input[name="bg-type"][value="${preset.bgType}"]`).checked = true;
        document.querySelector(`input[name="eye-type"][value="${preset.eyeType}"]`).checked = true;
        // Trigger change to show fields
        document.querySelector(`input[name="bg-type"][value="${preset.bgType}"]`).dispatchEvent(new Event('change'));
        document.querySelector(`input[name="eye-type"][value="${preset.eyeType}"]`).dispatchEvent(new Event('change'));
        // Set colors
        if (preset.bgColor) document.getElementById('bg-color').value = preset.bgColor;
        if (preset.bgGradientStart) document.getElementById('bg-gradient-start').value = preset.bgGradientStart;
        if (preset.bgGradientEnd) document.getElementById('bg-gradient-end').value = preset.bgGradientEnd;
        if (preset.eyeColor) document.getElementById('eye-color').value = preset.eyeColor;
        if (preset.eyeGradientStart) document.getElementById('eye-gradient-start').value = preset.eyeGradientStart;
        if (preset.eyeGradientEnd) document.getElementById('eye-gradient-end').value = preset.eyeGradientEnd;
        // Set selects
        document.getElementById('body-pattern').value = preset.bodyPattern;
        document.getElementById('internal-eye-style').value = preset.internalEyeStyle;
        document.getElementById('frame-style').value = preset.frameStyle;
        updateQR();
    }
});

// Handle type change
qrTypeSelect.addEventListener('change', () => {
    // Hide all fields
    document.querySelectorAll('#form-fields > div').forEach(div => div.classList.add('hidden'));

    // Show relevant fields
    const type = qrTypeSelect.value;
    const fieldId = `${type}-fields`;
    const fieldDiv = document.getElementById(fieldId);
    if (fieldDiv) {
        fieldDiv.classList.remove('hidden');
    }

    updateQR();
});

// Handle dynamic QR checkbox
document.getElementById('dynamic-qr').addEventListener('change', () => {
    const isChecked = document.getElementById('dynamic-qr').checked;
    const optionsDiv = document.getElementById('dynamic-options');
    const formFields = document.getElementById('form-fields');
    const typeSelect = document.getElementById('qr-type');
    if (isChecked) {
        optionsDiv.classList.remove('hidden');
        formFields.classList.add('hidden');
        typeSelect.disabled = true;
    } else {
        optionsDiv.classList.add('hidden');
        formFields.classList.remove('hidden');
        typeSelect.disabled = false;
        // Trigger type change to show relevant fields
        qrTypeSelect.dispatchEvent(new Event('change'));
    }
    updateQR();
});

document.getElementById('dynamic-id').addEventListener('input', updateQR);

// Handle customization changes
sizeSlider.addEventListener('input', () => {
    sizeValue.textContent = sizeSlider.value + 'px';
    updateQR();
});

// Logo upload
document.getElementById('logo-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            qrCode.update({
                image: event.target.result,
                imageOptions: {
                    crossOrigin: "anonymous",
                    margin: 10
                }
            });
        };
        reader.readAsDataURL(file);
    }
});

// Generate button with loading state
document.getElementById('generate-btn').addEventListener('click', () => {
    const btn = document.getElementById('generate-btn');
    const originalText = btn.textContent;

    // Show loading state
    btn.textContent = 'Generating...';
    btn.disabled = true;
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    // Update QR
    updateQR();

    // Enable downloads
    document.getElementById('download-png').disabled = false;
    document.getElementById('download-svg').disabled = false;
    document.getElementById('download-pdf').disabled = false;

    // Reset button after short delay
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }, 500);
});

// Download functions
document.getElementById('download-png').addEventListener('click', () => {
    qrCode.download({ extension: "png" });
});

document.getElementById('download-svg').addEventListener('click', () => {
    qrCode.download({ extension: "svg" });
});

document.getElementById('download-pdf').addEventListener('click', () => {
    qrCode.getRawData("png").then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            pdf.addImage(reader.result, 'PNG', 10, 10, 180, 180);
            pdf.save('qr-code.pdf');
        };
        reader.readAsDataURL(blob);
    });
});

// Validation error display
function showValidationError(message) {
    // Remove existing error
    const existingError = document.querySelector('.validation-error');
    if (existingError) existingError.remove();

    // Add new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 fixed top-4 right-4 z-50 max-w-sm';
    errorDiv.innerHTML = `<span class="font-semibold">Error:</span> ${message}`;
    document.body.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Initialize
initQR();

// Read URL parameter for type
const urlParams = new URLSearchParams(window.location.search);
const initialType = urlParams.get('type');
if (initialType) {
    const select = document.getElementById('qr-type');
    select.value = initialType;
    // Trigger change to show fields
    qrTypeSelect.dispatchEvent(new Event('change'));
}

// Initialize toggle states
document.addEventListener('DOMContentLoaded', function() {
    // Trigger the change event for the checked radio buttons to set initial state
    const checkedBgRadio = document.querySelector('input[name="bg-type"]:checked');
    if (checkedBgRadio) {
        checkedBgRadio.dispatchEvent(new Event('change'));
    }

    const checkedEyeRadio = document.querySelector('input[name="eye-type"]:checked');
    if (checkedEyeRadio) {
        checkedEyeRadio.dispatchEvent(new Event('change'));
    }
});

lucide.createIcons();