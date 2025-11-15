// Script to show local IP address for public access
import { networkInterfaces } from 'os';

function getLocalIP() {
  const interfaces = networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({
          interface: name,
          address: iface.address
        });
      }
    }
  }

  return ips;
}

const ips = getLocalIP();

console.log('\n🌐 Local IP Addresses for Public Access:\n');
console.log('═══════════════════════════════════════════════════\n');

if (ips.length === 0) {
  console.log('❌ No network interfaces found');
} else {
  ips.forEach(({ interface: name, address }) => {
    console.log(`📡 ${name}:`);
    console.log(`   Frontend: http://${address}:8080`);
    console.log(`   Backend:  http://${address}:3001`);
    console.log('');
  });
  
  const primaryIP = ips[0].address;
  console.log('═══════════════════════════════════════════════════\n');
  console.log('🚀 Quick Access URLs:\n');
  console.log(`   Frontend: http://${primaryIP}:8080`);
  console.log(`   Backend:  http://${primaryIP}:3001`);
  console.log('\n📱 Use these URLs on mobile devices in the same network\n');
}

