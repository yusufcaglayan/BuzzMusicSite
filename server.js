const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Formdan veri alacak route
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    // Gelen bilgileri kontrol et
    if (!name || !email || !message) {
        return res.status(400).send('Tüm alanları doldurun.');
    }

    try {
        // Nodemailer ayarları
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Alternatif olarak başka bir SMTP servisi de kullanabilirsin
            auth: {
                user: 'buzzmusicsup@gmail.com', // Kendi Gmail adresin
                pass: '123456789Ah31!'         // Gmail şifren veya uygulama şifren (Gmail'de 2FA varsa app password kullan)
            }
        });

        const mailOptions = {
            from: 'buzzmusicsup@gmail.com', // Kullanıcıdan gelen mail
            to: 'buzzmusicsup@gmail.com',   // Bu senin e-postan, mesaj buraya gelecek
            subject: `Yeni Mesaj - ${name}`, // Konu kısmı
            text: `Ad: ${name}\nEmail: ${email}\nMesaj: ${message}` // Mesaj içeriği
        };

        // Mail gönderme işlemi
        const info = await transporter.sendMail(mailOptions);

        console.log('E-posta gönderildi: ' + info.response);
        res.status(200).send('Mesajınız başarıyla gönderildi!');
    } catch (error) {
        console.error('E-posta gönderilirken bir hata oluştu:', error);
        res.status(500).send('E-posta gönderilirken bir hata oluştu.');
    }
});

// Sunucuyu başlat
app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor.');
});
