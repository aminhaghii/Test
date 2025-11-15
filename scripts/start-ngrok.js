// Script to start ngrok tunnel for local development
import { spawn } from 'child_process';
import { networkInterfaces } from 'os';
import { join } from 'path';
import { homedir } from 'os';

const PORT = process.argv[2] || '8080';

console.log('\n🚀 Starting ngrok tunnel...\n');
console.log(`📍 Port: ${PORT}`);
console.log('⏳ Please wait...\n');

// Find ngrok executable
function findNgrok() {
  const possiblePaths = [
    'ngrok', // If in PATH
    'ngrok.cmd', // Windows cmd
    join(homedir(), 'AppData', 'Roaming', 'npm', 'ngrok.cmd'), // npm global Windows
    join(homedir(), 'AppData', 'Local', 'Microsoft', 'WindowsApps', 'ngrok.exe'), // Windows Store
    'C:\\ngrok\\ngrok.exe', // Common install location
  ];
  
  // Try to find ngrok in PATH first
  for (const ngrokPath of possiblePaths) {
    try {
      // Just return the path, let spawn handle it with shell: true
      return ngrokPath;
    } catch (e) {
      continue;
    }
  }
  
  return 'ngrok'; // Fallback
}

const ngrokPath = findNgrok();

// Check if port is running
const netstat = spawn('netstat', ['-ano'], { shell: true });

netstat.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes(`:${PORT}`)) {
    console.log('✅ Port is running\n');
  }
});

netstat.on('close', () => {
  // Start ngrok with shell: true so Windows can find it
  const ngrok = spawn(ngrokPath, ['http', PORT], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PATH: process.env.PATH + ';' + join(homedir(), 'AppData', 'Roaming', 'npm')
    }
  });

  ngrok.on('error', (error) => {
    if (error.code === 'ENOENT') {
      console.error('\n❌ ngrok is not installed!\n');
      console.log('📦 Install ngrok:');
      console.log('   1. Download from https://ngrok.com/download');
      console.log('   2. Or: npm install -g ngrok');
      console.log('   3. Or: choco install ngrok\n');
      console.log('🔑 Then add your authtoken:');
      console.log('   ngrok config add-authtoken YOUR_TOKEN\n');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  });

  ngrok.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ ngrok exited with code ${code}`);
      console.log('\n💡 Make sure:');
      console.log('   1. ngrok is installed');
      console.log('   2. You have added your authtoken: ngrok config add-authtoken YOUR_TOKEN');
      console.log('   3. Port', PORT, 'is running (npm run dev)\n');
    }
  });
});

