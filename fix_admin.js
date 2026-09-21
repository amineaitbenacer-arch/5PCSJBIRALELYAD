const fs = require('fs');
const files = ['admin.html', 'public/admin.html'];

const newPanelHTML = `
            <!-- UNLOCKED SETTINGS PANEL -->
            <div id="pixel-unlocked-panel" style="display: none;" class="glass-card p-6 md:p-8">
                <div class="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-700/50 gap-4">
                    <div>
                        <h2 class="text-2xl md:text-3xl font-black text-white glow-text flex items-center gap-3">
                            <i class="fa-solid fa-sliders text-yellow-500"></i> Pixels & Integrations
                        </h2>
                        <p class="text-sm text-gray-400 mt-1 font-semibold">Manage your tracking pixels and Conversions API tokens securely.</p>
                    </div>
                    <button onclick="lockPixelSettings()" class="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-2 transition">
                        <i class="fa-solid fa-lock text-yellow-500"></i> Lock Settings
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <!-- Facebook Pixel 1 -->
                    <div class="glass-card p-6 border-t-2 border-blue-500 relative overflow-hidden bg-gray-900/50">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 text-xl border border-blue-500/30">
                                <i class="fa-brands fa-facebook"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">Facebook Main Pixel</h3>
                        </div>
                        <div class="space-y-4 relative z-10">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                                <input type="text" id="fb_pixel_1" placeholder="e.g. 1234567890" class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none en-font shadow-inner">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Conversions API Token</label>
                                <input type="password" id="fb_token_1" placeholder="EAAOUictp..." class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-blue-500 outline-none en-font shadow-inner">
                            </div>
                        </div>
                    </div>

                    <!-- Facebook Pixel 2 -->
                    <div class="glass-card p-6 border-t-2 border-indigo-500 relative overflow-hidden bg-gray-900/50">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 text-xl border border-indigo-500/30">
                                <i class="fa-brands fa-facebook"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">Facebook Backup (Optional)</h3>
                        </div>
                        <div class="space-y-4 relative z-10">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                                <input type="text" id="fb_pixel_2" placeholder="e.g. 0987654321" class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-indigo-500 outline-none en-font shadow-inner">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Conversions API Token</label>
                                <input type="password" id="fb_token_2" placeholder="EAAOUictp..." class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-indigo-500 outline-none en-font shadow-inner">
                            </div>
                        </div>
                    </div>

                    <!-- TikTok Pixel -->
                    <div class="glass-card p-6 border-t-2 border-pink-500 relative overflow-hidden bg-gray-900/50">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-lg bg-pink-600/20 flex items-center justify-center text-pink-400 text-xl border border-pink-500/30">
                                <i class="fa-brands fa-tiktok"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">TikTok Pixel</h3>
                        </div>
                        <div class="space-y-4 relative z-10">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                                <input type="text" id="tiktok_pixel" placeholder="e.g. CD54321" class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-pink-500 outline-none en-font shadow-inner">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Events API Token</label>
                                <input type="password" id="tiktok_token" placeholder="e.g. 5d12345..." class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-pink-500 outline-none en-font shadow-inner">
                            </div>
                        </div>
                    </div>

                    <!-- Snapchat Pixel -->
                    <div class="glass-card p-6 border-t-2 border-yellow-400 relative overflow-hidden bg-gray-900/50">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center text-yellow-400 text-xl border border-yellow-400/30">
                                <i class="fa-brands fa-snapchat"></i>
                            </div>
                            <h3 class="text-xl font-bold text-white">Snapchat Pixel</h3>
                        </div>
                        <div class="space-y-4 relative z-10">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">Pixel ID</label>
                                <input type="text" id="snapchat_pixel" placeholder="e.g. abcd-1234" class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none en-font shadow-inner">
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 mb-1">CAPI Token</label>
                                <input type="password" id="snapchat_token" placeholder="e.g. eyJhbG..." class="w-full bg-gray-900 border-2 border-gray-700 text-white rounded-lg px-4 py-3 focus:border-yellow-400 outline-none en-font shadow-inner">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-700/50 flex flex-wrap items-center justify-between gap-4">
                    <button onclick="saveAllSettings()" class="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-8 py-3.5 rounded-xl font-black flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(255,215,0,0.3)] hover:shadow-[0_6px_25px_rgba(255,215,0,0.5)] transition-all text-base">
                        <i class="fa-solid fa-save text-lg"></i> Save All Settings
                    </button>
                    <p id="settings-status" class="text-green-400 font-bold hidden flex items-center gap-2"><i class="fa-solid fa-circle-check text-xl"></i> تم الحفظ بنجاح!</p>
                </div>
            </div>`;

const jsToReplace = `
        async function fetchSettings() {
            try {
                const res = await fetch('/api/settings?admin=true');
                const data = await res.json();
                if (data.success && data.settings) {
                    const s = data.settings;
                    
                    // FB Main
                    document.getElementById('fb_pixel_1').value = s.fb_pixel_1 || s.fb_pixel_id || '';
                    document.getElementById('fb_token_1').value = s.fb_token_1 || s.fb_access_token || '';
                    
                    // FB Backup
                    document.getElementById('fb_pixel_2').value = s.fb_pixel_2 || '';
                    document.getElementById('fb_token_2').value = s.fb_token_2 || '';
                    
                    // TikTok
                    document.getElementById('tiktok_pixel').value = s.tiktok_pixel || s.tiktok_pixel_id || '';
                    document.getElementById('tiktok_token').value = s.tiktok_token || s.tiktok_access_token || '';
                    
                    // Snapchat
                    document.getElementById('snapchat_pixel').value = s.snapchat_pixel || '';
                    document.getElementById('snapchat_token').value = s.snapchat_token || '';
                }
            } catch (err) {
                console.error('Error fetching settings:', err);
            }
        }

        async function saveAllSettings() {
            try {
                const settings = {
                    fb_pixel_1: document.getElementById('fb_pixel_1').value.trim(),
                    fb_token_1: document.getElementById('fb_token_1').value.trim(),
                    fb_pixel_id: document.getElementById('fb_pixel_1').value.trim(), // fallback
                    fb_access_token: document.getElementById('fb_token_1').value.trim(), // fallback
                    
                    fb_pixel_2: document.getElementById('fb_pixel_2').value.trim(),
                    fb_token_2: document.getElementById('fb_token_2').value.trim(),
                    
                    tiktok_pixel: document.getElementById('tiktok_pixel').value.trim(),
                    tiktok_token: document.getElementById('tiktok_token').value.trim(),
                    tiktok_pixel_id: document.getElementById('tiktok_pixel').value.trim(), // fallback
                    tiktok_access_token: document.getElementById('tiktok_token').value.trim(), // fallback
                    
                    snapchat_pixel: document.getElementById('snapchat_pixel').value.trim(),
                    snapchat_token: document.getElementById('snapchat_token').value.trim()
                };

                const res = await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ settings })
                });

                const data = await res.json();
                if (data.success) {
                    const statusEl = document.getElementById('settings-status');
                    statusEl.classList.remove('hidden');
                    setTimeout(() => {
                        statusEl.classList.add('hidden');
                    }, 3000);
                } else {
                    alert("❌ Failed to save settings!");
                }
            } catch (err) {
                console.error(err);
                alert("❌ Error saving settings!");
            }
        }`;

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace HTML
    content = content.replace(/<!-- UNLOCKED SETTINGS PANEL -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m, newPanelHTML + '\n        </div>\n    </div>');
    
    // Replace JS
    content = content.replace(/async function fetchSettings\(\) \{[\s\S]*?\}\s*async function saveSettings\(\) \{[\s\S]*?\}\n        \}/m, jsToReplace);
    
    fs.writeFileSync(file, content);
    console.log("Patched", file);
});
