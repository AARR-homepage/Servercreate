document.getElementById('serverForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const token = document.getElementById('token').value;
    const name = document.getElementById('name').value;
    const icon = document.getElementById('icon').value;
    const template = document.getElementById('template').value;
    const count = parseInt(document.getElementById('count').value, 10);
    const delay = parseInt(document.getElementById('delay').value, 10);

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
