fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test3@test.com', password: 'password' })
}).then(async r => {
  console.log(r.status);
  console.log(await r.text());
});
