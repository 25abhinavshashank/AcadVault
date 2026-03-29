import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

const dnsServers = process.env.DNS_SERVERS
  ?.split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers?.length) {
  dns.setServers(dnsServers);
  console.log(`Using custom DNS servers: ${dnsServers.join(", ")}`);
}
