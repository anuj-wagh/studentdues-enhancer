function injectFont() {
  if (document.getElementById("swd-font-link")) return;

  const link = document.createElement("link");
  link.id = "swd-font-link";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap";
  document.head.appendChild(link);
}

function transformDuesHeader() {
  const duesHeader = document.querySelector("h2");
  if (!duesHeader) return;
  if (!duesHeader.textContent.includes("DUES FOR")) return;
  const label = duesHeader.querySelector("#Label1");
  if (!label) return;
  duesHeader.textContent = "DUES FOR " + label.textContent.trim();
  label.remove();
}

function transformDepositsTable() {
  const tableBody = document.querySelector("#depositsGridView > tbody");

  if (!tableBody) return;

  tableBody.querySelectorAll("tr").forEach((row) => {
    if (row.querySelector("th")) return;
    const amountCell = row.cells[1];
    if (!amountCell) return;
    const rawNumber = amountCell.textContent;
    if (!rawNumber) return;

    const formatted = Number(rawNumber).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    amountCell.textContent = formatted;
  });
}

function transformArrearsTable1() {
  const arrearDiv = document.querySelector("#arrearGridView");
  if (!arrearDiv) return;
  arrearDiv.parentElement.style.overflow = "auto";
  const table = document.querySelector("#arrearGridView");
  if (!table) return;

  const headerMap = {
    "M/YYYY": "Month / Year",
    "OPNBAL*": "Opening Balance",
    "MESS*": "Mess Charges",
    "ELEC*": "Electricity Charges",
    "OTHER*": "Other Dues",
    DEPOSIT: "Deposit",
    "WTHDAL*": "Withdrawal",
    "CLSBAL*": "Closing Balance",
  };

  Array.from(table.querySelectorAll("th")).forEach((th) => {
    const key = th.textContent.trim();
    if (headerMap[key]) th.textContent = headerMap[key];
  });

  const formatINR = (n) =>
    n.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  table.querySelectorAll("tbody tr").forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (!cells.length) return;

    cells.forEach((td, idx) => {
      if (idx === 0) return;

      const raw = td.textContent;
      if (!raw) return;

      const num = Number(raw);
      if (isNaN(num)) return;

      td.textContent = formatINR(num);
      td.style.textAlign = "right";
    });
  });
}

function fillArrearsNotes() {
  arrearText1 = document.querySelector("#arrearLegendsLbl");
  if (!arrearText1) return;
  arrearText1.remove();
  arrearText2 = document.querySelector("#arrearFF");
  if (!arrearText2) return;
  arrearText2.remove();
  const note = document.querySelector("#Notelbl");
  if (!note) return;
  note.textContent =
    "Note: If the Closing Balance of the last row in the above table is negative, it indicates that you have dues to be paid for that specific amount. If it is positive, it indicates that you have a credit balance (which will be adjusted in your fees).";

  const old = document.getElementById("splituplbl");
  if (!old) return;

  if (!document.getElementById("swd-contact-style")) {
    const css = `
      .swd-contact-card{
        max-width:504px;margin:0 auto;padding:16px 20px;
        background:#fff;border:1px solid #004000;border-radius:8px;
        color:#004000;font:15px/1.4 "Segoe UI",Roboto,sans-serif;
      }
      .swd-contact-card h3{margin-top:0;text-align:center;font-size:16px}
      .swd-contact-card h4{margin:12px 0 4px;font-size:14px}
      .swd-contact-card ul{margin:0;padding:0;list-style:none}
      .swd-contact-card li+li{margin-top:12px}
      .swd-contact-card a{color:#0b8dff;font-weight:500;text-decoration:none}
      .swd-contact-card a:hover{text-decoration:underline}
      .swd-contact-card .cc-note{display:block;font-size:13px;font-style:italic;margin-top:2px}
    `;
    const style = Object.assign(document.createElement("style"), {
      id: "swd-contact-style",
      textContent: css,
    });
    document.head.appendChild(style);
  }

  const wrapper = document.createElement("div");
  wrapper.className = "swd-contact-card";
  wrapper.id = "splituplbl";

  wrapper.innerHTML = `
    <h3>For Any Issues Regarding Your Dues</h3>

    <ul>
      <li>
        <h4>Relating to the Students' Union (SU)</h4>
        <p>
          Email: &nbsp;
          <a href="mailto:gensec@pilani.bits-pilani.ac.in">gensec@pilani.bits-pilani.ac.in</a>
          &nbsp;or&nbsp;
          <a href="mailto:president@pilani.bits-pilani.ac.in">president@pilani.bits-pilani.ac.in</a>
          <span class="cc-note">
            CC:&nbsp;<a href="mailto:crc@pilani.bits-pilani.ac.in">crc@pilani.bits-pilani.ac.in</a>
          </span>
        </p>
      </li>

      <li>
        <h4>Relating to the Sports Council (BOSM and Sports Clubs)</h4>
        <p>
          Email: &nbsp;
          <a href="mailto:sfc@pilani.bits-pilani.ac.in">sfc@pilani.bits-pilani.ac.in</a>
        </p>
      </li>
      <li>
        <p>
          Please feel free to ping me on <a href="mailto:f20230207@pilani.bits-pilani.ac.in">my email</a> to keep me in the loop for anything else.
        </p>
      </li>
    </ul>
  `;
  old.replaceWith(wrapper);
}

function arrearsBreakdownBeautify() {
  const origTable = document.getElementById("UnionSplitupGridView");
  if (!origTable) return;

  const MONTH = {
    JAN: "January",
    FEB: "February",
    MAR: "March",
    MARCH: "March",
    APR: "April",
    APRIL: "April",
    MAY: "May",
    JUN: "June",
    JUNE: "June",
    JUL: "July",
    JULY: "July",
    AUG: "August",
    SEP: "September",
    SEPT: "September",
    OCT: "October",
    NOV: "November",
    DEC: "December",
    DE: "December",
  };
  const EATERY = {
    FM: "Food Ministry",
    JH: "Jawed Habib",
  };
  const STATIC_LABELS = {
    RECNO: "Rec No",
    IDNO: "BITS ID",
    SNAME: "Student Name",
  };

  function prettify(raw) {
    if (STATIC_LABELS[raw]) return STATIC_LABELS[raw];

    const parts = raw.split("_");
    const yrIdx = parts.findIndex((p) => /^\d{2,4}$/.test(p));
    if (yrIdx > 0) {
      const yearTok = parts[yrIdx];
      const monthTok = parts[yrIdx - 1];
      const monthFull = MONTH[monthTok];
      if (monthFull) {
        const yearFull = yearTok.length === 2 ? `20${yearTok}` : yearTok;
        const eateryTok = parts.slice(0, yrIdx - 1).join("_");
        const eateryFull = EATERY[eateryTok] || eateryTok.replace(/_/g, " ");
        return `${eateryFull} ${monthFull} ${yearFull}`;
      }
    }

    return raw.replace(/_/g, " ").replace("CHG", "").replace("ARR", "").trim();
  }

  const headers = Array.from(
    origTable.querySelectorAll("tr:first-child th")
  ).map((th) => th.textContent.trim());

  const container = document.createElement("div");
  container.className = "swd-vertical-wrapper swd-show-only-charged";

  Array.from(origTable.querySelectorAll("tr:not(:first-child)")).forEach(
    (row) => {
      const values = Array.from(row.querySelectorAll("td"));
      const vTable = document.createElement("table");
      vTable.className = "swd-v-table";
      const tbody = document.createElement("tbody");

      let rowTotal = 0;

      headers.forEach((head, i) => {
        const tr = document.createElement("tr");

        const th = document.createElement("th");
        th.textContent = prettify(head);

        const td = document.createElement("td");
        const rawVal = values[i]?.textContent.trim() ?? "";
        const numVal = Number(rawVal.replace(/[^\d.-]/g, ""));

        const isStatic = i < 3;
        if (!isStatic && !isNaN(numVal)) {
          rowTotal += numVal;
          td.textContent = numVal.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        } else {
          td.textContent = rawVal;
        }

        if (!isStatic && !numVal) tr.classList.add("is-zero");
        tr.append(th, td);
        tbody.appendChild(tr);
      });

      const totalTr = document.createElement("tr");
      totalTr.className = "total-row";
      const totalTh = document.createElement("th");
      totalTh.textContent = "Sum Total";
      const totalTd = document.createElement("td");
      totalTd.textContent = rowTotal.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      totalTd.style.fontWeight = "bold";
      totalTr.append(totalTh, totalTd);

      tbody.insertBefore(totalTr, tbody.children[3] || null);

      vTable.appendChild(tbody);
      container.appendChild(vTable);
    }
  );

  const tabs = document.createElement("div");
  tabs.className = "swd-tab-wrapper";

  const btnCharged = document.createElement("button");
  btnCharged.type = "button";
  btnCharged.textContent = "Charged Only";
  btnCharged.className = "active";

  const btnAll = document.createElement("button");
  btnAll.type = "button";
  btnAll.textContent = "All";

  tabs.append(btnCharged, btnAll);

  btnCharged.onclick = () => {
    container.classList.add("swd-show-only-charged");
    btnCharged.classList.add("active");
    btnAll.classList.remove("active");
  };
  btnAll.onclick = () => {
    container.classList.remove("swd-show-only-charged");
    btnAll.classList.add("active");
    btnCharged.classList.remove("active");
  };

  if (!document.getElementById("swd-vertical-style")) {
    const style = document.createElement("style");
    style.id = "swd-vertical-style";
    style.textContent = `
      .swd-vertical-wrapper{display:flex;flex-wrap:wrap;gap:24px;padding:12px 0}
      .swd-v-table{min-width:260px;max-width:480px;border-collapse:collapse;
        font:10px/1.4 "Segoe UI",Roboto,sans-serif;background:#fff;
        border:1px solid #999;border-radius:6px;
        box-shadow:0 2px 6px rgb(0 0 0 / 8%)}
      .swd-v-table th,.swd-v-table td{padding:6px 10px;border-bottom:1px solid #f1f3f5;text-align:left;word-break:break-word}
      .swd-v-table th{width:48%;background:#f8f9fa;font-weight:600}
      .swd-v-table tr:last-child th,.swd-v-table tr:last-child td{border-bottom:none}

      .swd-show-only-charged .is-zero{display:none}

      .swd-tab-wrapper{display:inline-flex;gap:8px;margin:12px 0}
      .swd-tab-wrapper button{padding:6px 14px;font:600 15px/1 "Segoe UI",Roboto,sans-serif;
        border:1px solid rgb(44, 62, 80);background:#fff;color:rgb(44, 62, 80);border-radius:4px;cursor:pointer}
      .swd-tab-wrapper button.active,
      .swd-tab-wrapper button:hover{background:rgb(44, 62, 80);color:#fff}
    `;
    document.head.appendChild(style);
  }

  origTable.parentNode.insertBefore(tabs, origTable);
  origTable.parentNode.insertBefore(container, origTable);
  origTable.style.display = "none";
}

function beautifyMessBreakup() {
  const tbl = document.getElementById("messbreakupGridView");
  if (!tbl) return;

  const headerCells = Array.from(tbl.querySelectorAll("tr:first-child th"));
  const moneyCols = new Set();

  headerCells.forEach((th, idx) => {
    const raw = th.textContent.trim();
    let pretty = raw;

    if (raw === "D_CAFE") {
      pretty = "DCC Spending";
      moneyCols.add(idx);
    } else {
      pretty = raw.replace(/_/g, " ");
      if (
        /^(TOTAL_AMOUNT|MESS_BASIC|PITSHOP_EXTRA|FOOD_EXTRA|SUMMER_WINTER_VACATION)$/.test(
          raw
        )
      )
        moneyCols.add(idx);
    }
    th.textContent = pretty;
  });

  Array.from(tbl.querySelectorAll("tr:not(:first-child)")).forEach((tr) => {
    moneyCols.forEach((colIdx) => {
      const td = tr.children[colIdx];
      if (!td) return;

      const num = Number(td.textContent.replace(/[^\d.-]/g, ""));
      if (!isNaN(num)) {
        td.textContent = num.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
      }
    });
  });

  const matrix = Array.from(tbl.rows, (row) =>
    Array.from(row.cells, (c) => c.cloneNode(true))
  );
  const colNames = headerCells.map((th) => th.textContent.trim());
  const nameToIdx = Object.fromEntries(colNames.map((n, i) => [n, i]));
  const rowCount = matrix.length;

  const monthCol = nameToIdx["MONTH"];
  let rowOrder = [0];
  if (monthCol != null) {
    const dataRows = Array.from({ length: rowCount - 1 }, (_, i) => i + 1);
    dataRows.sort(
      (a, b) =>
        Number(matrix[a][monthCol].textContent.trim()) -
        Number(matrix[b][monthCol].textContent.trim())
    );
    rowOrder = rowOrder.concat(dataRows);
  } else {
    rowOrder = Array.from({ length: rowCount }, (_, i) => i);
  }

  const topPriority = ["RECNO", "MONTH", "YR"];
  const bottomPriority = ["TOTAL AMOUNT"];

  const orderedNames = topPriority
    .concat(
      colNames.filter(
        (n) => !topPriority.includes(n) && !bottomPriority.includes(n)
      )
    )
    .concat(bottomPriority);

  const frag = document.createDocumentFragment();

  orderedNames.forEach((name) => {
    const cIdx = nameToIdx[name];
    if (cIdx == null) return;

    const newRow = document.createElement("tr");

    rowOrder.forEach((r, rIdx) => {
      const src = matrix[r][cIdx];
      const cellTag = rIdx === 0 ? "th" : "td";
      const cell = document.createElement(cellTag);

      if (rIdx === 0) cell.scope = "row";
      cell.textContent = src.textContent;

      if (name === "MONTH" && rIdx > 0) {
        const m = Number(src.textContent.trim()) || 0;
        cell.textContent =
          [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][m] || src.textContent;
      }

      if (name === "TOTAL AMOUNT" && rIdx > 0) {
        cell.style.cssText = `color: green!important;`;
      }

      newRow.appendChild(cell);
    });

    frag.appendChild(newRow);
  });

  tbl.innerHTML = "";
  tbl.appendChild(frag);
}

document.body.classList.add("swd-enhanced");

const observer = new MutationObserver(() => {
  if (!document.body.classList.contains("swd-enhanced")) {
    document.body.classList.add("swd-enhanced");
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["class"],
});

console.log(
  "BITS Pilani SWD Dues Page Enhancer By Anuj Wagh loaded successfully!"
);
injectFont();
transformDuesHeader();
transformDepositsTable();
transformArrearsTable1();
fillArrearsNotes();
arrearsBreakdownBeautify();
beautifyMessBreakup();
