document.getElementById('translateBtn').addEventListener('click', async () => {
  const text = document.getElementById('inputText').value;
  const sourceLang = document.getElementById('sourceLang').value;
  const targetLang = document.getElementById('targetLang').value;
  const model = document.getElementById('model').value;

  const res = await fetch('http://localhost:3000/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, sourceLang, targetLang, model })
  });

  const data = await res.json();
  document.getElementById('outputText').textContent = data.translated || 'Error al traducir';
});
