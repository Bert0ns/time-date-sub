
export type Locale = "it" | "en";

export type Dict = Record<string, string>;

const dictIt: Dict = {
  "app.title": "Calcolatore differenza tra date",
  "app.subtitle": "Inserisci due date/ore e ottieni la differenza in giorni, ore, minuti e secondi.",
  "footer.note": "Realizzato con Next.js, in collaborazione con GPT-5",
  "lang.label": "Lingua",
  "lang.it": "Italiano",
  "lang.en": "English",

  "field.start": "Inizio",
  "field.end": "Fine",

  "btn.nowStart": "Ora → Inizio",
  "btn.nowEnd": "Ora → Fine",
  "btn.swap": "Scambia",
  "btn.clear": "Pulisci",
  "btn.copyAll": "Copia risultato",

  "status.label": "Stato",
  "status.enterBoth": "Inserisci entrambe le date",
  "status.endBefore": "Fine precedente all'inizio",
  "status.endAfter": "Fine successiva all'inizio",
  "status.equal": "Date uguali",

  "card.breakdown": "Risultato",
  "card.totals": "Totali",
  "card.detail": "Dettaglio",

  "totals.hours": "Ore",
  "totals.minutes": "Minuti",
  "totals.seconds": "Secondi",

  "detail.days": "Giorni",
  "detail.hours": "Ore",
  "detail.minutes": "Minuti",
  "detail.seconds": "Secondi",

  "units.day.one": "giorno",
  "units.day.other": "giorni",
  "units.hour.one": "ora",
  "units.hour.other": "ore",
  "units.minute.one": "min",
  "units.minute.other": "min",
  "units.second.one": "s",
  "units.second.other": "s",

  "note": "Nota: il calcolo usa date locali; fusi orari e ora legale possono influenzare i risultati vicino ai cambi.",

  "toast.copied": "Copiato negli appunti",
  "toast.copyAll": "Risultato copiato",
  "toast.error": "Impossibile copiare",

  "copy.breakdown": "Scomposizione copiata",
  "copy.totalHours": "Ore totali copiate",
  "copy.totalMinutes": "Minuti totali copiati",
  "copy.totalSeconds": "Secondi totali copiati",
  "copy.days": "Giorni copiati",
  "copy.hours": "Ore copiate",
  "copy.minutes": "Minuti copiati",
  "copy.seconds": "Secondi copiati",
  "copy.header": "Differenza tra {start} e {end}",
  "list.and": " e ",
};

const dictEn: Dict = {
  "app.title": "Date difference calculator",
  "app.subtitle": "Enter two dates/times and get the difference in days, hours, minutes and seconds.",
  "footer.note": "Built with Next.js, with GPT-5 assistance",
  "lang.label": "Language",
  "lang.it": "Italiano",
  "lang.en": "English",

  "field.start": "Start",
  "field.end": "End",

  "btn.nowStart": "Now → Start",
  "btn.nowEnd": "Now → End",
  "btn.swap": "Swap",
  "btn.clear": "Clear",
  "btn.copyAll": "Copy result",

  "status.label": "Status",
  "status.enterBoth": "Enter both dates",
  "status.endBefore": "End before start",
  "status.endAfter": "End after start",
  "status.equal": "Dates are equal",

  "card.breakdown": "Breakdown",
  "card.totals": "Totals",
  "card.detail": "Detail",

  "totals.hours": "Hours",
  "totals.minutes": "Minutes",
  "totals.seconds": "Seconds",

  "detail.days": "Days",
  "detail.hours": "Hours",
  "detail.minutes": "Minutes",
  "detail.seconds": "Seconds",

  "units.day.one": "day",
  "units.day.other": "days",
  "units.hour.one": "hour",
  "units.hour.other": "hours",
  "units.minute.one": "min",
  "units.minute.other": "min",
  "units.second.one": "s",
  "units.second.other": "s",

  "note": "Note: calculation uses local dates; time zones and daylight saving may affect results near transitions.",

  "toast.copied": "Copied to clipboard",
  "toast.copyAll": "Result copied",
  "toast.error": "Unable to copy",

  "copy.breakdown": "Breakdown copied",
  "copy.totalHours": "Total hours copied",
  "copy.totalMinutes": "Total minutes copied",
  "copy.totalSeconds": "Total seconds copied",
  "copy.days": "Days copied",
  "copy.hours": "Hours copied",
  "copy.minutes": "Minutes copied",
  "copy.seconds": "Seconds copied",
  "copy.header": "Difference between {start} and {end}",
  "list.and": " and ",
};

export const DICTS: Record<Locale, Dict> = { it: dictIt, en: dictEn };