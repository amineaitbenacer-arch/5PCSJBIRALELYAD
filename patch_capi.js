const fs = require('fs');

function patchOrdersApi(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the query part and tracking logic
    // We search for: try { const settingsRes = await pool.query ... catch (capiErr)
    const newTrackingLogic = `
            // Send Server Tracking Events
            try {
                const settingsRes = await pool.query("SELECT * FROM settings;");
                const s = {};
                settingsRes.rows.forEach(row => s[row.key] = row.value);

                // Fallbacks
                const fb1_pixel = s.fb_pixel_1 || s.fb_pixel_id;
                const fb1_token = s.fb_token_1 || s.fb_access_token;
                const fb2_pixel = s.fb_pixel_2;
                const fb2_token = s.fb_token_2;
                const tt_pixel = s.tiktok_pixel || s.tiktok_pixel_id;
                const tt_token = s.tiktok_token || s.tiktok_access_token;
                const snap_pixel = s.snapchat_pixel;
                const snap_token = s.snapchat_token;

                const eventId = \`order_\${clientOrderId || orderId}\`;
                const clientIpAddress = req.headers['x-forwarded-for'] || (req.socket ? req.socket.remoteAddress : undefined);
                const clientUserAgent = req.headers['user-agent'];

                // Facebook Helper
                const sendFBCapi = async (pixel, token) => {
                    if (!pixel || !token) return;
                    const capiPayload = {
                        data: [{
                            event_name: "Purchase",
                            event_time: Math.floor(Date.now() / 1000),
                            event_id: eventId,
                            action_source: "website",
                            user_data: {
                                client_ip_address: clientIpAddress,
                                client_user_agent: clientUserAgent,
                                fn: hashValue(name) ? [hashValue(name)] : undefined,
                                ph: normalizePhone(phone) ? [normalizePhone(phone)] : undefined,
                                ct: hashValue(city) ? [hashValue(city)] : undefined
                            },
                            custom_data: {
                                currency: "MAD",
                                value: price || 249,
                                content_name: offerName || 'AntiChoc Protection'
                            }
                        }]
                    };
                    try {
                        const res = await fetch(\`https://graph.facebook.com/v19.0/\${pixel}/events?access_token=\${token}\`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(capiPayload)
                        });
                        const r = await res.json();
                        console.log(\`✅ FB CAPI (\${pixel}):\`, r);
                    } catch(e) { console.error(\`❌ FB CAPI (\${pixel}) error:\`, e.message); }
                };

                await sendFBCapi(fb1_pixel, fb1_token);
                await sendFBCapi(fb2_pixel, fb2_token);

                // TikTok Events API
                if (tt_pixel && tt_token) {
                    const ttPayload = {
                        event_source: "web",
                        event_source_id: tt_pixel,
                        data: [{
                            event: "CompletePayment",
                            event_time: Math.floor(Date.now() / 1000),
                            event_id: eventId,
                            user: {
                                phone: normalizePhone(phone),
                                ip: clientIpAddress,
                                user_agent: clientUserAgent
                            },
                            properties: {
                                currency: "MAD",
                                value: Number(price) || 249,
                                content_type: "product",
                                contents: [{
                                    content_name: offerName || 'AntiChoc Protection',
                                    price: Number(price) || 249,
                                    quantity: 1
                                }]
                            }
                        }]
                    };
                    try {
                        const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
                            method: 'POST',
                            headers: { 'Access-Token': tt_token, 'Content-Type': 'application/json' },
                            body: JSON.stringify(ttPayload)
                        });
                        const r = await res.json();
                        console.log('✅ TikTok Events API:', r);
                    } catch(e) { console.error('❌ TikTok error:', e.message); }
                }

                // Snapchat CAPI
                if (snap_pixel && snap_token) {
                    const snapPayload = {
                        data: [{
                            pixel_id: snap_pixel,
                            event_type: 'PURCHASE',
                            event_conversion_type: 'WEB',
                            timestamp: Math.floor(Date.now() / 1000),
                            client_dedup_id: eventId,
                            user_data: {
                                client_ip_address: clientIpAddress,
                                client_user_agent: clientUserAgent,
                                hashed_phone_number: normalizePhone(phone)
                            },
                            custom_data: {
                                currency: "MAD",
                                value: Number(price) || 249
                            }
                        }]
                    };
                    try {
                        const res = await fetch('https://tr.snapchat.com/v2/conversion', {
                            method: 'POST',
                            headers: { 'Authorization': \`Bearer \${snap_token}\`, 'Content-Type': 'application/json' },
                            body: JSON.stringify(snapPayload)
                        });
                        const r = await res.json();
                        console.log('✅ Snapchat CAPI:', r);
                    } catch(e) { console.error('❌ Snapchat error:', e.message); }
                }

            } catch (capiErr) {
                console.error('❌ Server tracking processing failed:', capiErr.message);
            }
`;

    // Regex to replace from "// Send Facebook & TikTok Server Tracking Events" down to "} catch (capiErr)"
    const regex = /\/\/\s*Send\s+(?:Facebook|FB).*?Server Tracking Events[\s\S]*?console\.error\('❌ Server tracking processing failed:', capiErr\.message\);\s*\}/ms;
    
    if (content.match(regex)) {
        content = content.replace(regex, newTrackingLogic.trim());
        fs.writeFileSync(filePath, content);
        console.log("Patched", filePath);
    } else {
        // Fallback for slightly different regex for server.js vs api/orders.js
        const regex2 = /\/\/\s*Send\s+(?:Facebook|FB).*?Server Events asynchronously[\s\S]*?console\.error\('❌ Failed to process server tracking logic:', capiError\.message\);\s*\}/ms;
        if (content.match(regex2)) {
            content = content.replace(regex2, newTrackingLogic.trim().replace('capiErr', 'capiError').replace('capiErr.message', 'capiError.message'));
            fs.writeFileSync(filePath, content);
            console.log("Patched", filePath);
        } else {
            console.log("Could not find regex match in", filePath);
        }
    }
}

patchOrdersApi('api/orders.js');
patchOrdersApi('server.js');
