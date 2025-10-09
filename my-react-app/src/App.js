import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  
  return (
    <div style={{ textAlign: 'center', margin: '50px' }}>
      
      {/* Container utama, hanya untuk TUGAS 1 */}
      <div style={{ border: '1px solid #ccc', padding: '20px' }}>
        <h2>Aplikasi Sapaan React Sederhana</h2>
        
        {/* Elemen input untuk menerima nama */}
        <input
          type="text"
          placeholder="Masukkan nama Anda..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px', fontSize: '16px', marginBottom: '15px' }}
        />
        
        {/* Pesan selamat datang dinamis: "Hello, [nama]!" */}
        <h1 style={{ color: 'blue' }}>Hello, {name || 'Nama Anda'}!</h1>
      </div>

    </div>
  );
}

export default App;
