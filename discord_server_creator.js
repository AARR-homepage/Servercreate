document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('serverForm');
    const fields = ['token', 'name', 'icon', 'template', 'count', 'delay', 'system_channel_id', 'channels'];

  
    fields.forEach(field => {
        const savedValue = localStorage.getItem(field);
        if (savedValue) {
            document.getElementById(field).value = savedValue;
        }
    });

    
    fields.forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener('input', () => {
            localStorage.setItem(field, input.value);
        });
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const token = document.getElementById('token').value;
        const name = document.getElementById('name').value;
        const icon = document.getElementById('icon').value;
        const template = document.getElementById('template').value;
        const count = parseInt(document.getElementById('count').value, 10);
        const delay = parseInt(document.getElementById('delay').value, 10);
        const systemChannelId = document.getElementById('system_channel_id').value || null;
        const channelsInput = document.getElementById('channels').value;
        let channels = [];

       
        if (channelsInput) {
            try {
                channels = JSON.parse(channelsInput);
                if (!Array.isArray(channels)) {
                    throw new Error("チャンネル情報は配列形式である必要があります。");
                }
            } catch (error) {
                alert(`チャンネル情報が不正です: ${error.message}`);
                return;
            }
        }

        const output = document.getElementById('output');
        output.innerHTML = '';

        for (let i = 0; i < count; i++) {
            try {
                const response = await fetch(`https://discord.com/api/v9/guilds`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        icon: icon || null,
                        guild_template_code: template,
                        system_channel_id: null,
                        channels,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`エラー: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                output.innerHTML += `<p>サーバー作成成功: ${data.name} (ID: ${data.id})</p>`;
            } catch (error) {
                output.innerHTML += `<p>サーバー作成失敗: ${error.message}</p>`;
            }

            if (i < count - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    });
});
