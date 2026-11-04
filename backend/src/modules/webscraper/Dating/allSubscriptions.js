import * as cheerio from 'cheerio';

const response = await fetch('https://www.abo24.de/dating_app-abo-vergleich');
const html = await response.text();
const $ = cheerio.load(html);



const tinderOffers = $('td[data-column="1"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const lovooOffers = $('td[data-column="2"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const bumbleOffers = $('td[data-column="3"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const badooOffers = $('td[data-column="4"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const cDateOffers = $('td[data-column="5"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const okCupidOffers = $('td[data-column="6"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const lemonSwanOffers = $('td[data-column="7"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const parshipOffers = $('td[data-column="8"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const neuDeOffers = $('td[data-column="9"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const grindrOffers = $('td[data-column="10"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const elitePartnerOffers = $('td[data-column="11"] a.offer-list-link')
    .map((_, el) => {
        const name = $(el).find('strong').text().trim();
        const price = $(el).text().replace(name, '').trim().replace(/^\(  |  \)$/g, '').trim();
        return { name, price };
    })
    .get();


const datingAppOffers = [
  { name: 'Tinder',        items: tinderOffers },
  { name: 'Lovoo',         items: lovooOffers },
  { name: 'Bumble',        items: bumbleOffers },

  { name: 'Badoo',         items: badooOffers },
  { name: 'C-Date',        items: cDateOffers },
  { name: 'OKCupid',       items: okCupidOffers },

  { name: 'LemonSwan',     items: lemonSwanOffers },
  { name: 'Parship',       items: parshipOffers },
  { name: 'Neu.de',        items: neuDeOffers },

  { name: 'Grindr',        items: grindrOffers },
  { name: 'ElitePartner',  items: elitePartnerOffers },
];

export {datingAppOffers}
