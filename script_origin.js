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
  
  // extended values
  const egfrInput = document.getElementById('egfr').value;
  const egfr = parseFloat(egfrInput);
  /*
  const bmiInput = document.getElementById('bmi').value;
  const bmi = parseFloat(egfrInput);

  const diabpInput = document.getElementById('diabp').value;
  const daibp = parseFloat(diabpInput);

  const urnInput = document.getElementById('urn').value;
  const urn = parseFloat(urnInput);

  const tgInput = document.getElementById('tg').value;
  const tg = parseFloat(tgInput);

  const hgbInput = document.getElementById('hgb').value;
  const hgb = parseFloat(hgbInput);

  const sgotInput = document.getElementById('sgot').value;
  const sgot = parseFloat(sgotInput);

  const ggtInput = document.getElementById('ggt').value;
  const ggt = parseFloat(ggtInput);

  const fbsInput = document.getElementById('fbs').value;
  const fbs = parseFloat(fbsInput);

  const ldlInput = document.getElementById('ldl').value;
  const ldl = parseFloat(ldlInput);

  const wcInput = document.getElementById('wc').value;
  const wc = parseFloat(wcInput);

  const ctrbInput = document.getElementById('ctrb').value;
  const ctrb = parseFloat(ctrbInput);

  const addrInput = document.getElementById('addr').value;
  const addr = parseFloat(addrInput);*/

  if (!sex || !smk || !diabetes || !htn ||
      isNaN(age) || isNaN(sysbp) || isNaN(totchole) || isNaN(hdlchole)) {
    resultDiv.innerText = 'Please fill in all required fields.';
    return;
  }

  
  if (age < 30 || age > 90) {
    resultDiv.innerText = 'Age must be between 30 and 90.';
    return;
  }
  if ( sysbp< 70 || sysbp > 250) {
    resultDiv.innerText = 'Systolic BP must be between 70 and 250.';
    return;
  }

  if ( totchole < 100 || totchole > 400) {
    resultDiv.innerText = 'Total cholesterol must be between 100 and 400.';
    return;
  }

  if ( hdlchole < 20 || hdlchole > 100) {
    resultDiv.innerText = 'HDL cholesterol must be between 20 and 100.';
    return;
  }

  let total;
  if (egfrInput.trim() !== '' && !isNaN(egfr)) {
    const mean = [
      0.480280366, 49.0348909, 23.7309415, 122.140566, 54.8286979, 197.062236,
      0.248699749, 0.0445660082, 0.152473624, 76.2602938, 1.0740369, 129.949204,
      13.9406372, 25.2752001, 24.8480129, 36.6470278, 97.2694050, 116.353033,
      80.1734237, 87.5367582, 11.7799958, 33423.6189
    ];

    const scale = [
      0.499610985, 11.7321466, 3.17300708, 15.1446709, 13.1677701, 34.8879031,
      0.432259394, 0.206348926, 0.35947937, 10.2100931, 0.388243555, 84.4015889,
      1.62794392, 15.5417393, 21.2544479, 50.1092053, 22.2806327, 31.8954775,
      8.97256848, 20.0091229, 5.76656158, 12982.4184
    ];



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