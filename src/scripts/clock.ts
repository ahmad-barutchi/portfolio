/**
 * Heure locale de Mons dans tout élément [data-clock] (« 14:32 CEST »).
 * Chargé sur toutes les pages par le Footer ; les autres composants posent
 * seulement <span data-clock>--:--</span>. Rafraîchi toutes les 15 s et au
 * retour sur l'onglet. Fuseau : PROFILE.timeZone (src/data/site.ts), recopié
 * ici pour ne pas embarquer tout l'objet PROFILE dans le bundle.
 */
const fmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Europe/Brussels',
  timeZoneName: 'short',
});

function tick(): void {
  let h = '';
  let m = '';
  let z = '';
  for (const p of fmt.formatToParts(new Date())) {
    if (p.type === 'hour') h = p.value;
    else if (p.type === 'minute') m = p.value;
    else if (p.type === 'timeZoneName') z = p.value;
  }
  const text = `${h}:${m} ${z}`;
  for (const el of document.querySelectorAll<HTMLElement>('[data-clock]')) {
    if (el.textContent !== text) el.textContent = text;
  }
}

tick();
setInterval(tick, 15_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tick();
});
