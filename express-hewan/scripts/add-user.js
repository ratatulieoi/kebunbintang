const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function addUser() {
    // Default user data - you can modify these values
    const user = {
        username: 'user1',
        password: 'user123',
        role: 'user'
    };

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Check if user already exists
        db.query('SELECT * FROM users WHERE username = ?', [user.username], (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                process.exit(1);
            }

            if (results.length > 0) {
                console.log('Username already exists!');
                process.exit(0);
            }

            // Insert user if not exists
            const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
            
            db.query(query, [user.username, hashedPassword, user.role], (err, result) => {
                if (err) {
                    console.error('Error adding user:', err);
                    process.exit(1);
                }
                
                console.log('Regular user created successfully!');
                console.log('Username:', user.username);
                console.log('Password:', user.password);
                console.log('Role:', user.role);
                console.log('Please change the password after first login');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

// Run the function
addUser();