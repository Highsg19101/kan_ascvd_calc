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
  const egfrInput = document.getElementById('egfr').value;
  const egfr = parseFloat(egfrInput);

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
    total = KAN_extended_calculateProductValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole, egfr });
    probability = sigmoid(total);
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
    (-0.0376021126265017) * sex.value +
    (0.0586096531114941) * smk.value +
    (0.0417301166736492) * diabetes.value +
    (0.0323796856521712) * htn.value +
    (0.192240776006961) * age + 
    (-0.00876516648515659) * sysbp + 
    (0.0125540217138686) * totchole + 
    (-0.0326289992319081) * hdlchole
  );
}

function KAN_extended_calculateProductValues({ sex, smk, diabetes, htn, age, sysbp, totchole, hdlchole, 
                                               egfr  }) {
  return (
    sex.value *
    smk.value *
    diabetes.value *
    htn.value *
    (age + 1) *
    (sysbp + 1) *
    (totchole + 1) *
    (hdlchole + 1) *
    (egfr + 1)
  );
}