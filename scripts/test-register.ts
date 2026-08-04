fetch('http://localhost:3000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test3@test.com', password: 'password', name: 'Test', phone: '123' })
}).then(async r => console.log(r.status, await r.text()));
