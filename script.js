// ================= INPUTS =================
const aInput = document.getElementById("a");
const bInput = document.getElementById("b");
const minInput = document.getElementById("min");
const container = document.getElementById("results");

// ================= LOAD MIN =================
document.addEventListener("DOMContentLoaded", () => {
  const savedMin = localStorage.getItem("MIN_VALUE");
  if (savedMin) minInput.value = savedMin;
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

  // 🔥 works 1000 to 1M+
  const end = min + 1000000;

  for (let n1 = min; n1 <= end; n1++) {
    let r1 = A * n1;

    let n2 = Math.round(r1 / B);
    if (n2 < min) n2 = min;

    let r2 = B * n2;
    let sum = n1 + n2;

    let profitLoss = r1 - sum;      // signed
    let loss = Math.abs(r1 - r2);   // team lose

    // priority:
    // 1 loss near 0
    // 2 profit/loss near 0
    if (
      !best ||
      loss < best.loss ||
      (
        loss === best.loss &&
        Math.abs(profitLoss) < Math.abs(best.profitLoss)
      )
    ) {
      best = { n1, n2, r1, r2, profitLoss, loss };
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

  const dynamicMax = Math.max(d.n1 * 2, min + 5000);

  container.innerHTML = `
    <div class="card best">

      <div class="row big">
        <span>${A} × <input id="n1" type="number" value="${d.n1}"></span>
        <span id="r1">${d.r1.toFixed(2)}</span>
      </div>

      <div class="slider-btn-wrap">
        <button id="minusBtn" type="button">-</button>

        <div class="slider">
          <input id="s1" type="range"
            min="${min}"
            max="${dynamicMax}"
            step="1"
            value="${d.n1}">
        </div>

        <button id="plusBtn" type="button">+</button>
      </div>

      <div class="row big">
        <span>${B} × <input id="n2" type="number" value="${d.n2}" readonly></span>
        <span id="r2">${d.r2.toFixed(2)}</span>
      </div>

      <div class="gaps">
        <div class="row">
          <span>If Team A Lose</span>
          <span id="g1">${d.loss.toFixed(2)}</span>
        </div>

        <div class="row">
          <span>Profit / Loss</span>
          <span id="g2" class="highlight">${d.profitLoss.toFixed(2)}</span>
        </div>
        <div style="text-align:center;">
<span style="color:red;">[A negative value indicates loss, while a positive value indicates profit.]</span>
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
  const plusBtn = document.getElementById("plusBtn");
  const minusBtn = document.getElementById("minusBtn");

  const min = parseInt(minInput.value);

  // slider exact old behavior
  s1.oninput = () => {
    n1.value = s1.value;
    update(n1.value, n2.value);
  };

  // manual input
  n1.oninput = () => {
    let value = parseInt(n1.value);

    if (isNaN(value) || value < min) value = min;

    n1.value = value;
    s1.value = value;
    s1.max = Math.max(value * 2, min + 10000);

    update(value, n2.value);
  };

  // +20 profit/loss
  plusBtn.onclick = () => changeProfitLoss(20);

  // -20 profit/loss
  minusBtn.onclick = () => changeProfitLoss(-20);

  function changeProfitLoss(target) {
    let current = parseInt(n1.value);
    let base = parseFloat(document.getElementById("g2").innerText);
    let tries = 0;

    while (tries < 1000) {
      tries++;

      current += target > 0 ? 1 : -1;
      if (current < min) current = min;

      let A = parseFloat(aInput.value);
      let now = (A * current) - (current + parseInt(n2.value));

      if (
        (target > 0 && now >= base + 20) ||
        (target < 0 && now <= base - 20)
      ) {
        n1.value = current;
        s1.value = current;
        update(current, n2.value);
        return;
      }
    }
  }
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

  let profitLoss = r1 - sum;
  let loss = Math.abs(r1 - r2);

  document.getElementById("r1").innerText = r1.toFixed(2);
  document.getElementById("r2").innerText = r2.toFixed(2);
  document.getElementById("g1").innerText = loss.toFixed(2);
  document.getElementById("g2").innerText = profitLoss.toFixed(2);
}