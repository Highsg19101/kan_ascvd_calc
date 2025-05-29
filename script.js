function calculate() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = '';

  // 라디오 입력값 가져오기
  const sex = document.querySelector('input[name="sex"]:checked');
  const smk = document.querySelector('input[name="smk"]:checked');
  const diabetes = document.querySelector('input[name="diabetes"]:checked');
  const htn = document.querySelector('input[name="htn"]:checked');

  // 숫자 입력값 가져오기
  const age = parseFloat(document.getElementById('age').value);
  const sysbp = parseFloat(document.getElementById('sysbp').value);
  const totchole = parseFloat(document.getElementById('totchole').value);
  const hdlchole = parseFloat(document.getElementById('hdlchole').value);

  // 유효성 검사
  if (!sex || !smk || !diabetes || !htn ||
      isNaN(age) || isNaN(sysbp) || isNaN(totchole) || isNaN(hdlchole)) {
    resultDiv.innerText = 'Please fill in all required fields.';
    return;
  }

  if (age < 30 || age > 90) {
    resultDiv.innerText = 'Age must be between 30 and 90.';
    return;
  }

  const total = KANcalculateTotalValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole });

  resultDiv.innerText = `Your total score is: ${total}%`;
}


function KANcalculateTotalValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole }) {
  return (
    parseInt(sex.value) +
    parseInt(smk.value) +
    parseInt(diabetes.value) +
    parseInt(htn.value) +
    age + sysbp + totchole + hdlchole
  );
}