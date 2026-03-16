const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUT3qtUWoeQZWfZMgZ90qcfLVsIqoXoRrU3bZoYQvAYaSIJTYdxJSqNNRr1QG3Gta57A/exec"
const ADMIN_PASSWORD = "manifest2026"

let allRecords = []

function login() {
  const input = document.getElementById("passwordInput").value
  if (input === ADMIN_PASSWORD) {
    document.getElementById("loginScreen").classList.add("hidden")
    document.getElementById("dashboardScreen").classList.remove("hidden")
    loadData()
  } else {
    document.getElementById("loginError").classList.remove("hidden")
  }
}

function logout() {
  document.getElementById("loginScreen").classList.remove("hidden")
  document.getElementById("dashboardScreen").classList.add("hidden")
  document.getElementById("passwordInput").value = ""
}

function loadData() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        allRecords = data.data
        updateStats()
        populateEventFilter()
        renderTable()
      }
    })
    .catch(err => alert("Failed to load data. Check your connection."))
}

function updateStats() {
  const total = allRecords.length
  const firstTimers = allRecords.filter(r => r["First Time"] === "Yes").length
  const returning = allRecords.filter(r => r["First Time"] === "No").length

  // Find duplicate phones
  const phones = allRecords.map(r => String(r["Phone"]))
  const duplicates = phones.filter((p, i) => phones.indexOf(p) !== i)
  const uniqueDuplicates = [...new Set(duplicates)]

  document.getElementById("totalCount").textContent = total
  document.getElementById("firstTimerCount").textContent = firstTimers
  document.getElementById("returningCount").textContent = returning
  document.getElementById("duplicateCount").textContent = uniqueDuplicates.length
}

function populateEventFilter() {
  const events = [...new Set(allRecords.map(r => r["Event"]).filter(Boolean))]
  const select = document.getElementById("eventFilter")
  select.innerHTML = '<option value="">All Events</option>'
  events.forEach(e => {
    const opt = document.createElement("option")
    opt.value = e
    opt.textContent = e
    select.appendChild(opt)
  })
}

function renderTable() {
  const search = document.getElementById("searchInput").value.toLowerCase()
  const eventFilter = document.getElementById("eventFilter").value

  // Find duplicate phones for highlighting
  const phones = allRecords.map(r => String(r["Phone"]))
  const duplicatePhones = phones.filter((p, i) => phones.indexOf(p) !== i)

  const filtered = allRecords.filter(r => {
    const matchSearch = !search ||
      (r["Name"] && r["Name"].toLowerCase().includes(search)) ||
      (r["Phone"] && String(r["Phone"]).includes(search))
    const matchEvent = !eventFilter || r["Event"] === eventFilter
    return matchSearch && matchEvent
  })

  const tbody = document.getElementById("tableBody")
  tbody.innerHTML = ""

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:#888;padding:24px;">No records found</td></tr>'
    return
  }

  filtered.forEach((r, i) => {
    const isDuplicate = duplicatePhones.includes(String(r["Phone"]))
    const tr = document.createElement("tr")
    if (isDuplicate) tr.classList.add("duplicate-row")

    const timestamp = r["Timestamp"]
      ? new Date(r["Timestamp"]).toLocaleString()
      : ""

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${r["Name"] || ""}</td>
      <td>${r["Phone"] || ""}</td>
      <td>${r["Residence"] || ""}</td>
      <td><span class="badge ${r["First Time"] === "Yes" ? "badge-yes" : "badge-no"}">
        ${r["First Time"] || ""}
      </span></td>
      <td>${r["Course"] || ""}</td>
      <td>${r["Year"] || ""}</td>
      <td>${r["Event"] || ""}</td>
      <td>${r["Trip ID"] || ""}</td>
      <td>${timestamp}</td>
    `
    tbody.appendChild(tr)
  })
}

function exportCSV() {
  if (allRecords.length === 0) {
    alert("No data to export.")
    return
  }
  const headers = ["ID","Timestamp","Name","Phone","Residence","First Time","Course","Year","Event","Trip ID"]
  const rows = allRecords.map(r =>
    headers.map(h => `"${r[h] || ""}"`).join(",")
  )
  const csv = [headers.join(","), ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "manifest-transport-data.csv"
  a.click()
}