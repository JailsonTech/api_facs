// Função para adicionar números ao display
function appendToDisplay(value) {
    document.getElementById("display").value += value;
  }
  
  // Função para limpar o display
  function clearDisplay() {
    document.getElementById("display").value = '';
  }
  
  // Função para calcular o valor exibido
  function calculate() {
    let display = document.getElementById("display").value;
    try {
      // Avalia a expressão matemática no display
      document.getElementById("display").value = eval(display);
    } catch (e) {
      document.getElementById("display").value = 'Erro';
    }
  }
  
  // Função para calcular a raiz quadrada
  function sqrt() {
    let value = document.getElementById("display").value;
    document.getElementById("display").value = Math.sqrt(parseFloat(value));
  }
  
  // Função para calcular o seno
  function sin() {
    let value = document.getElementById("display").value;
    document.getElementById("display").value = Math.sin(toRadians(parseFloat(value)));
  }
  
  // Função para calcular o cosseno
  function cos() {
    let value = document.getElementById("display").value;
    document.getElementById("display").value = Math.cos(toRadians(parseFloat(value)));
  }
  
  // Função para converter de Celsius para Fahrenheit e vice-versa
  function convertTemperature() {
    let value = document.getElementById("display").value;
    let celsius = parseFloat(value);
    
    if (!isNaN(celsius)) {
      // Convertendo Celsius para Fahrenheit
      let fahrenheit = (celsius * 9/5) + 32;
      document.getElementById("display").value = fahrenheit.toFixed(2) + ' °F';
    } else {
      // Convertendo Fahrenheit para Celsius
      let fahrenheit = parseFloat(value);
      if (!isNaN(fahrenheit)) {
        let celsius = (fahrenheit - 32) * 5/9;
        document.getElementById("display").value = celsius.toFixed(2) + ' °C';
      } else {
        document.getElementById("display").value = 'Erro';
      }
    }
  }
  
  // Função auxiliar para converter graus para radianos
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  