// ================= INPUTS =================
const aInput = document.getElementById("a");
const bInput = document.getElementById("b");
const minInput = document.getElementById("min");
const container = document.getElementById("results");

// ================= LOAD MIN =================
document.addEventListener("DOMContentLoaded", () => {
  const savedMin = localStorage.getItem("MIN_VALUE");
  if (savedMin) {
    minInput.value = savedMin;
  }
});

// ================= SAVE MIN =================
minInput.addEventListener("input", () => {
  localStorage.setItem("MIN_VALUE", minInput.value);
});

// ================= CALCULATE =================
function calculate() {
  const A = parseFloat(aInput.value);
  const B = parseFloat(bInput.value);
  const min = parseInt(minInput.value);

  if (isNaN(A) || isNaN(B) || isNaN(min)) {
    container.innerHTML = "";
    return;
  }

  let best = null;

  // 🔥 find best initial values
  for (let n1 = min; n1 <= min + 2000; n1++) {
    let r1 = A * n1;
    let n2 = Math.round(r1 / B);

    if (n2 < min) n2 = min;

    let r2 = B * n2;
    let sum = n1 + n2;

    let sumGap = Math.abs(sum - r1);
    let resultGap = Math.abs(r1 - r2);

    if (
      !best ||
      sumGap < best.sumGap ||
      (sumGap === best.sumGap && resultGap < best.resultGap)
    ) {
      best = { n1, n2, r1, r2, sumGap, resultGap };
    }
  }

  if (!best) return;

  render(best);
}

// ================= RENDER =================
function render(d) {
  const A = parseFloat(aInput.value);
  const B = parseFloat(bInput.value);
  const min = parseInt(minInput.value);

  // 🔥 dynamic slider max (NO LIMIT ISSUE)
  const dynamicMax = Math.max(d.n1 * 2, min + 5000);

  container.innerHTML = `
    <div class="card best">

      <div class="row big">
        <span>${A} × <input id="n1" type="number" value="${d.n1}"></span>
        <span id="r1">${d.r1.toFixed(2)}</span>
      </div>

      <div class="slider">
        <input id="s1" type="range" step="1"
          min="${min}" max="${dynamicMax}" value="${d.n1}">
      </div>

      <div class="row big">
        <span>${B} × <input id="n2" type="number" value="${d.n2}" readonly></span>
        <span id="r2">${d.r2.toFixed(2)}</span>
      </div>

      <div class="gaps">
        <div class="row">
          <span>Result Gap</span>
          <span id="g1">${d.resultGap.toFixed(2)}</span>
        </div>

        <div class="row">
          <span>Sum Gap</span>
          <span id="g2" class="highlight">${d.sumGap.toFixed(2)} 🔥</span>
        </div>
      </div>

    </div>
  `;

  bind();
}

// ================= EVENTS =================
function bind() {
  const n1 = document.getElementById("n1");
  const n2 = document.getElementById("n2");
  const s1 = document.getElementById("s1");

  const min = parseInt(minInput.value);

  // 🎯 slider controls num1 ONLY
  s1.oninput = () => {
    n1.value = s1.value;
    update(n1.value, n2.value);
  };

  // 🎯 manual input (UNLIMITED)
  n1.oninput = () => {
    let value = parseInt(n1.value);

    if (isNaN(value) || value < min) value = min;

    n1.value = value;

    // 🔥 expand slider dynamically
    s1.max = Math.max(value * 2, min + 5000);
    s1.value = value;

    update(value, n2.value);
  };
}

// ================= UPDATE =================
function update(n1, n2) {
  n1 = parseInt(n1);
  n2 = parseInt(n2);

  const A = parseFloat(aInput.value);
  const B = parseFloat(bInput.value);
  const min = parseInt(minInput.value);

  if (n1 < min) n1 = min;
  if (n2 < min) n2 = min;

  let r1 = A * n1;
  let r2 = B * n2;
  let sum = n1 + n2;

  document.getElementById("r1").innerText = r1.toFixed(2);
  document.getElementById("r2").innerText = r2.toFixed(2);
  document.getElementById("g1").innerText = Math.abs(r1 - r2).toFixed(2);
  document.getElementById("g2").innerText = Math.abs(sum - r1).toFixed(2);
}