const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'change-me';
const REPO_URL = process.env.REPO_URL;
const COMPOSE_FILE = '/docker-compose.yml';

app.use(express.json());

function verifySignature(payload, signature) {
    if (!signature) return false;
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            } else {
                console.log(stdout);
                resolve(stdout);
            }
        });
    });
}

app.post('/webhook', async (req, res) => {
    try {
        const signature = req.headers['x-hub-signature-256'];
        const payload = JSON.stringify(req.body);
        
        if (!verifySignature(payload, signature)) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (req.body.ref === 'refs/heads/main') {
            console.log('🚀 Deployment triggered by push to main');
            
            // Repository in temporäres Verzeichnis klonen
            await executeCommand('rm -rf /tmp/repo');
            await executeCommand(`git clone ${REPO_URL} /tmp/repo`);
            
            // Docker Compose verwenden um Vue App neu zu builden
            await executeCommand(`cd /tmp/repo && docker-compose -f ${COMPOSE_FILE} build vue-app`);
            
            // Vue App Container neu starten
            await executeCommand(`docker-compose -f ${COMPOSE_FILE} up -d vue-app`);
            
            // Alte Images aufräumen
            await executeCommand('docker image prune -f');
            
            console.log('✅ Deployment successful');
            res.status(200).json({ message: 'Deployment successful' });
        } else {
            res.status(200).json({ message: 'Not main branch, ignoring' });
        }
    } catch (error) {
        console.error('Deployment failed:', error);
        res.status(500).json({ error: 'Deployment failed' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🎣 Webhook server running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
});