const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function addAdmin() {
    const adminUser = {
        username: 'guringan',
        password: '123',  // Ganti dengan password yang lebih aman
        role: 'admin'
    };

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminUser.password, salt);

        // SQL query untuk insert admin
        const query = `
            INSERT INTO users (username, password, role) 
            VALUES (?, ?, ?)
        `;

        db.query(query, [adminUser.username, hashedPassword, adminUser.role], (err, result) => {
            if (err) {
                console.error('Error adding admin:', err);
                process.exit(1);
            }
            
            console.log('Admin user created successfully!');
            console.log('Username:', adminUser.username);
            console.log('Password:', adminUser.password);
            process.exit(0);
        });

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Jalankan fungsi
addAdmin();