require('dotenv').config();
const cf = require('cloudflare')({
    email: process.env.CF_EMAIL,
    key: process.env.CF_KEY
});
const ip = require('public-ip');

setInterval(() => {
    const zones = await cf.zones.browse();
    const zone = zones.result[0].id;
    const records = await cf.dnsRecords.browse(zone);
    const record = records.result.find(r => r.name.startsWith(process.env.CF_DOMAIN));
    record.content = await ip.v4();
    await cf.dnsRecords.edit(zone, record.id, record);
}, process.env.UPDATE_INTERVAL * 3600 * 1000)