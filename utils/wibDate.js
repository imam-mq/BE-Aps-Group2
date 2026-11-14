const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// format "yyyy-mm-dd"
function toWibDateString(value) {
    return new Date(new Date(value).getTime() + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

function todayWib() {
    return toWibDateString(new Date());
}

// format yyyy-mm-dd jika bernilai true
function isRealDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0,10) === value;
}

// jumlah hari dari from ke to
function countDays(from, to) {
    const diffMs = new Date(`${to}T00:00:00Z`) - new Date(`${from}T00:00:00Z`);
    return Math.round(diffMs / DAY_MS) + 1;
}

// Batas UTC untuk rentang tanggal WIB: dari awal hari "from" sampai sebelum awal hari setelah "to"
function wibRangeToUtc(from, to) {
    const start = new Date(`${from}T00:00:00+07:00`);
    const end = new Date(new Date(`${to}T00:00:00+07:00`).getTime() + DAY_MS);
    return { start, end };
}

export { toWibDateString, todayWib, isRealDate, countDays, wibRangeToUtc };
