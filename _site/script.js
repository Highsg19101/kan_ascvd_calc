function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function calculate() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = '';

  const sex = document.querySelector('input[name="sex"]:checked');
  const smk = document.querySelector('input[name="smk"]:checked');
  const diabetes = document.querySelector('input[name="diabetes"]:checked');
  const htn = document.querySelector('input[name="htn"]:checked');

  const age = parseFloat(document.getElementById('age').value);
  const sysbp = parseFloat(document.getElementById('sysbp').value);
  const totchole = parseFloat(document.getElementById('totchole').value);
  const hdlchole = parseFloat(document.getElementById('hdlchole').value);
  const egfr = parseFloat(document.getElementById('egfr').value);
  const bmi = parseFloat(document.getElementById('bmi').value);
  const diabp = parseFloat(document.getElementById('diabp').value);
  const urn = parseFloat(document.getElementById('urn').value);
  const trigle = parseFloat(document.getElementById('tg').value);

  if (!sex || !smk || !diabetes || !htn ||
      isNaN(age) || isNaN(sysbp) || isNaN(totchole) || isNaN(hdlchole)) {
    resultDiv.innerText = 'Please fill in all required fields.';
    return;
  }

  if (age < 30 || age > 90) {
    resultDiv.innerText = 'Age must be between 30 and 90.';
    return;
  }
  if (sysbp < 70 || sysbp > 250) {
    resultDiv.innerText = 'Systolic BP must be between 70 and 250.';
    return;
  }
  if (totchole < 100 || totchole > 400) {
    resultDiv.innerText = 'Total cholesterol must be between 100 and 400.';
    return;
  }
  if (hdlchole < 20 || hdlchole > 100) {
    resultDiv.innerText = 'HDL cholesterol must be between 20 and 100.';
    return;
  }

  let probability;

  const allExtendedValid =
    [egfr, bmi, diabp, urn, trigle].every(v => !isNaN(v) && v !== '');

  if (allExtendedValid) {
    const rawInputs = [
      parseInt(sex.value),
      age,
      bmi,
      sysbp,
      hdlchole,
      totchole,
      parseInt(smk.value),
      parseInt(diabetes.value),
      parseInt(htn.value),
      diabp,
      urn,
      trigle
    ];

    const mean = [
      0.480280366, 49.0348909, 23.7309415, 122.140566, 54.8286979, 197.062236,
      0.248699749, 0.0445660082, 0.152473624, 76.2602938, 1.0740369, 129.949204,
    ];

    const std = [
      0.499610985, 11.7321466, 3.17300708, 15.1446709, 13.1677701, 34.8879031,
      0.432259394, 0.206348926, 0.35947937, 10.2100931, 0.388243555, 84.4015889
    ];

    const standardized = rawInputs.map((val, idx) => (val - mean[idx]) / std[idx]);

    const total = KAN_extended_calculateProductValues(standardized);
    probability = sigmoid(total);
    probability = total

  } else {
    const processedInputs = {
      sex: { value: (parseInt(sex.value) - 0.478792756) / 0.49955005 },
      smk: { value: (parseInt(smk.value) - 0.248758871) / 0.43229376 },
      diabetes: { value: (parseInt(diabetes.value) - 0.0447910796) / 0.20684496 },
      htn: { value: (parseInt(htn.value) - 0.151642779) / 0.35867429 },
      age: (age - 48.9631428) / 11.75261791,
      sysbp: (sysbp - 122.130344) / 15.16975104,
      totchole: (totchole - 196.948423) / 35.16616376,
      hdlchole: (hdlchole - 54.811952) / 13.21906134
    };

    const total = KAN_primary_calculateTotalValues(processedInputs);
    const norm_sysbp = (sysbp - 122.130344) / 15.16975104;
    const output = total -
      0.280593149897676 * Math.sin(0.235199987888336 * norm_sysbp - 4.36079978942871) -
      0.075206885949077;

    probability = sigmoid(output);
  }

  resultDiv.innerText = `Your risk score is: ${probability.toFixed(5)}`;
}

function KAN_primary_calculateTotalValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole }) {
  return (
    -0.0376021126265017 * sex.value +
    0.0586096531114941 * smk.value +
    0.0417301166736492 * diabetes.value +
    0.0323796856521712 * htn.value +
    0.192240776006961 * age +
    -0.00876516648515659 * sysbp +
    0.0125540217138686 * totchole +
    -0.0326289992319081 * hdlchole
  );
}

// 표준화된 값이 배열로 들어오도록 변경
function KAN_extended_calculateProductValues(stdValues) {
    const [
    sex,       // stdValues[0]
    age,       // stdValues[1]
    bmi,       // stdValues[2]
    sysbp,     // stdValues[3]
    hdlchole,  // stdValues[4]
    totchole,  // stdValues[5]
    smk,       // stdValues[6]
    dm,        // stdValues[7]
    htn,       // stdValues[8]
    diabp,     // stdValues[9]
    urn,     // stdValues[10]
    trigle
  ] = stdValues;

  const total =
    -0.0376021126265017 * sex +
    0.0586096531114941 * smk +
    0.0417301166736492 * dm +
    0.0323796856521712 * htn +
    0.192240776006961  * age +
    -0.00876516648515659 * sysbp +
    0.0125540217138686 * totchole +
    -0.0326289992319081 * hdlchole +
    0.027 * bmi +            // 예: BMI 가중치
    -0.013 * diabp +          // 예: DIA BP 가중치
    0.045 * urn +             // 예: Urine Protein 가중치
    0.1 * trigle;
  return (total)
}