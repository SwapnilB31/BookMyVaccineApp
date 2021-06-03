```javascript
fetch("https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP",{
    method: "POST", 
    body: JSON.stringify({mobile : 8638308097}), 
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    }
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err))
```
```javascript
Promise {<pending>}
```
```javascript
VM1767:9 {txnId: "bf839578-9543-45a6-8f14-4cfbb472f686"}
```
```javascript
fetch("https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP",{
    method: "POST", 
    body: JSON.stringify({
        txnId: "bf839578-9543-45a6-8f14-4cfbb472f686",
        otp : "e9265d3bf49b61726d31f46c38fa95002416ba970162b0aee8be6d26504b6b40"
    }), 
    headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    }
}).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err))
```
```javascript
Promise {<pending>}
VM1945:12 {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hb…zc3fQ.XBJ09eBsHlzzjWGY6kcuk20x2AaXK5l5myENgWWLpgo"}
```