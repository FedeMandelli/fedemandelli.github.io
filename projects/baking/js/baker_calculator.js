const MODES = {
  "pizza-poolish": {
    isPizza: true,
    hasPoolish: true,
    mainIngredients: ["flour", "water", "salt", "oil"],
    defaults: {
      hydration: 60,
      pizzaCount: 3,
      singleWeight: 280,
      percentages: {
        salt: 2,
        oil: 2,
      },
      poolish: {
        flourShare: 33,
        yeast: 1,
        honey: 1,
      },
    },
  },
  "pizza-starter": {
    isPizza: true,
    hasPoolish: false,
    mainIngredients: ["flour", "water", "starter", "honey", "salt", "oil"],
    defaults: {
      hydration: 60,
      pizzaCount: 4,
      singleWeight: 260,
      percentages: {
        starter: 33,
        honey: 1,
        salt: 2,
        oil: 2,
      },
    },
  },
  focaccia: {
    isPizza: false,
    hasPoolish: false,
    mainIngredients: ["flour", "water", "yeast", "honey", "salt", "oil"],
    defaults: {
      hydration: 60,
      totalWeight: 1200,
      percentages: {
        yeast: 1,
        honey: 1,
        salt: 2,
        oil: 2,
      },
    },
  },
  bread: {
    isPizza: false,
    hasPoolish: false,
    mainIngredients: ["flour", "water", "yeast", "salt", "oil"],
    defaults: {
      hydration: 60,
      totalWeight: 1200,
      percentages: {
        yeast: 1,
        salt: 2,
        oil: 2,
      },
    },
  },
};

const I18N = {
  en: {
    title: "Baking Calculator",
    subtitle: "Change mode and percentages to recalculate.",
    mode: "Mode",
    hydration: "Hydration %",
    pizzas: "Number of Pizzas",
    singleWeight: "Single Dough Weight (g)",
    totalWeight: "Total Dough Weight (g)",
    mainDough: "Main Dough",
    poolish: "Poolish",
    ingredient: "Ingredient",
    percent: "%",
    grams: "Grams",
    resetMode: "Reset Mode",
    consistencyOk: "Total matches target",
    consistencyWarn: "Total differs from target",
    lightMode: "Light",
    darkMode: "Dark",
    modeNames: {
      "pizza-poolish": "Pizza (Poolish)",
      "pizza-starter": "Pizza (Starter)",
      focaccia: "Focaccia",
      bread: "Bread",
    },
    ingredients: {
      flour: "Flour",
      water: "Water",
      yeast: "Yeast",
      starter: "Starter",
      honey: "Honey",
      salt: "Salt",
      oil: "Oil",
      poolishFlourShare: "Poolish Flour Share",
    },
  },
  it: {
    title: "Calcolatore Impasti",
    subtitle: "Cambia modalita e percentuali per ricalcolare.",
    mode: "Modalita",
    hydration: "Idratazione %",
    pizzas: "Numero Pizze",
    singleWeight: "Peso Singolo Impasto (g)",
    totalWeight: "Peso Totale Impasto (g)",
    mainDough: "Impasto Principale",
    poolish: "Poolish",
    ingredient: "Ingrediente",
    percent: "%",
    grams: "Grammi",
    resetMode: "Reset Modalita",
    consistencyOk: "Totale coerente con obiettivo",
    consistencyWarn: "Totale diverso dall'obiettivo",
    lightMode: "Chiaro",
    darkMode: "Scuro",
    modeNames: {
      "pizza-poolish": "Pizza (Poolish)",
      "pizza-starter": "Pizza (Lievito Madre)",
      focaccia: "Focaccia",
      bread: "Pane",
    },
    ingredients: {
      flour: "Farina",
      water: "Acqua",
      yeast: "Lievito",
      starter: "Lievito Madre",
      honey: "Miele",
      salt: "Sale",
      oil: "Olio",
      poolishFlourShare: "Quota Farina Poolish",
    },
  },
};

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function detectLanguage() {
  const locale = (navigator.language || "en").toLowerCase();
  return locale.startsWith("it") ? "it" : "en";
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function supportsSelectionRange(control) {
  if (!control) {
    return false;
  }

  // Number inputs do not reliably support selection ranges across browsers.
  if (control.tagName === "INPUT" && control.type === "number") {
    return false;
  }

  return (
    typeof control.selectionStart === "number" &&
    typeof control.selectionEnd === "number" &&
    typeof control.setSelectionRange === "function"
  );
}

function buildDefaultState(modeKey) {
  const mode = MODES[modeKey];
  const defaults = mode.defaults;

  return {
    hydration: defaults.hydration,
    pizzaCount: defaults.pizzaCount || 1,
    singleWeight: defaults.singleWeight || 250,
    totalWeight: defaults.totalWeight || 1000,
    percentages: deepClone(defaults.percentages || {}),
    poolish: deepClone(defaults.poolish || {}),
  };
}

class BakingCalculator extends HTMLElement {
  constructor() {
    super();
    this.currentMode = "pizza-poolish";
    this.language = detectLanguage();
    this.theme = "dark";
    this.modeState = {};
    Object.keys(MODES).forEach((modeKey) => {
      this.modeState[modeKey] = buildDefaultState(modeKey);
    });
  }

  connectedCallback() {
    this.addEventListener("input", (event) => this.handleInput(event));
    this.addEventListener("change", (event) => this.handleChange(event));
    this.addEventListener("click", (event) => this.handleClick(event));
    this.render();
  }

  disconnectedCallback() {
    document.body.classList.remove("is-light", "is-dark");
  }

  handleInput(event) {
    const target = event.target;
    const state = this.modeState[this.currentMode];

    if (target.id === "hydration_input") {
      state.hydration = clamp(Number(target.value), 0, 100);
      if (MODES[this.currentMode].hasPoolish && state.poolish.flourShare > state.hydration) {
        state.poolish.flourShare = state.hydration;
      }
      this.render({ preserveFocus: true });
      return;
    }

    if (target.id === "pizza_count_input") {
      const parsed = Math.trunc(Number(target.value));
      state.pizzaCount = Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
      this.render({ preserveFocus: true });
      return;
    }

    if (target.id === "single_weight_input") {
      state.singleWeight = Math.max(1, Number(target.value) || 1);
      this.render({ preserveFocus: true });
      return;
    }

    if (target.id === "total_weight_input") {
      state.totalWeight = Math.max(1, Number(target.value) || 1);
      this.render({ preserveFocus: true });
      return;
    }

    const ingredientKey = target.dataset.mainPct;
    if (ingredientKey) {
      state.percentages[ingredientKey] = clamp(Number(target.value), 0, 100);
      this.render({ preserveFocus: true });
      return;
    }

    const poolishKey = target.dataset.poolishPct;
    if (poolishKey) {
      const nextValue = clamp(Number(target.value), 0, 100);
      if (poolishKey === "flourShare") {
        state.poolish.flourShare = Math.min(nextValue, state.hydration);
      } else {
        state.poolish[poolishKey] = nextValue;
      }
      this.render({ preserveFocus: true });
    }
  }

  handleChange(event) {
    const target = event.target;
    if (target.id === "mode_selector") {
      this.currentMode = target.value;
      this.render();
      return;
    }

    if (target.id === "pizza_count_input") {
      // Reinforce integer-only requirement on blur/change.
      const state = this.modeState[this.currentMode];
      state.pizzaCount = Math.max(1, Math.trunc(state.pizzaCount));
      this.render();
    }
  }

  handleClick(event) {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const { id } = button;

    if (id === "lang_en") {
      this.language = "en";
      this.render();
      return;
    }

    if (id === "lang_it") {
      this.language = "it";
      this.render();
      return;
    }

    if (id === "reset_mode") {
      this.modeState[this.currentMode] = buildDefaultState(this.currentMode);
      this.render();
      return;
    }

    if (id === "theme_toggle") {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.render();
    }
  }

  applyPageTheme() {
    const body = document.body;
    if (!body || !body.classList.contains("baking-page")) {
      return;
    }

    body.classList.remove("is-light", "is-dark");
    body.classList.add(this.theme === "light" ? "is-light" : "is-dark");
  }

  getTotalWeight(mode, state) {
    if (mode.isPizza) {
      return state.pizzaCount * state.singleWeight;
    }

    return state.totalWeight;
  }

  compute(modeKey, state) {
    const mode = MODES[modeKey];
    const hydrationPct = state.hydration;
    const hydrationFactor = hydrationPct / 100;
    const totalWeight = this.getTotalWeight(mode, state);

    let additionalPct = 0;
    if (mode.hasPoolish) {
      additionalPct += state.percentages.salt || 0;
      additionalPct += state.percentages.oil || 0;
      additionalPct += state.poolish.yeast || 0;
      additionalPct += state.poolish.honey || 0;
    } else {
      mode.mainIngredients.forEach((ingredient) => {
        if (ingredient === "flour" || ingredient === "water") {
          return;
        }
        additionalPct += state.percentages[ingredient] || 0;
      });
    }

    const divisor = 1 + hydrationFactor + additionalPct / 100;
    const totalFlour = divisor > 0 ? totalWeight / divisor : 0;
    const totalWater = totalFlour * hydrationFactor;

    const mainGrams = {};
    const mainPctDisplay = {};
    const poolishGrams = {};
    const poolishPctDisplay = {};

    if (mode.hasPoolish) {
      const poolishFlourSharePct = Math.min(state.poolish.flourShare || 0, hydrationPct);
      const poolishFlour = totalFlour * (poolishFlourSharePct / 100);
      const poolishWater = poolishFlour;
      const poolishYeast = totalFlour * ((state.poolish.yeast || 0) / 100);
      const poolishHoney = totalFlour * ((state.poolish.honey || 0) / 100);

      poolishGrams.flour = poolishFlour;
      poolishGrams.water = poolishWater;
      poolishGrams.yeast = poolishYeast;
      poolishGrams.honey = poolishHoney;

      poolishPctDisplay.flourShare = poolishFlourSharePct;
      poolishPctDisplay.yeast = state.poolish.yeast || 0;
      poolishPctDisplay.honey = state.poolish.honey || 0;

      mainGrams.flour = Math.max(0, totalFlour - poolishFlour);
      mainGrams.water = Math.max(0, totalWater - poolishWater);
      mainGrams.salt = totalFlour * ((state.percentages.salt || 0) / 100);
      mainGrams.oil = totalFlour * ((state.percentages.oil || 0) / 100);

      mainPctDisplay.flour = 100;
      mainPctDisplay.water = totalFlour > 0 ? (mainGrams.water / totalFlour) * 100 : 0;
      mainPctDisplay.salt = state.percentages.salt || 0;
      mainPctDisplay.oil = state.percentages.oil || 0;
    } else {
      mode.mainIngredients.forEach((ingredient) => {
        if (ingredient === "flour") {
          mainGrams.flour = totalFlour;
          mainPctDisplay.flour = 100;
          return;
        }

        if (ingredient === "water") {
          mainGrams.water = totalWater;
          mainPctDisplay.water = hydrationPct;
          return;
        }

        const pct = state.percentages[ingredient] || 0;
        mainGrams[ingredient] = totalFlour * (pct / 100);
        mainPctDisplay[ingredient] = pct;
      });
    }

    const computedTotal =
      Object.values(mainGrams).reduce((sum, value) => sum + value, 0) +
      Object.values(poolishGrams).reduce((sum, value) => sum + value, 0);

    return {
      totalWeight,
      computedTotal,
      mainGrams,
      mainPctDisplay,
      poolishGrams,
      poolishPctDisplay,
    };
  }

  renderMainRows(mode, result, text) {
    return mode.mainIngredients
      .map((ingredient) => {
        const pct = result.mainPctDisplay[ingredient] ?? 0;
        const grams = result.mainGrams[ingredient] ?? 0;

        let pctCell = "";
        if (ingredient === "flour") {
          pctCell = `<input type="number" value="${round1(pct)}" inputmode="decimal" disabled>`;
        } else if (ingredient === "water") {
          pctCell = `<input type="number" value="${round1(pct)}" inputmode="decimal" disabled>`;
        } else {
          pctCell = `<input type="number" data-main-pct="${ingredient}" value="${round1(pct)}" min="0" max="100" step="0.1" inputmode="decimal">`;
        }

        return `
          <tr>
            <td>${text.ingredients[ingredient]}</td>
            <td>${pctCell}</td>
            <td><input type="number" value="${round1(grams)}" disabled></td>
          </tr>
        `;
      })
      .join("");
  }

  renderPoolishRows(result, text) {
    return `
      <tr>
        <td>${text.ingredients.poolishFlourShare}</td>
          <td><input type="number" data-poolish-pct="flourShare" value="${round1(result.poolishPctDisplay.flourShare || 0)}" min="0" max="100" step="0.1" inputmode="decimal"></td>
          <td><input type="number" value="${round1(result.poolishGrams.flour || 0)}" inputmode="decimal" disabled></td>
      </tr>
      <tr>
        <td>${text.ingredients.water}</td>
        <td class="pct-disabled">-</td>
          <td><input type="number" value="${round1(result.poolishGrams.water || 0)}" inputmode="decimal" disabled></td>
      </tr>
      <tr>
        <td>${text.ingredients.yeast}</td>
          <td><input type="number" data-poolish-pct="yeast" value="${round1(result.poolishPctDisplay.yeast || 0)}" min="0" max="100" step="0.1" inputmode="decimal"></td>
          <td><input type="number" value="${round1(result.poolishGrams.yeast || 0)}" inputmode="decimal" disabled></td>
      </tr>
      <tr>
        <td>${text.ingredients.honey}</td>
          <td><input type="number" data-poolish-pct="honey" value="${round1(result.poolishPctDisplay.honey || 0)}" min="0" max="100" step="0.1" inputmode="decimal"></td>
          <td><input type="number" value="${round1(result.poolishGrams.honey || 0)}" inputmode="decimal" disabled></td>
      </tr>
    `;
  }

  captureFocusedControl() {
    const active = this.querySelector("input:focus, select:focus, textarea:focus");
    if (!active) {
      return null;
    }

    let selector = "";
    if (active.id) {
      selector = `#${active.id}`;
    } else if (active.dataset.mainPct) {
      selector = `input[data-main-pct=\"${active.dataset.mainPct}\"]`;
    } else if (active.dataset.poolishPct) {
      selector = `input[data-poolish-pct=\"${active.dataset.poolishPct}\"]`;
    }

    if (!selector) {
      return null;
    }

    const focusState = { selector };
    if (supportsSelectionRange(active)) {
      focusState.selectionStart = active.selectionStart;
      focusState.selectionEnd = active.selectionEnd;
    }

    return focusState;
  }

  restoreFocusedControl(focusState) {
    if (!focusState || !focusState.selector) {
      return;
    }

    const nextControl = this.querySelector(focusState.selector);
    if (!nextControl || typeof nextControl.focus !== "function") {
      return;
    }

    nextControl.focus({ preventScroll: true });

    if (
      typeof focusState.selectionStart === "number" &&
      typeof focusState.selectionEnd === "number" &&
      supportsSelectionRange(nextControl)
    ) {
      try {
        nextControl.setSelectionRange(focusState.selectionStart, focusState.selectionEnd);
      } catch (error) {
        // Ignore browsers that restrict cursor APIs in specific field types.
      }
      return;
    }

    if (nextControl.tagName === "INPUT" && nextControl.type === "number") {
      // Force numeric inputs to keep the caret at the end after rerender.
      const current = nextControl.value;
      nextControl.value = "";
      nextControl.value = current;
    }
  }

  render(options = {}) {
    const focusState = options.preserveFocus ? this.captureFocusedControl() : null;
    const mode = MODES[this.currentMode];
    const state = this.modeState[this.currentMode];
    const text = I18N[this.language];

    const result = this.compute(this.currentMode, state);

    const targetWeight = result.totalWeight;
    const totalDifference = Math.abs(result.computedTotal - targetWeight);
    const isConsistent = totalDifference <= 0.2;

    const modeOptions = Object.keys(MODES)
      .map((modeKey) => {
        const selected = modeKey === this.currentMode ? "selected" : "";
        return `<option value="${modeKey}" ${selected}>${text.modeNames[modeKey]}</option>`;
      })
      .join("");

    const pizzaControls = mode.isPizza
      ? `
        <div class="settings-grid">
          <label>
            <span>${text.pizzas}</span>
            <input id="pizza_count_input" type="number" min="1" step="1" value="${state.pizzaCount}" inputmode="numeric">
          </label>
          <label>
            <span>${text.singleWeight}</span>
            <input id="single_weight_input" type="number" min="1" step="1" value="${state.singleWeight}" inputmode="decimal">
          </label>
          <label>
            <span>${text.totalWeight}</span>
            <input id="total_weight_display" type="number" value="${round1(result.totalWeight)}" inputmode="decimal" disabled>
          </label>
        </div>
      `
      : `
        <div class="settings-grid">
          <label>
            <span>${text.totalWeight}</span>
            <input id="total_weight_input" type="number" min="1" step="1" value="${state.totalWeight}" inputmode="decimal">
          </label>
        </div>
      `;

    const poolishSection = mode.hasPoolish
      ? `
        <section class="table-section mt-1">
          <h2>${text.poolish}</h2>
          <table class="baker-table">
            <thead>
              <tr>
                <th>${text.ingredient}</th>
                <th>${text.percent}</th>
                <th>${text.grams}</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderPoolishRows(result, text)}
            </tbody>
          </table>
        </section>
      `
      : "";

    this.applyPageTheme();

    this.innerHTML = `
      <section class="baking-calculator ${this.theme === "light" ? "is-light" : "is-dark"}">
        <div class="calculator-head">
          <div class="title-block">
            <h1>${text.title}</h1>
            <p>${text.subtitle}</p>
          </div>
          <div class="top-controls">
            <div class="language" role="group" aria-label="Language">
              <button id="lang_en" type="button" class="${this.language === "en" ? "selected" : ""}">ENG</button>
              <button id="lang_it" type="button" class="${this.language === "it" ? "selected" : ""}">ITA</button>
            </div>
            <button
              id="theme_toggle"
              type="button"
              class="theme-toggle"
              aria-pressed="${this.theme === "light" ? "true" : "false"}"
              aria-label="${this.theme === "dark" ? text.lightMode : text.darkMode}"
              title="${this.theme === "dark" ? text.lightMode : text.darkMode}"
            >
              <span class="material-symbols-rounded" aria-hidden="true">${this.theme === "dark" ? "light_mode" : "dark_mode"}</span>
            </button>
          </div>
        </div>

        <div class="calculator-controls">
          <div class="settings-stack">
            <label>
              <span>${text.mode}</span>
              <select id="mode_selector">${modeOptions}</select>
            </label>
            <button id="reset_mode" class="button-inverted" type="button">${text.resetMode}</button>
            <label>
              <span>${text.hydration}</span>
              <input id="hydration_input" type="number" min="0" max="100" step="0.1" value="${round1(state.hydration)}" inputmode="decimal">
            </label>
          </div>
          ${pizzaControls}
        </div>

        ${poolishSection}

        <section class="table-section mt-1">
          <h2>${text.mainDough}</h2>
          <table class="baker-table">
            <thead>
              <tr>
                <th>${text.ingredient}</th>
                <th>${text.percent}</th>
                <th>${text.grams}</th>
              </tr>
            </thead>
            <tbody>
              ${this.renderMainRows(mode, result, text)}
              <tr>
                <td><strong>${text.totalWeight}</strong></td>
                <td></td>
                  <td><input type="number" value="${round1(result.computedTotal)}" inputmode="decimal" disabled></td>
              </tr>
              <tr>
                <td colspan="3" class="table-feedback">
                  <span class="consistency-badge ${isConsistent ? "is-ok" : "is-warn"}">${isConsistent ? text.consistencyOk : text.consistencyWarn}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

      </section>
    `;

    if (focusState) {
      requestAnimationFrame(() => {
        this.restoreFocusedControl(focusState);
      });
    }
  }
}

window.customElements.define("baking-calculator", BakingCalculator);
