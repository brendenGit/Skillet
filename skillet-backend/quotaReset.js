const cron = require('node-cron');
const db = require('./db');


// run at midnight every day
cron.schedule('0 0 * * *', async () => {
    try {
        const result = await db.query('UPDATE quota_usage SET usage = 0 WHERE id = 1 RETURNING usage;');
        console.log(`Daily API usage count reset. Reset to: ${result.rows[0].usage}`);
    } catch (error) {
        console.error('Error reseting daily quota usage:', error);
    }
});
