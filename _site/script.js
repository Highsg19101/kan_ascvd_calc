function calculate() {
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  const waistCm = parseFloat(document.getElementById('waist').value);

  const resultDiv = document.getElementById('result');
  resultDiv.innerText = '';  // 초기화

  // 키와 체중이 기본적으로 필요함
  if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
    resultDiv.innerText = 'Please enter valid weight and height.';
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  const bmiRounded = bmi.toFixed(2);

  // 허리 둘레가 없는 경우: BMI만 계산
  if (!waistCm || waistCm <= 0) {
    resultDiv.innerText = `Your BMI is ${bmiRounded}.`;
  } else {
    // BRI 계산
    const waistRatio = (waistCm / (2 * Math.PI)) / (0.5 * heightCm);
    const bri = 364.2 - 365.5 * Math.sqrt(1 - Math.pow(waistRatio, 2));
    const briRounded = bri.toFixed(2);
    resultDiv.innerText = `Your BRI is ${briRounded}.`;
  }
}