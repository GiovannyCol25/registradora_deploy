export async function loginUser(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials),
      credentials: "include" // <-- solo si usas cookies/sesión; puedes quitarlo si solo usas JWT
    });
  
    if (!response.ok) {
      const errorText = await response.text(); // ayuda a debuguear
      throw new Error(`Login inválido: ${errorText}`);
    }
  
    const data = await response.json();
    return data; // { token: "..." }
  }
  