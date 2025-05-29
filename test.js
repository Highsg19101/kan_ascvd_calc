function calculate() {
  
  // 라디오 입력값 가져오기
  const sex = 1
  const smk = 1
  const diabetes = 1
  const htn = 1

  // 숫자 입력값 가져오기
  const age = 30
  const sysbp = 120
  const totchole = 200
  const hdlchole = 50
  const egfrInput = ""
  const egfr = NaN
  

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

  let total;
  if (egfrInput.trim() !== '' && !isNaN(egfr)) {
    // egfr까지 있으면 곱셈 방식 사용
    total = KAN_extended_calculateProductValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole, egfr });
  } 
  else {
    // 기본 방식
    const processedInputs = {
    sex: { value: (sex - 0.4788) / 0.4996 },
    smk: { value: (smk - 0.2488 ) / 0.4323 },
    diabetes: { value: (diabetes - 0.0448 ) / 0.2068 },
    htn: { value: (htn - 0.1516) / 0.3587 },
    age: (age - 48.9631) / 11.7526,
    sysbp: (sysbp - 122.1303) / 15.1698,
    totchole: (totchole - 196.9484) / 35.1662,
    hdlchole: (hdlchole - 54.8119) / 13.2191
    };

    console.log("Scaled Inputs:", processedInputs);

    total = KAN_primary_calculateTotalValues(processedInputs);
    console.log("Results:", total)
  }

}

function KAN_primary_calculateTotalValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole }) {
  return (
    sex.value +
    smk.value +
    diabetes.value +
    htn.value +
    age + sysbp + totchole + hdlchole
  );
}


function KAN_extended_calculateProductValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole, egfr }) {
  return (
    (parseInt(sex.value) + 1) *
    (parseInt(smk.value) + 1) *
    (parseInt(diabetes.value) + 1) *
    (parseInt(htn.value) + 1) *
    (age + 1) *
    (sysbp + 1) *
    (totchole + 1) *
    (hdlchole + 1) *
    (egfr + 1)
  );
}

calculate();