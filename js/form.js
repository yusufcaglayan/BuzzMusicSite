const form = document.querySelector('#contactForm');
        const statusMessage = document.getElementById('statusMessage');
        const sendBtn = document.getElementById('sendBtn');

        // Form gönderme olayını dinle
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

            // Düğme durumunu güncelle
            sendBtn.disabled = true;
            sendBtn.textContent = 'Sending...';

            // Form verilerini URL formatına çevir
            const formData = new FormData(form);
            const urlEncodedData = new URLSearchParams(formData).toString();

            try {
                // Fetch API ile POST isteği gönder
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // Doğru içerik tipi
                    },
                    body: urlEncodedData,
                });

                if (response.ok) {
                    // Başarılı durum
                    statusMessage.textContent = 'Message sent successfully!';
                    statusMessage.style.color = 'green';
                } else {
                    // Sunucudan başarısız yanıt
                    statusMessage.textContent = 'Failed to send message.';
                    statusMessage.style.color = 'red';
                }
            } catch (error) {
                // Ağ veya diğer hatalar
                statusMessage.textContent = 'An error occurred.';
                statusMessage.style.color = 'red';
            } finally {
                // Düğmeyi aktif hale getir, formu sıfırla
                sendBtn.disabled = false;
                sendBtn.textContent = 'Send Message';
                form.reset();
            }
        });