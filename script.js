// script.js

function calculateBMI() {
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);

  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    document.getElementById('result').innerText = 'Please enter valid numbers.';
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const bmiRounded = bmi.toFixed(2);

  document.getElementById('result').innerText = `Your BMI is ${bmiRounded}`;
}
