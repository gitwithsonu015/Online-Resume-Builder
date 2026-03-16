// Main Script - Complete Resume Builder
document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentTemplate = 'modern';
    let isPaid = localStorage.getItem('resume_paid') === 'true';
    let photoDataUrl = localStorage.getItem('resume_photo') || '';

    const form = document.getElementById('resumeForm');
    const preview = document.getElementById('preview');
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const noPhoto = document.getElementById('noPhoto');
    const templatesEl = document.getElementById('templates');

    // Photo upload handler
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoDataUrl = e.target.result;
                photoPreview.src = photoDataUrl;
                photoPreview.style.display = 'block';
                noPhoto.style.display = 'none';
                localStorage.setItem('resume_photo', photoDataUrl);
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved photo
    if (photoDataUrl) {
        photoPreview.src = photoDataUrl;
        photoPreview.style.display = 'block';
        noPhoto.style.display = 'none';
    }

    // Form input handler
    form.addEventListener('input', updatePreview);

    // Button handlers
    document.getElementById('saveBtn').onclick = saveProfile;
    document.getElementById('loadBtn').onclick = loadProfile;
    document.getElementById('clearBtn').onclick = clearForm;
    document.getElementById('downloadBtn').onclick = handleDownload;
    document.getElementById('closeModal').onclick = () => document.getElementById('paymentModal').classList.add('hidden');

    // Template population
    TEMPLATES.forEach((template, index) => {
        const btn = document.createElement('button');
        btn.className = `w-full p-6 rounded-2xl bg-gradient-to-br ${template.class} text-left shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:shadow-purple-500/25 transition-all duration-300 border-4 border-white/50 relative overflow-hidden group`;
        btn.innerHTML = `
            <div class="font-bold text-xl mb-2 group-hover:text-white transition-colors">${template.name}</div>
            <div class="text-sm opacity-90">${template.sections.length} Sections</div>
            <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-orange-500/20 scale-0 group-hover:scale-100 transition-transform origin-center duration-500 opacity-0 group-hover:opacity-100"></div>
        `;
        btn.onclick = () => switchTemplate(template.id);
        templatesEl.appendChild(btn);
    });

    function switchTemplate(id) {
        currentTemplate = id;
        document.querySelectorAll('#templates button').forEach(btn => btn.classList.remove('ring-4', 'ring-white/50', 'shadow-2xl', 'scale-105'));
        event.target.closest('button').classList.add('ring-4', 'ring-white/50', 'shadow-2xl', 'scale-105');
        updatePreview();
    }

    function getFormData() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.photo = photoDataUrl;
        data.template = currentTemplate;
        return data;
    }

    function updatePreview() {
        const data = getFormData();
        const template = TEMPLATES.find(t => t.id === currentTemplate);
        preview.innerHTML = `
            <div class="relative p-10 ${template.class} min-h-full rounded-2xl shadow-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm">
                ${data.photo ? `<img src="${data.photo}" class="passport-photo absolute -top-20 right-8 w-28 h-36 rounded-2xl object-cover border-6 border-white shadow-2xl z-20 ring-4 ring-white/50" loading="lazy">` : ''}
                <div class="relative z-10 pt-4">
                    <h1 class="text-4xl font-black text-gray-900 mb-4 leading-tight break-words" data-field="name">${data.name || 'Your Name'}</h1>
                    <div class="flex flex-wrap gap-4 mb-10 text-xl text-gray-700" data-field="contact">
                        ${data.email ? `<span class="flex items-center"><svg class="w-5 h-5 mr-2" fill="currentColor">📧</svg>${data.email}</span>` : ''}
                        ${data.phone ? `<span class="flex items-center"><svg class="w-5 h-5 mr-2" fill="currentColor">📱</svg>${data.phone}</span>` : ''}
                    </div>
                    
                    <div class="space-y-8">
                        ${data.experience ? `
                            <section class="section">
                                <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4 border-orange-400/50">💼 Professional Experience</h2>
                                <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">${data.experience.replace(/\n/g, '<br>')}</div>
                            </section>
                        ` : ''}
                        
                        ${data.skills ? `
                            <section class="section">
                                <h2 class="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-4 border-emerald-400/50">⭐ Key Skills</h2>
                                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    ${data.skills.split(',').map(skill => skill.trim()).filter(Boolean).map(skill => `
                                        <span class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">${skill}</span>
                                    `).join('')}
                                </div>
                            </section>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    function saveProfile() {
        const data = getFormData();
        localStorage.setItem('resume_data', JSON.stringify(data));
        localStorage.setItem('resume_photo', photoDataUrl);
        localStorage.setItem('resume_template', currentTemplate);
        alert('✅ Resume saved successfully! Data + Photo stored.');
    }

    function loadProfile() {
        try {
            const data = JSON.parse(localStorage.getItem('resume_data') || '{}');
            if (Object.keys(data).length) {
                // Load form data
                Object.entries(data).forEach(([key, value]) => {
                    const el = form.querySelector(`[name="${key}"]`);
                    if (el && key !== 'photo' && key !== 'template') el.value = value;
                });
                
                // Load photo
                if (data.photo) {
                    photoDataUrl = data.photo;
                    photoPreview.src = photoDataUrl;
                    photoPreview.style.display = 'block';
                    noPhoto.style.display = 'none';
                    localStorage.setItem('resume_photo', photoDataUrl);
                }
                
                // Load template
                const savedTemplate = data.template || localStorage.getItem('resume_template') || 'modern';
                switchTemplate(savedTemplate);
                
                updatePreview();
                alert('✅ Resume loaded with photo & data!');
                return;
            }
            alert('No saved resume found.');
        } catch (e) {
            alert('Error loading resume. Starting fresh.');
        }
    }

    function clearForm() {
        if (confirm('🧹 Clear ALL data? (form, photo, saves, payments)')) {
            form.reset();
            localStorage.clear();
            photoDataUrl = '';
            isPaid = false;
            currentTemplate = 'modern';
            photoPreview.style.display = 'none';
            noPhoto.style.display = 'block';
            switchTemplate('modern');
            updatePreview();
            document.querySelectorAll('#templates button').forEach(btn => btn.classList.remove('ring-4', 'ring-white/50'));
            alert('✅ Everything cleared! Fresh start.');
        }
    }

    async function handleDownload() {
        if (!isPaid) {
            document.getElementById('paymentModal').classList.remove('hidden');
            generateUPIQR();
            return;
        }
        generatePDF();
    }

function generateUPIQR() {
    const qrContainer = document.getElementById('upiQR');
    qrContainer.innerHTML = `
        <img src="upi_1773630452988.png" alt="UPI QR - Scan to Pay ₹49" class="w-full h-full rounded-xl object-contain shadow-md">
    `;
}

    async function generatePDF() {
        preview.style.borderStyle = 'solid'; // Fix for html2canvas
        const canvas = await html2canvas(preview, { 
            scale: 3, 
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            width: preview.scrollWidth,
            height: preview.scrollHeight
        });
        preview.style.borderStyle = 'dashed'; // Restore
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let positionY = 0;

        pdf.addImage(imgData, 'PNG', 0, positionY, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
        
        while (heightLeft >= 0) {
            positionY = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, positionY, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save(`Resume-${getFormData().name || 'Professional'}-${new Date().toISOString().slice(0,10)}.pdf`);
        alert('✅ Professional PDF downloaded with photo!');
    }

    // Modal handlers
    const paymentModal = document.getElementById('paymentModal');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class' && !paymentModal.classList.contains('hidden')) {
                generateUPIQR();
            }
        });
    });
    observer.observe(paymentModal, { attributes: true });

    document.getElementById('confirmPaidBtn').onclick = () => {
        localStorage.setItem('resume_paid', 'true');
        isPaid = true;
        paymentModal.classList.add('hidden');
        generatePDF();
    };

    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) paymentModal.classList.add('hidden');
    });

    // Load initial state
    updatePreview();
    
    // Check URL param for payment success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('paid') === 'true') {
        isPaid = true;
        localStorage.setItem('resume_paid', 'true');
        history.replaceState(null, null, window.location.pathname);
    }

    console.log('🚀 Professional Resume Builder v2.0 loaded perfectly!');
});
