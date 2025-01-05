const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // fs modülünü dahil edin

const app = express();
const PORT = 5500;

// Middleware
app.use(cors()); // CORS politikalarını çözmek için
app.use(bodyParser.urlencoded({ extended: true })); // Form verilerinin işlenmesi için
app.use(bodyParser.json());
app.use(express.static('public'));

// POST Route for Contact Form
app.post('/send-mail', (req, res) => {
    const { name, email, company, message } = req.body;

    // Eksik alanları kontrol et
    if (!name || !email || !company || !message) {
        return res.status(400).send('Tüm alanlar doldurulmalıdır.');
    }

    // jsons/auth.json dosyasını okuyun
    fs.readFile('jsons/auth.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Auth dosyası okunurken hata oluştu:', err);
            return res.status(500).send('Auth bilgileri okunurken hata oluştu.');
        }

        // JSON verisini parse ederek kullanıcı bilgilerini al
        const authData = JSON.parse(data);

        // SMTP Ayarları
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Gmail kullanıyorsan bu doğru
            auth: {
                user: jsons/authData.user, // JSON dosyasından alınan kullanıcı adı
                pass: jsons/authData.pass  // JSON dosyasından alınan şifre
            }
        });

        const mailOptions = {
            from: email, // Kullanıcının e-postası
            to: 'buzzmusicsup@gmail.com', // E-postanın gönderileceği adres
            subject: `Yeni İletişim Formu: ${name}`,
            text: `Ad: ${name}\nE-posta: ${email}\nŞirket: ${company}\nMesaj: ${message}`
        };

        // E-posta Gönderimi
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('E-posta gönderilirken hata oluştu:', error);
                res.status(500).send(`E-posta gönderilirken bir hata oluştu: ${error.message}`);
            } else {
                console.log('E-posta gönderildi:', info.response);
                res.status(200).send('E-posta başarıyla gönderildi.');
            }
        });
    });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
