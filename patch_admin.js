
const fs = require('fs');
let content = fs.readFileSync('admin.html', 'utf8');

const settingsHTML = `
        <!-- ⚙️ VIEW 3: PIXELS & INTEGRATIONS -->
        <div id="settings-view" style="display: none;">
            <div class="mb-6">
                <h2 class="text-2xl font-black text-white glow-text mb-2">Pixels & Tracking Integrations</h2>
                <p class="text-gray-400 text-sm">Manage your Facebook, TikTok, and Snapchat pixels and Conversions API tokens securely.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <!-- Facebook Pixel 1 -->
                <div class="glass-card p-6 border-t-2 border-blue-500 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 text-9xl text-blue-500/5"><i class="fa-brands fa-meta"></i></div>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 text-xl">
                            <i class="fa-brands fa-facebook-f"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white">Facebook Main Pixel</h3>
                    </div>
                    <div class="space-y-4 relative z-10">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                            <input type="text" id="fb_pixel_1" placeholder="e.g. 1234567890" class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none en-font">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Conversions API Token (CAPI)</label>
                            <input type="password" id="fb_token_1" placeholder="EAAOUictp..." class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none en-font">
                        </div>
                    </div>
                </div>

                <!-- Facebook Pixel 2 (Backup) -->
                <div class="glass-card p-6 border-t-2 border-indigo-500 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 text-9xl text-indigo-500/5"><i class="fa-brands fa-meta"></i></div>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xl">
                            <i class="fa-brands fa-facebook-f"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white">Facebook Backup Pixel (Optional)</h3>
                    </div>
                    <div class="space-y-4 relative z-10">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Backup Pixel ID</label>
                            <input type="text" id="fb_pixel_2" placeholder="e.g. 0987654321" class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-indigo-500 outline-none en-font">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Backup CAPI Token</label>
                            <input type="password" id="fb_token_2" placeholder="EAAOUictp..." class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-indigo-500 outline-none en-font">
                        </div>
                    </div>
                </div>

                <!-- TikTok Pixel -->
                <div class="glass-card p-6 border-t-2 border-black/50 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 text-9xl text-white/5"><i class="fa-brands fa-tiktok"></i></div>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white text-xl">
                            <i class="fa-brands fa-tiktok"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white">TikTok Pixel</h3>
                    </div>
                    <div class="space-y-4 relative z-10">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                            <input type="text" id="tiktok_pixel" placeholder="e.g. CD54321" class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-white outline-none en-font">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Events API Token</label>
                            <input type="password" id="tiktok_token" placeholder="e.g. 5d12345..." class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-white outline-none en-font">
                        </div>
                    </div>
                </div>

                <!-- Snapchat Pixel -->
                <div class="glass-card p-6 border-t-2 border-yellow-400 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 text-9xl text-yellow-400/5"><i class="fa-brands fa-snapchat"></i></div>
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400 text-xl">
                            <i class="fa-brands fa-snapchat"></i>
                        </div>
                        <h3 class="text-xl font-bold text-white">Snapchat Pixel</h3>
                    </div>
                    <div class="space-y-4 relative z-10">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                            <input type="text" id="snapchat_pixel" placeholder="e.g. abcd-1234" class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none en-font">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-400 mb-1">CAPI Token</label>
                            <input type="password" id="snapchat_token" placeholder="e.g. eyJhbG..." class="w-full bg-gray-900/80 border border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none en-font">
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-4">
                <button onclick="savePixels()" class="btn-gold px-8 py-4 rounded-xl font-black text-lg flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                    <i class="fa-solid fa-floppy-disk"></i> Save All Integrations
                </button>
            </div>
        </div>
`;

// Insert settings view before closing app-container if not exists
if (!content.includes('id="settings-view"')) {
    content = content.replace('    </div>\r\n\r\n    <!-- Scripts -->', settingsHTML + '\n    </div>\n\n    <!-- Scripts -->');
    content = content.replace('    </div>\n\n    <!-- Scripts -->', settingsHTML + '\n    </div>\n\n    <!-- Scripts -->');
}

// Add JS for settings
const settingsJS = `
        // Setup admin tab switching
        function switchAdminTab(tabName) {
            document.getElementById('stats-view').style.display = tabName === 'stats' ? 'block' : 'none';
            document.getElementById('orders-view').style.display = tabName === 'orders' ? 'block' : 'none';
            const settingsView = document.getElementById('settings-view');
            if (settingsView) settingsView.style.display = tabName === 'settings' ? 'block' : 'none';
            
            // UI Updates
            const tabs = ['stats', 'orders', 'settings'];
            tabs.forEach(t => {
                const btn = document.getElementById('tab-' + t + '-btn');
                if(!btn) return;
                if (t === tabName) {
                    btn.classList.remove('text-gray-300', 'hover:bg-gray-800/80', 'hover:text-white');
                    btn.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-amber-500', 'text-black', 'shadow-[0_0_25px_rgba(255,215,0,0.35)]');
                } else {
                    btn.classList.add('text-gray-300', 'hover:bg-gray-800/80', 'hover:text-white');
                    btn.classList.remove('bg-gradient-to-r', 'from-yellow-500', 'to-amber-500', 'text-black', 'shadow-[0_0_25px_rgba(255,215,0,0.35)]');
                }
            });

            if (tabName === 'settings') {
                loadPixels();
            }
        }

        async function loadPixels() {
            try {
                const res = await fetch('/api/settings?admin=true');
                const data = await res.json();
                if (data.success && data.settings) {
                    const ids = ['fb_pixel_1', 'fb_token_1', 'fb_pixel_2', 'fb_token_2', 'tiktok_pixel', 'tiktok_token', 'snapchat_pixel', 'snapchat_token'];
                    ids.forEach(id => {
                        const el = document.getElementById(id);
                        if (el && data.settings[id]) {
                            el.value = data.settings[id];
                        }
                    });
                    
                    // Handle old keys
                    if (!data.settings.fb_pixel_1 && data.settings.fb_pixel_id) document.getElementById('fb_pixel_1').value = data.settings.fb_pixel_id;
                    if (!data.settings.fb_token_1 && data.settings.fb_access_token) document.getElementById('fb_token_1').value = data.settings.fb_access_token;
                    if (!data.settings.tiktok_pixel && data.settings.tiktok_pixel_id) document.getElementById('tiktok_pixel').value = data.settings.tiktok_pixel_id;
                    if (!data.settings.tiktok_token && data.settings.tiktok_access_token) document.getElementById('tiktok_token').value = data.settings.tiktok_access_token;
                }
            } catch (err) {
                console.error(err);
            }
        }

        async function savePixels() {
            const settings = {};
            const ids = ['fb_pixel_1', 'fb_token_1', 'fb_pixel_2', 'fb_token_2', 'tiktok_pixel', 'tiktok_token', 'snapchat_pixel', 'snapchat_token'];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) settings[id] = el.value.trim();
            });

            // Map old keys to new keys for backwards compatibility in server if needed
            if (settings.fb_pixel_1 && !settings.fb_pixel_id) settings.fb_pixel_id = settings.fb_pixel_1;
            if (settings.fb_token_1 && !settings.fb_access_token) settings.fb_access_token = settings.fb_token_1;
            if (settings.tiktok_pixel && !settings.tiktok_pixel_id) settings.tiktok_pixel_id = settings.tiktok_pixel;
            if (settings.tiktok_token && !settings.tiktok_access_token) settings.tiktok_access_token = settings.tiktok_token;

            try {
                const res = await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings })
                });
                const data = await res.json();
                if (data.success) {
                    alert('✅ Settings saved successfully!');
                } else {
                    alert('❌ Failed to save: ' + data.message);
                }
            } catch (err) {
                alert('❌ Network error saving settings');
            }
        }
`;

if (!content.includes('function loadPixels()')) {
    content = content.replace('function switchAdminTab(tabName) {', '// Replaced switchAdminTab\nfunction switchAdminTabOld(tabName) {');
    content = content.replace('</script>\r\n</body>', settingsJS + '\n</script>\n</body>');
    content = content.replace('</script>\n</body>', settingsJS + '\n</script>\n</body>');
}
fs.writeFileSync('admin.html', content);
fs.writeFileSync('public/admin.html', content);
console.log('admin.html patched');
